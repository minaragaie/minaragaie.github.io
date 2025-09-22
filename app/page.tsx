"use client"

import { memo } from "react"
import HeroSection from "@/components/HeroSection"
import ProjectsSection from "@/components/ProjectsSection"
import ExperienceSection from "@/components/ExperienceSection"
import TechnologiesSection from "@/components/TechnologiesSection"
import EducationSection from "@/components/EducationSection"
import CertificationsSection from "@/components/CertificationsSection"
import ContactSection from "@/components/ContactSection"
import ScrollAnimatedSection from "@/components/ScrollAnimatedSection"

const Resume = memo(() => {
  return (
    <div className="flex flex-col transition-all duration-300">
      <section 
        id="hero" 
        className="py-20 px-4 md:px-8 bg-[var(--bg-primary)] devtool-section-primary"
      >
        <ScrollAnimatedSection animationType="fade" delay={200}>
          <HeroSection />
        </ScrollAnimatedSection>
      </section>

      <section 
        id="projects" 
        className="py-20 px-4 md:px-8 bg-[var(--bg-secondary)] devtool-section-secondary"
      >
        <ScrollAnimatedSection animationType="slideUp" delay={100}>
          <ProjectsSection />
        </ScrollAnimatedSection>
      </section>

      <section 
        id="experience" 
        className="py-20 px-4 md:px-8 bg-[var(--bg-primary)] devtool-section-primary"
      >
        <ScrollAnimatedSection animationType="slideLeft" delay={150}>
          <ExperienceSection />
        </ScrollAnimatedSection>
      </section>

      <section 
        id="technologies" 
        className="py-20 px-4 md:px-8 bg-[var(--bg-secondary)] devtool-section-secondary"
      >
        <ScrollAnimatedSection animationType="scale" delay={100}>
          <TechnologiesSection />
        </ScrollAnimatedSection>
      </section>

      <section 
        id="education" 
        className="py-20 px-4 md:px-8 bg-[var(--bg-primary)] devtool-section-primary"
      >
        <ScrollAnimatedSection animationType="slideRight" delay={200}>
          <EducationSection />
        </ScrollAnimatedSection>
      </section>

      <section 
        id="certifications" 
        className="py-20 px-4 md:px-8 bg-[var(--bg-secondary)] devtool-section-secondary"
      >
        <ScrollAnimatedSection animationType="slideUp" delay={100}>
          <CertificationsSection />
        </ScrollAnimatedSection>
      </section>

      <section 
        id="contact" 
        className="py-20 px-4 md:px-8 bg-[var(--bg-primary)] devtool-section-primary"
      >
        <ScrollAnimatedSection animationType="scale" delay={300}>
          <ContactSection />
        </ScrollAnimatedSection>
      </section>
    </div>
  )
})

Resume.displayName = 'Resume'
export default Resume
