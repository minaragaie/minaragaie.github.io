"use client"

import { memo } from "react"
import HeroSection from "@/components/HeroSection"
import ProjectsSection from "@/components/ProjectsSection"
import ExperienceSection from "@/components/ExperienceSection"
import TechnologiesSection from "@/components/TechnologiesSection"
import EducationSection from "@/components/EducationSection"
import CertificationsSection from "@/components/CertificationsSection"
import ContactSection from "@/components/ContactSection"
// import AnalyticsDashboard from "@/components/next-release/AnalyticsDashboard" // TODO: Next release
// import ProfessionalMetrics from "@/components/next-release/ProfessionalMetrics" // TODO: Next release
// import InteractiveDemo from "@/components/next-release/InteractiveDemo" // TODO: Next release
// import TestimonialsSection from "@/components/next-release/TestimonialsSection" // TODO: Next release
// import CaseStudiesSection from "@/components/next-release/CaseStudiesSection" // TODO: Next release
// import EnhancedContactSection from "@/components/next-release/EnhancedContactSection" // TODO: Next release
// import SmartRecommendations from "@/components/next-release/SmartRecommendations" // TODO: Next release
// import SkillAssessment from "@/components/next-release/SkillAssessment" // TODO: Next release
import ScrollAnimatedSection from "@/components/ScrollAnimatedSection"
import { useResumeData } from "@/hooks/useResumeData"

const Resume = memo(() => {
  const { resumeData, loading, error } = useResumeData()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen loading-state">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[var(--vscode-blue)] mx-auto"></div>
          <p className="mt-4">Loading resume data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen error-state">
        <div className="text-center">
          <p className="text-[var(--vscode-error)]">Error loading resume data: {error}</p>
          <p className="mt-2">Please try refreshing the page</p>
        </div>
      </div>
    )
  }

  if (!resumeData) {
    return (
      <div className="flex items-center justify-center min-h-screen no-data-state">
        <div className="text-center">
          <p>No resume data available</p>
        </div>
      </div>
    )
  }
  return (
    <div className="flex flex-col transition-all duration-300">
      <section 
        id="hero" 
        className="py-20 px-4 md:px-8 bg-[var(--bg-primary-gradient)] devtool-section-primary"
      >
        <ScrollAnimatedSection animationType="fade" delay={200}>
          <HeroSection resumeData={resumeData} />
        </ScrollAnimatedSection>
      </section>

      <section 
        id="projects" 
        className="py-20 px-4 md:px-8 bg-[var(--bg-secondary)] devtool-section-secondary"
      >
        <ScrollAnimatedSection animationType="slideUp" delay={100}>
          <ProjectsSection resumeData={resumeData} />
        </ScrollAnimatedSection>
      </section>

      <section 
        id="experience" 
        className="py-20 px-4 md:px-8 bg-[var(--bg-primary-gradient)] devtool-section-primary"
      >
        <ScrollAnimatedSection animationType="slideLeft" delay={150}>
          <ExperienceSection resumeData={resumeData} />
        </ScrollAnimatedSection>
      </section>

      <section 
        id="technologies" 
        className="py-20 px-4 md:px-8 bg-[var(--bg-secondary)] devtool-section-secondary"
      >
        <ScrollAnimatedSection animationType="scale" delay={100}>
          <TechnologiesSection resumeData={resumeData} />
        </ScrollAnimatedSection>
      </section>

      <section 
        id="education" 
        className="py-20 px-4 md:px-8 bg-[var(--bg-primary-gradient)] devtool-section-primary"
      >
        <ScrollAnimatedSection animationType="slideRight" delay={200}>
          <EducationSection resumeData={resumeData} />
        </ScrollAnimatedSection>
      </section>

      <section 
        id="certifications" 
        className="py-20 px-4 md:px-8 bg-[var(--bg-secondary)] devtool-section-secondary"
      >
        <ScrollAnimatedSection animationType="slideUp" delay={100}>
          <CertificationsSection resumeData={resumeData} />
        </ScrollAnimatedSection>
      </section>

      {/* TODO: Next release - Analytics Dashboard */}
      {/* <section 
        id="analytics" 
        className="py-20 px-4 md:px-8 bg-[var(--bg-primary-gradient)] devtool-section-primary"
      >
        <ScrollAnimatedSection animationType="fade" delay={200}>
          <AnalyticsDashboard />
        </ScrollAnimatedSection>
      </section> */}

      {/* TODO: Next release - Professional Metrics */}
      {/* <section 
        id="metrics" 
        className="py-20 px-4 md:px-8 bg-[var(--bg-secondary)] devtool-section-secondary"
      >
        <ScrollAnimatedSection animationType="slideUp" delay={150}>
          <ProfessionalMetrics />
        </ScrollAnimatedSection>
      </section> */}

      {/* TODO: Next release - Interactive Demo */}
      {/* <section 
        id="demo" 
        className="py-20 px-4 md:px-8 bg-[var(--bg-primary-gradient)] devtool-section-primary"
      >
        <ScrollAnimatedSection animationType="fade" delay={200}>
          <InteractiveDemo />
        </ScrollAnimatedSection>
      </section> */}

      {/* TODO: Next release - Testimonials */}
      {/* <section 
        id="testimonials" 
        className="py-20 px-4 md:px-8 bg-[var(--bg-secondary)] devtool-section-secondary"
      >
        <ScrollAnimatedSection animationType="slideUp" delay={150}>
          <TestimonialsSection />
        </ScrollAnimatedSection>
      </section> */}

      {/* TODO: Next release - Case Studies */}
      {/* <section 
        id="case-studies" 
        className="py-20 px-4 md:px-8 bg-[var(--bg-primary-gradient)] devtool-section-primary"
      >
        <ScrollAnimatedSection animationType="fade" delay={200}>
          <CaseStudiesSection />
        </ScrollAnimatedSection>
      </section> */}

      {/* TODO: Next release - Smart Recommendations */}
      {/* <section 
        id="recommendations" 
        className="py-20 px-4 md:px-8 bg-[var(--bg-secondary)] devtool-section-secondary"
      >
        <ScrollAnimatedSection animationType="slideUp" delay={150}>
          <SmartRecommendations />
        </ScrollAnimatedSection>
      </section> */}

      {/* TODO: Next release - Skill Assessment */}
      {/* <section 
        id="assessment" 
        className="py-20 px-4 md:px-8 bg-[var(--bg-primary-gradient)] devtool-section-primary"
      >
        <ScrollAnimatedSection animationType="fade" delay={200}>
          <SkillAssessment />
        </ScrollAnimatedSection>
      </section> */}

      {/* TODO: Next release - Enhanced Contact Section */}
      {/* <section 
        id="contact" 
        className="py-20 px-4 md:px-8 bg-[var(--bg-secondary)] devtool-section-secondary"
      >
        <ScrollAnimatedSection animationType="scale" delay={300}>
          <EnhancedContactSection />
        </ScrollAnimatedSection>
      </section> */}

      <section 
        id="contact" 
        className="py-20 px-4 md:px-8 bg-[var(--bg-primary-gradient)] devtool-section-primary"
      >
        <ScrollAnimatedSection animationType="scale" delay={300}>
          <ContactSection resumeData={resumeData} />
        </ScrollAnimatedSection>
      </section>

    </div>
  )
})

Resume.displayName = 'Resume'
export default Resume
