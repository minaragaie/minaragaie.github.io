"use client"

import { useState, useEffect } from "react"
import { Award, CheckCircle, Clock, ExternalLink, RotateCcw } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import resumeData from "@/data/resume.json"
import { Button } from "./ui/button"

interface Certificate {
  name: string
  issuer: string
  status: string
  description: string
  color: string
  skills: string[]
  icon: string
  verify?: string
  pathway?: Certificate[]
}

interface CertificationsSectionProps {
  isVisible?: boolean
}

export default function CertificationsSection({ isVisible = false }: CertificationsSectionProps) {
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null)
  const [currentPathwayIndex, setCurrentPathwayIndex] = useState(0)
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set())
  const [windowWidth, setWindowWidth] = useState<number>(0)

  // Only run on client
  useEffect(() => {
    if (typeof window !== "undefined") {
      setWindowWidth(window.innerWidth)
      const handleResize = () => setWindowWidth(window.innerWidth)
      window.addEventListener("resize", handleResize)
      return () => window.removeEventListener("resize", handleResize)
    }
  }, [])

  const handleVerify = (cert: Certificate) => {
    if (cert.verify && typeof window !== "undefined") {
      window.open(cert.verify, "_blank")
    } else {
      console.warn(`No verification link available for: ${cert.name}`)
    }
  }

  const openPathwayModal = (cert: Certificate) => {
    setSelectedCert(cert)
    setCurrentPathwayIndex(0)
  }

  const closePathwayModal = () => {
    setSelectedCert(null)
    setCurrentPathwayIndex(0)
  }

  const nextPathway = () => {
    if (selectedCert?.pathway && currentPathwayIndex < selectedCert.pathway.length - 1) {
      setCurrentPathwayIndex(currentPathwayIndex + 1)
    }
  }

  const prevPathway = () => {
    if (currentPathwayIndex > 0) {
      setCurrentPathwayIndex(currentPathwayIndex - 1)
    }
  }

  const toggleCardFlip = (index: number) => {
    setFlippedCards((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(index)) newSet.delete(index)
      else newSet.add(index)
      return newSet
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return <CheckCircle className="w-4 h-4" style={{ color: "var(--certificates-color-green)" }} />
      case "studied and attended exam":
        return <Clock className="w-4 h-4" style={{ color: "var(--certificates-color-yellow)" }} />
      default:
        return <Award className="w-4 h-4" style={{ color: "var(--certificates-color-cyan)" }} />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "border-[var(--certificates-color-green)] text-[var(--certificates-color-green)]"
      case "studied and attended exam":
        return "border-[var(--certificates-color-yellow)] text-[var(--certificates-color-yellow)]"
      default:
        return "border-[var(--certificates-color-cyan)] text-[var(--certificates-color-cyan)]"
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8 sm:mb-16">
        <h2 className="text-2xl sm:text-4xl font-bold mb-4" style={{ color: "var(--certificates-text-primary)" }}>
          <span className="font-mono" style={{ color: "var(--certificates-text-code)" }}>const</span> <span style={{ color: "var(--certificates-color-cyan)" }}>certifications</span>{" "}
          <span style={{ color: "var(--certificates-text-primary)" }}>=</span> <span style={{ color: "var(--certificates-text-string)" }}>[]</span>
        </h2>
        <p className="max-w-2xl mx-auto font-mono text-sm sm:text-base" style={{ color: "var(--certificates-text-secondary)" }}>
          // Continuous learning and professional development
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
        {(resumeData.certifications as Certificate[]).map((cert, index) => (
          <div
            key={index}
            className={`flex transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
            style={{
              transitionDelay: `${index * 200}ms`,
              perspective: "1000px",
            }}
          >
            <div
              className={`flex w-full h-full transition-transform duration-700 transform-style-preserve-3d ${
                flippedCards.has(index) ? "rotate-y-180" : ""
              }`}
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Front Card */}
              <div
                className=" flex flex-col w-full h-full rounded-lg p-4 sm:p-8 hover:shadow-lg backface-hidden"
                style={{
                  backfaceVisibility: "hidden",
                  backgroundColor: "var(--certificates-bg-secondary)",
                  border: "1px solid var(--certificates-border-color)",
                  transition: "all 0.3s",
                }}
              >
                <div className="flex items-start gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div className="p-2 sm:p-3 rounded-lg flex-shrink-0" style={{ backgroundImage: "linear-gradient(to bottom right, var(--certificates-color-blue), var(--certificates-color-cyan))" }}>
                    <Award className="w-4 h-4 sm:w-6 sm:h-6" style={{ color: "var(--certificates-bg-primary)" }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 sm:gap-3 mb-2">
                      <h3 className="text-sm sm:text-lg font-bold truncate" style={{ color: "var(--certificates-text-primary)" }}>{cert.name}</h3>
                      {getStatusIcon(cert.status)}
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mb-3 sm:mb-4">
                      <span className="font-semibold text-xs sm:text-sm truncate" style={{ color: "var(--certificates-text-accent)" }}>{cert.issuer}</span>
                      <Badge variant="outline" className={`${getStatusColor(cert.status)} text-xs w-fit`}>
                        {cert.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                {cert.skills.length > 0 && windowWidth > 0 && (
                  <div className="mb-3 sm:mb-4">
                    <h4 className="text-xs sm:text-sm font-semibold mb-2 font-mono" style={{ color: "var(--certificates-text-code)" }}>// Key Skills:</h4>
                    <div className="flex flex-wrap gap-1 sm:gap-2">
                      {cert.skills
                        .slice(0, windowWidth < 640 ? 4 : cert.skills.length)
                        .map((skill, skillIndex) => (
                          <Badge
                            key={skillIndex}
                            variant="outline"
                            className="text-xs px-1 sm:px-2"
                            style={{ color: "var(--certificates-color-cyan)", borderColor: "var(--certificates-color-cyan)", backgroundColor: "var(--certificates-bg-primary)" }}
                          >
                            {skill}
                          </Badge>
                        ))}
                      {cert.skills.length > 4 && windowWidth < 640 && (
                        <Badge variant="outline" className="text-xs px-1" style={{ color: "var(--certificates-text-secondary)", borderColor: "var(--certificates-text-secondary)", backgroundColor: "var(--certificates-bg-primary)" }}>
                          +{cert.skills.length - 4}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                  {cert.pathway && cert.pathway.length > 0 && (
                    <Button size="sm" onClick={() => toggleCardFlip(index)}>View Pathway</Button>
                  )}
                  {cert.verify && (
                    <Button size="sm" onClick={() => handleVerify(cert)}>Verify</Button>
                  )}
                </div>
              </div>

              {/* Back Card */}
              {cert.pathway && cert.pathway.length > 0 && (
                <div
                  className="absolute inset-0 w-full h-full rounded-lg p-3 sm:p-6 backface-hidden rotate-y-180 overflow-y-auto"
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                    backgroundImage: "linear-gradient(to bottom right, var(--certificates-bg-tertiary), var(--certificates-bg-secondary))",
                    border: "1px solid var(--certificates-color-yellow)",
                  }}
                >
                  {/* Pathway content here */}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
