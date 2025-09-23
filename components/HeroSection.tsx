"use client"

import { memo, useCallback } from "react"
import { Download, Mail, Phone, MapPin, Linkedin, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import TerminalWindow from "@/components/TerminalWindow"
import DownloadPDFResume from "./downloadResume"
import Image from "next/image"
import { config } from "@/lib/config"

// NOTE: The jspdf library is an external dependency that must be loaded via a <script> tag from a CDN
// in your HTML for the download functionality to work. We are removing the direct import to resolve the compilation error.

interface ResumeData {
  personalInfo: {
    name: string
    email: string
    phone: string
    location: string
    linkedin: string
    github: string
    website: string
    summary: string
  }
}

interface HeroSectionProps {
  resumeData: ResumeData
}

const HeroSection = memo(({ resumeData }: HeroSectionProps) => {
  const handleDownloadResume = useCallback(async () => {
    try {
      // Call the backend PDF generation endpoint
      const response = await fetch(`${config.API_BASE_URL}/api/generate-pdf`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}) // Empty body since we fetch data from API
      })

      if (!response.ok) {
        throw new Error('Failed to generate PDF')
      }

      // Create blob and download
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${resumeData.personalInfo.name.replace(/\s+/g, '_')}_Resume_${new Date().getFullYear()}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Error generating PDF:', error)
      // Fallback to simple alert
      alert('Failed to generate PDF. Please try again.')
    }
  }, [resumeData.personalInfo.name])


  return (
    <div className="relative overflow-hidden">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        {/* Left side - Info */}
        <div className="transition-all duration-1000 animate-fade-in-up">
          <div className="flex flex-row md:flex-row items-center gap-6 mb-8">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[var(--vscode-blue)] p-1 bg-gradient-to-br from-[var(--vscode-blue)] to-[var(--vscode-green)]">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1753407168559-PCWiZjGAS8MtQhjaIJJBeSTHaxePdY.jpeg"
                  alt={`${resumeData.personalInfo.name} - Full Stack Developer`}
                  width={96}
                  height={96}
                  className="w-full h-full rounded-full object-cover grayscale hover:grayscale-0 transition-all duration-300"
                  priority
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#28ca42] rounded-full border-2 border-[#1e1e1e] flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              </div>
            </div>
            <div>
              <div className="text-[var(--vscode-keyword)] text-sm mb-1 font-mono">// Full Stack Developer</div>
              <h1 className="text-4xl md:text-5xl font-bold text-[var(--vscode-text)] mb-1">
                <span className="text-[var(--vscode-green)]">const</span> <span className="text-[var(--vscode-keyword)]">developer</span>{" "}
                <span className="text-[var(--vscode-text)]">=</span> <span className="text-[var(--vscode-string)]">"{resumeData.personalInfo.name}"</span>
              </h1>
              <div className="h-1 w-32 bg-gradient-to-r from-[var(--vscode-blue)] to-[var(--vscode-green)] rounded-full"></div>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex items-start gap-3 text-[var(--vscode-text-muted)]">
              <span className="text-[var(--vscode-keyword)] font-mono">experience:</span>
              <span className="text-[var(--vscode-string)]">"10+ years"</span>
            </div>
            <div className="flex items-start gap-3 text-[var(--vscode-text-muted)]">
              <span className="text-[var(--vscode-keyword)] font-mono">specialization:</span>
              <span className="text-[var(--vscode-string)]">"Full-Stack Web Development"</span>
            </div>
            <div className="flex items-start gap-3 text-[var(--vscode-text-muted)]">
              <span className="text-[var(--vscode-keyword)] font-mono">passion:</span>
              <span className="text-[var(--vscode-string)]">"Scalable & Secure Applications"</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mb-8">
            <div className="flex items-center gap-2 p-3 rounded bg-[var(--card)] hover:bg-[var(--popover)] transition-all">
              <MapPin className="w-4 h-4 text-[var(--vscode-green)]" />
              <span>Voorhees, NJ</span>
            </div>
            <div
              className="flex items-center gap-2 p-3 rounded bg-[var(--card)] hover:bg-[var(--popover)] transition-all cursor-pointer"
              onClick={() => {
                document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
              }}
            >
              <Phone className="w-4 h-4 text-[var(--vscode-green)]" />
              <span>Request a Call</span>
            </div>
            <div className="flex items-center gap-2 p-3 rounded bg-[var(--card)] hover:bg-[var(--popover)] transition-all">
              <Mail className="w-4 h-4 text-[var(--vscode-green)]" />
              <span>minaragaie@hotmail.com</span>
            </div>
            <div className="flex items-center gap-2 p-3 rounded bg-[var(--card)] hover:bg-[var(--popover)] transition-all">
              <Linkedin className="w-4 h-4 text-[var(--vscode-green)]" />
              <span>LinkedIn</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
           
            <DownloadPDFResume />
            {/* DownloadPDFResume */}
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-[#007acc] text-[#007acc] hover:bg-[#007acc] hover:text-white bg-transparent/80 backdrop-blur-sm shadow-md hover:shadow-lg">
              <ExternalLink className="w-4 h-4 mr-2" />
              View Portfolio
            </Button>
          </div>
        </div>
        {/* Right side - Terminal */}
        <TerminalWindow
          title="Hero Terminal"
          commands={[
              "$ whoami",
              `> ${resumeData.personalInfo.name} - Full Stack Developer`,
              "$ cat experience.txt",
              "> 10+ years of innovative web development",
              "$ ls skills/",
              "> Angular React Node.js TypeScript...",
              "$ git log --oneline",
              "> Ready for next challenge! 🚀",
            ]}/>
      </div>
    </div>
  )
})

HeroSection.displayName = 'HeroSection'
export default HeroSection
