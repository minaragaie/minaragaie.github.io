"use client"

import { useState } from "react"
import { Award, CheckCircle, Clock, ExternalLink, RotateCcw, Sun, Moon } from "lucide-react"
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

  const handleVerify = (cert: any) => {
    if (cert.verify) {
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
      if (newSet.has(index)) {
        newSet.delete(index)
      } else {
        newSet.add(index)
      }
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
      // <div className="absolute top-4 right-4 z-50">
        
      // </div>/
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

                  <div className="rounded p-3 sm:p-4 mb-3 sm:mb-4" style={{ backgroundColor: "var(--certificates-bg-tertiary)" }}>
                    <code className="text-xs font-mono" style={{ color: "var(--certificates-text-code)" }}>// Certification Details</code>
                    <p className="mt-2 text-xs sm:text-sm leading-relaxed line-clamp-3 sm:line-clamp-none" style={{ color: "var(--certificates-text-primary)" }}>
                      {cert.description}
                    </p>
                  </div>

                  {cert.skills.length > 0 && (
                    <div className="mb-3 sm:mb-4">
                      <h4 className="text-xs sm:text-sm font-semibold mb-2 font-mono" style={{ color: "var(--certificates-text-code)" }}>// Key Skills:</h4>
                      <div className="flex flex-wrap gap-1 sm:gap-2">
                        {cert.skills
                          .slice(0, window.innerWidth < 640 ? 4 : cert.skills.length)
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
                        {cert.skills.length > 4 && window.innerWidth < 640 && (
                          <Badge variant="outline" className="text-xs px-1" style={{ color: "var(--certificates-text-secondary)", borderColor: "var(--certificates-text-secondary)", backgroundColor: "var(--certificates-bg-primary)" }}>
                            +{cert.skills.length - 4}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                    <div className=" flex flex-col flex-nowrap justify-between items-start shrink gap-2">
                    <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">

                      {cert.pathway && cert.pathway.length > 0 && (
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-[#dcb67a]/10 to-[#dcb67a]/5 hover:from-[#dcb67a] hover:to-[#f0c674] text-[#dcb67a] hover:text-black border-2 border-[#dcb67a]/30 hover:border-[#dcb67a] transition-all shadow-md hover:shadow-lg backdrop-blur-sm text-xs px-2 py-1 h-auto"
                          onClick={() => toggleCardFlip(index)}
                        >
                          <RotateCcw className="w-3 h-3 sm:mr-2" />
                          <span className="font-mono text-xs hidden sm:inline">viewPathway()</span>
                        </Button>
                      )}
                      {cert.verify && (
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-[#4ec9b0]/10 to-[#4ec9b0]/5 hover:from-[#4ec9b0] hover:to-[#0086d4] text-[#4ec9b0] hover:text-white border-2 border-[#4ec9b0]/30 hover:border-[#4ec9b0] transition-all shadow-md hover:shadow-lg backdrop-blur-sm text-xs px-2 py-1 h-auto"
                          onClick={() => handleVerify(cert)}
                        >
                          <ExternalLink className="w-3 h-3 sm:mr-2" />
                          <span className="font-mono text-xs hidden sm:inline">verify()</span>
                        </Button>
                      )}
                      </div>
                      <div className="">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
                          <div className="flex items-center gap-2 text-xs sm:text-sm truncate" style={{ color: "var(--certificates-text-primary)" }}>
                            <span className="font-mono" style={{ color: "var(--certificates-text-code)" }}>issuer:</span>
                            <span className="truncate" style={{ color: "var(--certificates-text-string)" }}>"{cert.issuer}"</span>
                          </div>
                        </div>
                      </div>
                      
                    </div>


                  </div>

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
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                      <div>
                        <h3 className="text-sm sm:text-lg font-bold mb-1" style={{ color: "var(--certificates-text-primary)" }}>Certificate Pathway</h3>
                        <p className="text-xs sm:text-sm font-mono" style={{ color: "var(--certificates-color-yellow)" }}>{cert.pathway.length} components</p>
                      </div>
                      <Button
                      size="sm"
                      variant="ghost"
                      className="text-[#dcb67a] hover:bg-[#dcb67a]/10 p-1 sm:p-2"
                      onClick={() => toggleCardFlip(index)}
                    >
                      <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>

                    </div>
                    
                    <div className="space-y-2 sm:space-y-4">
                      {cert.pathway.map((pathwayCert, pathwayIndex) => (
                        <div
                          key={pathwayIndex}
                          className="rounded-lg p-3 sm:p-4"
                          style={{
                            backgroundColor: "var(--certificates-bg-primary)",
                            border: "1px solid var(--certificates-border-color)",
                            transition: "all 0.3s",
                          }}
                        >
                          <div className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
                            <div className="p-1 sm:p-2 rounded flex-shrink-0" style={{ backgroundImage: "linear-gradient(to bottom right, var(--certificates-color-green), var(--certificates-color-cyan))" }}>
                              <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" style={{ color: "var(--certificates-bg-primary)" }} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-xs sm:text-sm font-bold mb-1 truncate" style={{ color: "var(--certificates-text-primary)" }}>
                                {pathwayCert.name}
                              </h4>
                              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-2">
                                <span className="text-xs truncate" style={{ color: "var(--certificates-text-accent)" }}>{pathwayCert.issuer}</span>
                                <Badge
                                  variant="outline"
                                  className={`text-xs ${getStatusColor(pathwayCert.status)} w-fit`}
                                >
                                  {pathwayCert.status}
                                </Badge>
                              </div>
                            </div>
                          </div>

                          <p className="text-xs mb-2 sm:mb-3 line-clamp-2" style={{ color: "var(--certificates-text-primary)" }}>{pathwayCert.description}</p>

                          {pathwayCert.skills.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-2 sm:mb-3">
                              {pathwayCert.skills.slice(0, 2).map((skill, skillIndex) => (
                                <Badge
                                  key={skillIndex}
                                  variant="outline"
                                  className="text-xs px-1 py-0"
                                  style={{ color: "var(--certificates-color-cyan)", borderColor: "var(--certificates-color-cyan)", backgroundColor: "var(--certificates-bg-primary)" }}
                                >
                                  {skill}
                                </Badge>
                              ))}
                              {pathwayCert.skills.length > 2 && (
                                <Badge
                                  variant="outline"
                                  className="text-xs px-1 py-0"
                                  style={{ color: "var(--certificates-text-secondary)", borderColor: "var(--certificates-text-secondary)", backgroundColor: "var(--certificates-bg-primary)" }}
                                >
                                  +{pathwayCert.skills.length - 2}
                                </Badge>
                              )}
                            </div>
                          )}

                          {pathwayCert.verify && (
                          <div className="flex justify-end">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-xs text-[#4ec9b0] hover:bg-[#4ec9b0]/10 p-1 h-auto"
                              onClick={() => handleVerify(pathwayCert)}
                            >
                              <ExternalLink className="w-3 h-3 mr-1" />
                              verify
                            </Button>
                          </div>
                        )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {selectedCert && selectedCert.pathway && (
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-lg flex items-center justify-center p-2 sm:p-4 z-[100000]"
            style={{ isolation: "isolate" }}
          >
            <div
              className="rounded-xl max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden shadow-2xl"
              style={{
                backgroundImage: "linear-gradient(to bottom right, var(--certificates-bg-secondary), var(--certificates-bg-tertiary))",
                border: "1px solid var(--certificates-text-accent)",
              }}
            >
              <div className="p-4 sm:p-6" style={{ backgroundImage: "linear-gradient(to right, var(--certificates-color-blue), var(--certificates-color-cyan))", color: "white" }}>
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg sm:text-2xl font-bold truncate">{selectedCert.name}</h3>
                    <p className="mt-1 text-sm sm:text-base opacity-90">
                      Certificate Pathway ({selectedCert.pathway.length} components)
                    </p>
                  </div>
                  <Button
                    onClick={closePathwayModal}
                    className="p-2 rounded-lg transition-colors flex-shrink-0 ml-2 hover:bg-white/20"
                  >
                    <RotateCcw className="w-5 h-5 sm:w-6 sm:h-6" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 sm:p-4 border-b" style={{ backgroundColor: "var(--certificates-bg-tertiary)", borderColor: "var(--certificates-border-color)" }}>
                <button
                  onClick={prevPathway}
                  disabled={currentPathwayIndex === 0}
                  className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                  style={{ backgroundColor: "var(--certificates-border-color)", color: "var(--certificates-text-primary)" }}
                >
                  <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="text-xs sm:text-sm font-mono hidden sm:inline">Previous</span>
                </button>

                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs sm:text-sm" style={{ color: "var(--certificates-text-primary)" }}>
                    {currentPathwayIndex + 1} / {selectedCert.pathway.length}
                  </span>
                  <div className="flex gap-1">
                    {selectedCert.pathway.map((_, index) => (
                      <div
                        key={index}
                        className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-colors ${
                          index === currentPathwayIndex ? "bg-[var(--certificates-color-blue)]" : "bg-[var(--certificates-border-color)]"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <button
                  onClick={nextPathway}
                  disabled={currentPathwayIndex === selectedCert.pathway.length - 1}
                  className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                  style={{ backgroundColor: "var(--certificates-border-color)", color: "var(--certificates-text-primary)" }}
                >
                  <span className="text-xs sm:text-sm font-mono hidden sm:inline">Next</span>
                  <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </div>

              <div className="p-3 sm:p-6 overflow-y-auto max-h-[60vh]">
                {selectedCert.pathway[currentPathwayIndex] && (
                  <div className="rounded-lg p-4 sm:p-6" style={{ backgroundColor: "var(--certificates-bg-primary)", border: "1px solid var(--certificates-border-color)" }}>
                    <div className="flex items-start gap-4 mb-6">
                      <div className="p-3 rounded-lg" style={{ backgroundImage: "linear-gradient(to bottom right, var(--certificates-color-green), var(--certificates-color-cyan))" }}>
                        <CheckCircle className="w-6 h-6" style={{ color: "var(--certificates-bg-primary)" }} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-xl font-bold" style={{ color: "var(--certificates-text-primary)" }}>
                            {selectedCert.pathway[currentPathwayIndex].name}
                          </h4>
                          {getStatusIcon(selectedCert.pathway[currentPathwayIndex].status)}
                        </div>
                        <div className="flex items-center gap-3 mb-3">
                          <span className="font-semibold" style={{ color: "var(--certificates-text-accent)" }}>
                            {selectedCert.pathway[currentPathwayIndex].issuer}
                          </span>
                          <Badge
                            variant="outline"
                            className={getStatusColor(selectedCert.pathway[currentPathwayIndex].status)}
                          >
                            {selectedCert.pathway[currentPathwayIndex].status}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="rounded p-4 mb-4" style={{ backgroundColor: "var(--certificates-bg-tertiary)" }}>
                      <code className="text-xs font-mono" style={{ color: "var(--certificates-text-code)" }}>// Component Description</code>
                      <p className="mt-2 leading-relaxed" style={{ color: "var(--certificates-text-primary)" }}>
                        {selectedCert.pathway[currentPathwayIndex].description}
                      </p>
                    </div>

                    {selectedCert.pathway[currentPathwayIndex].skills.length > 0 && (
                      <div className="mb-4">
                        <h5 className="text-sm font-semibold mb-2 font-mono" style={{ color: "var(--certificates-text-code)" }}>// Skills:</h5>
                        <div className="flex flex-wrap gap-2">
                          {selectedCert.pathway[currentPathwayIndex].skills.map((skill, skillIndex) => (
                            <Badge
                              key={skillIndex}
                              variant="outline"
                              className="text-xs"
                              style={{ color: "var(--certificates-color-cyan)", borderColor: "var(--certificates-color-cyan)", backgroundColor: "var(--certificates-bg-primary)" }}
                            >
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                     {selectedCert.pathway[currentPathwayIndex].verify && (
                    <div className="flex justify-end">
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-[#4ec9b0]/10 to-[#4ec9b0]/5 hover:from-[#4ec9b0] hover:to-[#0086d4] text-[#4ec9b0] hover:text-white border-2 border-[#4ec9b0]/30 hover:border-[#4ec9b0] transition-all shadow-md hover:shadow-lg backdrop-blur-sm"
                        onClick={() => handleVerify(selectedCert.pathway![currentPathwayIndex])}
                      >
                        <ExternalLink className="w-3 h-3 mr-2" />
                        <span className="font-mono text-xs">verify()</span>
                      </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 sm:mt-12 text-center">
          <div className="rounded-lg p-4 sm:p-6 max-w-4xl mx-auto" style={{ backgroundColor: "var(--certificates-bg-secondary)", border: "1px solid var(--certificates-border-color)" }}>
            <div className="flex items-center gap-3 mb-4">
              <Award className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: "var(--certificates-color-yellow)" }} />
              <h3 className="text-base sm:text-lg font-semibold" style={{ color: "var(--certificates-text-primary)" }}>Additional Information</h3>
            </div>
            <p className="leading-relaxed text-sm sm:text-base" style={{ color: "var(--certificates-text-primary)" }}>{resumeData.additionalInfo}</p>
          </div>
        </div>
      </div>
  )
}
