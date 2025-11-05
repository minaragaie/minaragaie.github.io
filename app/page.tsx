"use client"

import { memo, useEffect } from "react"
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
  const { resumeData, loading, error, retry } = useResumeData()

  // Handle hash navigation after page loads (for experience, education, certifications)
  useEffect(() => {
    if (!loading && resumeData) {
      const hash = window.location.hash
      if (hash) {
        const id = hash.substring(1) // Remove the #
        // Wait for DOM to be ready and animations to settle
        setTimeout(() => {
          const element = document.getElementById(id)
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" })
          }
        }, 300) // Slightly longer delay to ensure all content is rendered
      }
    }
  }, [loading, resumeData])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen loading-state bg-[var(--bg-primary)]">
        <div className="text-center max-w-md px-4">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[var(--vscode-blue)] mx-auto mb-4"></div>
          <p className="text-lg font-medium text-[var(--text-primary)] mb-2">Loading resume data...</p>
          <p className="text-sm text-[var(--text-secondary)]">
            Fetching latest portfolio information from the server
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen error-state bg-[var(--bg-primary)]">
        <div className="text-center max-w-lg px-4">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[var(--vscode-error)]/10 mb-4">
              <svg className="w-10 h-10 text-[var(--vscode-error)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
            Unable to Load Portfolio
          </h2>
          <p className="text-[var(--vscode-error)] mb-2 font-medium">{error}</p>
          <p className="text-sm text-[var(--text-secondary)] mb-6">
            The backend server may be temporarily unavailable or experiencing high traffic. Please try again.
          </p>
          <button
            onClick={retry}
            className="px-6 py-3 bg-[var(--vscode-blue)] hover:bg-[var(--vscode-blue)]/80 text-white rounded-lg font-medium transition-all duration-200 hover:scale-105 shadow-lg"
          >
            Retry Loading
          </button>
          <p className="mt-4 text-xs text-[var(--text-secondary)]">
            If the issue persists, please contact me directly at{' '}
            <a href="mailto:minaragaie@hotmail.com" className="text-[var(--vscode-blue)] hover:underline">
              minaragaie@hotmail.com
            </a>
          </p>
        </div>
      </div>
    )
  }

  if (!resumeData) {
    return (
      <div className="flex items-center justify-center min-h-screen no-data-state bg-[var(--bg-primary)]">
        <div className="text-center max-w-md px-4">
          <p className="text-lg text-[var(--text-primary)]">No resume data available</p>
          <button
            onClick={retry}
            className="mt-4 px-6 py-2 bg-[var(--vscode-blue)] text-white rounded-lg hover:bg-[var(--vscode-blue)]/80 transition-colors"
          >
            Retry
          </button>
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
