"use client"

import { useState, useEffect } from "react"
import HeroSection from "@/components/HeroSection"
import ProjectsSection from "@/components/ProjectsSection"
import ExperienceSection from "@/components/ExperienceSection"
import TechnologiesSection from "@/components/TechnologiesSection"
import EducationSection from "@/components/EducationSection"
import CertificationsSection from "@/components/CertificationsSection"
import ContactSection from "@/components/ContactSection"

export default function Resume() {
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
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const sectionId = entry.target.id as keyof typeof animationStates
          if (entry.isIntersecting) {
            setAnimationStates((prev) => ({ ...prev, [sectionId]: true }))
          }
        })
      },
      { threshold: 0.1, rootMargin: "-10% 0px -10% 0px" }
    )
    const sections = document.querySelectorAll("section[id]")
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  return (
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
        <ContactSection isVisible={animationStates.contact} />
      </section>
    </main>
  )
}
