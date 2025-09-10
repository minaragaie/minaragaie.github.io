"use client"

import React, { useEffect, useState } from "react"
import { Star, GitBranch, Code, ExternalLink } from "lucide-react"

interface Repo {
  name: string
  html_url: string
  description: string
  language: string
  stargazers_count: number
  forks_count: number
  commits_count: number
}

const languageColors: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f7df1e",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Python: "#3572A5",
  PHP: "#4F5D95",
  Java: "#b07219",
}

const GitHubActivity: React.FC<{ username: string }> = ({ username }) => {
  const [repos, setRepos] = useState<Repo[]>([])
  const [loading, setLoading] = useState(true)
  const [chartBg, setChartBg] = useState("ffffff")

  // fetch top commit repos
  useEffect(() => {
    const fetchTopRepos = async () => {
      try {
        const res = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`)
        const data: any[] = await res.json()

        const reposWithCommits = await Promise.all(
          data.map(async (repo) => {
            const commitsRes = await fetch(
              `https://api.github.com/repos/${username}/${repo.name}/commits?per_page=1`
            )
            const commitsLink = commitsRes.headers.get("link")
            let commits_count = 1
            if (commitsLink) {
              const match = commitsLink.match(/&page=(\d+)>; rel="last"/)
              if (match) commits_count = parseInt(match[1])
            }
            return {
              name: repo.name,
              html_url: repo.html_url,
              description: repo.description,
              language: repo.language,
              stargazers_count: repo.stargazers_count,
              forks_count: repo.forks_count,
              commits_count,
            }
          })
        )

        const topRepos = reposWithCommits.sort((a, b) => b.commits_count - a.commits_count).slice(0, 6)
        setRepos(topRepos)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchTopRepos()
  }, [username])

  // dynamically track theme color changes
  useEffect(() => {
    const updateBg = () => {
      const bgColor = getComputedStyle(document.documentElement)
        .getPropertyValue("--bg-primary")
        .trim()
        .replace("#", "")
      setChartBg(bgColor || "ffffff")
    }

    updateBg() // initial

    // Observe changes to theme variables
    const observer = new MutationObserver(updateBg)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["style"] })

    return () => observer.disconnect()
  }, [])

  return (
    <>
      {/* Top Commit Repos Section */}
      <section className="py-20 px-4 md:px-8 bg-[var(--bg-primary)]">
        <h2 className="text-3xl font-bold mb-8 text-center">Top Committed Repos</h2>
        {loading ? (
          <p className="text-center">Loading top commit repos...</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {repos.map((repo) => (
              <a
                key={repo.name}
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-5 border rounded-xl bg-[var(--bg-primary)] hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <h3 className="font-semibold text-lg flex items-center justify-between">
                    {repo.name} <ExternalLink className="w-4 h-4 text-[var(--vscode-text)]" />
                  </h3>
                  <p className="text-sm mt-2 min-h-[40px]">{repo.description || "No description"}</p>
                </div>

                <div className="flex justify-between items-center mt-4 text-xs text-[var(--vscode-tab-inactiveForeground,#888)]">
                  <div className="flex items-center gap-2">
                    {repo.language && (
                      <span className="flex items-center gap-1">
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: languageColors[repo.language] || "#888" }}
                        />
                        {repo.language}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-4">
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3" /> {repo.stargazers_count}
                    </span>
                    <span className="flex items-center gap-1">
                      <GitBranch className="w-3 h-3" /> {repo.forks_count}
                    </span>
                    <span className="flex items-center gap-1">
                      <Code className="w-3 h-3" /> {repo.commits_count}
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </section>

      {/* GitHub Contributions Chart Section */}
      <section className="py-20 px-4 md:px-8 bg-[var(--bg-secondary)]">
        <h2 className="text-2xl font-bold mb-6 text-center">GitHub Contributions</h2>
        <div className="flex justify-center">
          <img
            src={`https://ghchart.rshah.org/${username}?bg_color=${chartBg}`}
            alt={`${username} GitHub contributions`}
            className="w-full max-w-3xl rounded-lg shadow-lg"
          />
        </div>
      </section>
    </>
  )
}

export default GitHubActivity
