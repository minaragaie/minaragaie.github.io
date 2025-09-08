"use client"

import { useState, useEffect } from "react"
import HeroSection from "@/components/HeroSection"
import ProjectsSection from "@/components/ProjectsSection"
import ExperienceSection from "@/components/ExperienceSection"
import TechnologiesSection from "@/components/TechnologiesSection"
import EducationSection from "@/components/EducationSection"
import CertificationsSection from "@/components/CertificationsSection"
import ContactSection from "@/components/ContactSection"
import StatusBar from "@/components/StatusBar"
import LogoLoader from "@/components/LogoLoader"
import Sidebar from "@/components/Sidebar"
import Header from "@/components/Header"

export default function Resume() {
  const [isLoading, setIsLoading] = useState(true)
  const [currentSection, setCurrentSection] = useState("")
  const [status, setStatus] = useState("Ready for next challenge")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true)
  const [animationStates, setAnimationStates] = useState({
    hero: true,
    projects: false,
    experience: false,
    technologies: false,
    education: false,
    certifications: false,
    contact: false,
  })

  useEffect(() => {
    const handleThemeChange = () => setCurrentSection((prev) => prev)
    window.addEventListener("themeChange", handleThemeChange)
    return () => window.removeEventListener("themeChange", handleThemeChange)
  }, [])

  useEffect(() => {
    if (isLoading) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const sectionId = entry.target.id as keyof typeof animationStates
          if (entry.isIntersecting) {
            setCurrentSection(sectionId)
            setAnimationStates((prev) => ({ ...prev, [sectionId]: true }))
          }
        })
      },
      { threshold: 0.1, rootMargin: "-10% 0px -10% 0px" }
    )
    const sections = document.querySelectorAll("section[id]")
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [isLoading])

  if (isLoading) return <LogoLoader onLoadComplete={() => setIsLoading(false)} />

  return (
    <div className="bg-[var(--vscode-bg)] text-[var(--vscode-text)] flex flex-col min-h-screen transition-colors duration-300">
      
      <div className="main-container w-full flex flex-row overflow-x-hidden">
        <Sidebar
          currentSection={currentSection}
          onSectionClick={setCurrentSection}
          isCollapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        <div className="flex-1 flex flex-col h-screen overflow-hidden transition-all duration-300">
          <Header />
          <main className="flex-1 flex flex-col overflow-y-auto transition-all duration-300">
            <section id="hero" className="py-20 px-4 md:px-8 bg-[var(--bg-primary)]">
              <HeroSection isVisible={animationStates.hero} />
            </section>

            <section id="projects" className="py-20 px-4 md:px-8 bg-[var(--bg-secondary)]">
              <ProjectsSection isVisible={animationStates.projects} />
            </section>

            <section id="experience" className="py-20 px-4 md:px-8 bg-[var(--bg-primary)]">
              <ExperienceSection isVisible={animationStates.experience} />
            </section>

            <section id="technologies" className="py-20 px-4 md:px-8 bg-[var(--bg-secondary)]">
              <TechnologiesSection isVisible={animationStates.technologies} />
            </section>

            <section id="education" className="py-20 px-4 md:px-8 bg-[var(--bg-primary)]">
              <EducationSection isVisible={animationStates.education} />
            </section>

            <section id="certifications" className="py-20 px-4 md:px-8 bg-[var(--bg-secondary)]">
              <CertificationsSection isVisible={animationStates.certifications} />
            </section>

            <section id="contact" className="py-20 px-4 md:px-8 bg-[var(--bg-primary)]">
              <ContactSection isVisible={animationStates.contact} onStatusChange={setStatus} />
            </section>
          </main>
        </div>
      </div>
      <StatusBar status={status} onStatusChange={setStatus} sidebarCollapsed={sidebarCollapsed} />
    </div>
  )
}
