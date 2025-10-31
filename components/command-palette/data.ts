import { User, Code, Mail, Award, Briefcase, GraduationCap, Settings } from "lucide-react"
import { SearchResult } from "./types"

// Pre-defined command list (never changes)
export const COMMANDS: SearchResult[] = [
  { id: 'cmd-home', title: 'Open Home', description: 'Go to homepage', category: 'Command', icon: User, color: '#007acc', type: 'command', link: '/' },
  { id: 'cmd-projects', title: 'Open Projects', description: 'Jump to Projects section', category: 'Command', icon: Code, color: '#4ec9b0', type: 'command', link: '/#projects' },
  { id: 'cmd-contact', title: 'Open Contact', description: 'Jump to Contact section', category: 'Command', icon: Mail, color: '#b5cea8', type: 'command', link: '/#contact' },
  { id: 'cmd-github', title: 'Open GitHub Activity', description: 'View GitHub dashboard', category: 'Command', icon: Code, color: '#9cdcfe', type: 'command', link: '/github' },
  { id: 'cmd-settings', title: 'Open Settings Panel', description: 'Show settings in sidebar', category: 'Command', icon: Settings, color: '#c586c0', type: 'command' },
]

// Pre-defined navigation commands (never changes)
export const NAVIGATION_COMMANDS: SearchResult[] = [
  { id: "hero", title: "Go to Hero Section", description: "Navigate to introduction", icon: User, color: "#007acc", category: "Navigation", type: "navigation" },
  { id: "skills", title: "Go to Skills", description: "View technical skills", icon: Code, color: "#4ec9b0", category: "Navigation", type: "navigation" },
  { id: "experience", title: "Go to Experience", description: "View work history", icon: Briefcase, color: "#dcdcaa", category: "Navigation", type: "navigation" },
  { id: "technologies", title: "Go to Technologies", description: "View tech stack", icon: Code, color: "#9cdcfe", category: "Navigation", type: "navigation" },
  { id: "education", title: "Go to Education", description: "View educational background", icon: GraduationCap, color: "#c586c0", category: "Navigation", type: "navigation" },
  { id: "certifications", title: "Go to Certifications", description: "View certificates", icon: Award, color: "#ce9178", category: "Navigation", type: "navigation" },
  { id: "contact", title: "Go to Contact", description: "Get in touch", icon: Mail, color: "#b5cea8", category: "Navigation", type: "navigation" },
]

