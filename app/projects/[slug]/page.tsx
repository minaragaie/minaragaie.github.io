// Client component for project details
import ProjectDetailClient from "./ProjectDetailClient"

// Generate static params for all projects
export async function generateStaticParams() {
  // For static export, we need to define all possible project slugs
  // These match the slug field in backend resume.json
  return [
    { slug: 'turris-erp' },
    { slug: 'entityconnect' },
    { slug: 'abgadya' },
    { slug: 'storyverse' },
  ]
}

export default function ProjectDetailPage() {
  return <ProjectDetailClient />
}

