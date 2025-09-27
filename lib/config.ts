// Configuration for external API and authentication
export const config = {
  // External API Base URL
  API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || "https://resume-backend-service-ft2elzp8i-minaragaie89-8717s-projects.vercel.app",
  
  // API Endpoints
  ENDPOINTS: {
    RESUME: "/api/admin?type=resume",
    PUBLIC_RESUME: "/api/admin?type=resume", // Use same endpoint as admin
    EXPERIENCE: "/api/admin?type=experience", 
    EDUCATION: "/api/admin?type=education",
    CERTIFICATIONS: "/api/admin?type=certifications",
    AUTH: "/api/admin-auth",
    GENERATE_PDF: "/api/generate-pdf",
    // Version control endpoints
    RESUME_HISTORY: "/api/admin?type=resume&action=history",
    RESUME_RESTORE: "/api/admin?type=resume&action=restore",
    RESUME_PREVIEW: "/api/admin?type=resume&action=preview"
  }
}
