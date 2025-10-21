// Client component for project details
import ProjectDetailClient from "./ProjectDetailClient"

// Generate static params for all projects
export async function generateStaticParams() {
  // For static export, we need to define all possible project slugs
  return [
    { slug: 'turris-erp' },
    { slug: 'entityconnect' },
    { slug: 'abgadya' },
    { slug: 'medical-rep' },
    { slug: 'wordpress-booking' },
    { slug: 'realtime-communication' },
    { slug: 'storyverse-app' },
  ]
}

export default function ProjectDetailPage() {
  return <ProjectDetailClient />
}

