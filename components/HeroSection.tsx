"use client"

import { Download, Mail, Phone, MapPin, Linkedin, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import jsPDF from "jspdf"
import TerminalWindow from "@/components/TerminalWindow"

// NOTE: The jspdf library is an external dependency that must be loaded via a <script> tag from a CDN
// in your HTML for the download functionality to work. We are removing the direct import to resolve the compilation error.

interface HeroSectionProps {
  isVisible: boolean
}

export default function HeroSection({ isVisible }: HeroSectionProps) {

  const handleDownloadResume = () => {
    const doc = new jsPDF()
    doc.text("Mina Youaness - Full Stack Developer", 10, 10)
    doc.save("resume.pdf")
  }


  return (
    <div className="relative overflow-hidden">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        {/* Left side - Info */}
        <div
          className={`transition-all duration-1000 ${isVisible ? "animate-fade-in-up" : "opacity-0 translate-y-10"}`}
        >
          <div className="flex flex-row md:flex-row items-center gap-6 mb-8">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[var(--vscode-blue)] p-1 bg-gradient-to-br from-[var(--vscode-blue)] to-[var(--vscode-green)]">
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1753407168559-PCWiZjGAS8MtQhjaIJJBeSTHaxePdY.jpeg"
                  alt="Mina Youaness - Full Stack Developer"
                  className="w-full h-full rounded-full object-cover grayscale hover:grayscale-0 transition-all duration-300"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#28ca42] rounded-full border-2 border-[#1e1e1e] flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              </div>
            </div>
            <div>
              <div className="text-[var(--vscode-keyword)] text-sm mb-1 font-mono">// Full Stack Developer</div>
              <h1 className="text-4xl md:text-5xl font-bold text-[var(--vscode-text)] mb-1">
                <span className="text-[var(--vscode-green)]">const</span> <span className="text-[var(--vscode-keyword)]">developer</span>{" "}
                <span className="text-[var(--vscode-text)]">=</span> <span className="text-[var(--vscode-string)]">"Mina Youaness"</span>
              </h1>
              <div className="h-1 w-32 bg-gradient-to-r from-[var(--vscode-blue)] to-[var(--vscode-green)] rounded-full"></div>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-3 text-[var(--vscode-text-muted)]">
              <span className="text-[var(--vscode-keyword)] font-mono">experience:</span>
              <span className="text-[var(--vscode-string)]">"10+ years"</span>
            </div>
            <div className="flex items-center gap-3 text-[var(--vscode-text-muted)]">
              <span className="text-[var(--vscode-keyword)] font-mono">specialization:</span>
              <span className="text-[var(--vscode-string)]">"Full-Stack Web Development"</span>
            </div>
            <div className="flex items-center gap-3 text-[var(--vscode-text-muted)]">
              <span className="text-[var(--vscode-keyword)] font-mono">passion:</span>
              <span className="text-[var(--vscode-string)]">"Scalable & Secure Applications"</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mb-8">
            <div className="flex items-center gap-2 p-3 rounded bg-[var(--card)] hover:bg-[var(--popover)] transition-all">
              <MapPin className="w-4 h-4 text-[var(--vscode-green)]" />
              <span>Voorhees, NJ</span>
            </div>
            <div className="flex items-center gap-2 p-3 rounded bg-[var(--card)] hover:bg-[var(--popover)] transition-all">
              <Phone className="w-4 h-4 text-[var(--vscode-green)]" />
              <span>609.839.3558</span>
            </div>
            <div className="flex items-center gap-2 p-3 rounded bg-[var(--card)] hover:bg-[var(--popover)] transition-all">
              <Mail className="w-4 h-4 text-[var(--vscode-green)]" />
              <span>minaragaie@hotmail.com</span>
            </div>
            <div className="flex items-center gap-2 p-3 rounded bg-[var(--card)] hover:bg-[var(--popover)] transition-all">
              <Linkedin className="w-4 h-4 text-[var(--vscode-green)]" />
              <span>LinkedIn</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Button
              className="bg-gradient-to-r from-[#007acc] to-[#0086d4] hover:from-[#005a9e] hover:to-[#006bb3] text-white shadow-lg hover:shadow-xl border border-[#007acc]/20"
              size="lg"
              onClick={handleDownloadResume}
            >
              <Download className="w-4 h-4 mr-2" />
              Download Resume
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-[#007acc] text-[#007acc] hover:bg-[#007acc] hover:text-white bg-transparent/80 backdrop-blur-sm shadow-md hover:shadow-lg"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              View Portfolio
            </Button>
          </div>
        </div>
        {/* Right side - Terminal */}
        <TerminalWindow
          title="Hero Terminal"
          commands={[
              "$ whoami",
              "> Mina Youaness - Full Stack Developer",
              "$ cat experience.txt",
              "> 10+ years of innovative web development",
              "$ ls skills/",
              "> Angular React Node.js TypeScript...",
              "$ git log --oneline",
              "> Ready for next challenge! 🚀",
            ]}/>
      </div>
    </div>
  )
}
