"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Mail, Phone, MapPin, Linkedin, Send, MessageSquare } from "lucide-react"
import resumeData from "@/data/resume.json"
import TerminalWindow from "./TerminalWindow"
import { useStatusBar } from "@/context/StatusBarContext"

interface ContactSectionProps {}

export default function ContactSection({}: ContactSectionProps) {
    const { setStatus } = useStatusBar()

  const [formData, setFormData] = useState({ name: "", email: "", message: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [terminalCommands, setTerminalCommands] = useState<string[]>([])
  const [showTerminal, setShowTerminal] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const addTerminalCommand = (msg: string) => {
    setTerminalCommands((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`])
  }

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setIsSubmitting(true)
  setShowTerminal(true)
  setTerminalCommands([])

  const addCmd = (msg: string) =>
    setTerminalCommands((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`])

  try {
    setStatus?.("Sending message...")
    addCmd(`connect --to "Mina Youaness"`)
    await new Promise((res) => setTimeout(res, 800))

    addCmd("[✔] Secure channel established")
    await new Promise((res) => setTimeout(res, 600))

    addCmd("[✔] Handshake completed")
    await new Promise((res) => setTimeout(res, 500))

    addCmd("[✔] Contact form initialized")
    await new Promise((res) => setTimeout(res, 500))

    setStatus?.("Encrypting message...")
    addCmd(`[✔] Encrypting message from <${formData.email}>...`)
    await new Promise((res) => setTimeout(res, 700))

    setStatus?.("Transmitting...")
    addCmd("[✔] Transmitting data packets...")
    await new Promise((res) => setTimeout(res, 600))

    addCmd("[✔] Signal received by Mina's inbox")
    await new Promise((res) => setTimeout(res, 500))

    // FETCH BACKEND
    const response = await fetch(
      "https://resume-backend-service.vercel.app/api/send-email",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      }
    )

    // safely parse JSON
    const data = await response.json().catch(() => ({}))

    if (!response.ok || data.error) {
      throw new Error(data.error || `HTTP ${response.status}`)
    }

    // SUCCESS
    setStatus?.("Message sent successfully!")
    addCmd("------------------------------------------")
    addCmd(`👋 Hello ${formData.name} (<${formData.email}>)`)
    addCmd("   Welcome to my terminal. Your message has successfully")
    addCmd("   reached Mina Youaness.")
    addCmd("")
    addCmd("   ⚡ Transmission complete. Mina will review your request")
    addCmd("      and get back to you as soon as possible.")
    addCmd("")
    addCmd("------------------------------------------")
    await new Promise((res) => setTimeout(res, 1000))
    addCmd("exit")
    addCmd("Session closed. Thank you for reaching out!")

    setFormData({ name: "", email: "", message: "" })
    setTimeout(() => setStatus?.("Ready for next challenge"), 5000)
  } catch (error: any) {
    // CAPTURE ALL ERRORS
    const msg = error?.message || "Unknown error"
    setStatus?.("Failed to send message - See terminal for details")
    addCmd(`✗ Error: ${msg}`)
    addCmd("✗ Please try again or contact directly")
    setTimeout(() => setStatus?.("Ready for next challenge"), 5000)
  } finally {
    setIsSubmitting(false)
    addCmd("Process completed.")
  }
}



  return (
    <div
      className="transition-all duration-700 opacity-100 translate-y-0"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>
            <span className="text-[#569cd6] font-mono">function</span>{" "}
            <span className="text-[#4ec9b0]">getInTouch</span>
            <span style={{ color: "var(--text-primary)" }}>()</span>
          </h2>
          <p className="max-w-xl mx-auto font-mono text-sm sm:text-base" style={{ color: "var(--text-secondary)" }}>
            // Ready to collaborate on your next project
          </p>
        </div>

        {/* Grid: stacks on mobile, 2 cols on large screens */}
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Contact Info */}
          <div className="space-y-6 sm:space-y-8">
            <div
              className="rounded-lg p-6 sm:p-8"
              style={{
                backgroundColor: "var(--vscode-bg)",
                borderColor: "var(--vscode-border)",
                border: "1px solid",
              }}
            >
              <h3
                className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 flex items-center gap-3"
                style={{ color: "var(--text-primary)" }}
              >
                <MessageSquare className="w-5 h-5 text-[#4ec9b0]" /> Let's Connect
              </h3>
              <div className="space-y-4 sm:space-y-6">
                {/* Email */}
                <ContactItem
                  icon={<Mail className="w-5 h-5 text-[var(--vscode-green)]" />}
                  label="email"
                  value={resumeData.personalInfo.email}
                />
                {/* Phone */}
                <ContactItem
                  icon={<Phone className="w-5 h-5 text-[var(--vscode-green)]" />}
                  label="phone"
                  value={
                    <button
                      onClick={() => {
                      const formEl = document.getElementById("contact")
                      if (formEl) {
                        formEl.scrollIntoView({ behavior: "smooth" })

                        // Grab the textarea
                        const form = document.getElementById("contact-form")
                        if (form) {
                          form.classList.add("blink-border")
                          setTimeout(() => form.classList.remove("blink-border"), 2000)
                        }

                        const textarea = formEl.querySelector("textarea[name='message']") as HTMLTextAreaElement
                        if (textarea) {
                          // Add blink border
                          textarea.classList.add("blink-border")
                          setTimeout(() => textarea.classList.remove("blink-border"), 2000)

                          // Autofill "Request a call"
                          textarea.value = "Request a call"
                          textarea.dispatchEvent(new Event("input", { bubbles: true }))
                        }

                      }
                    }}
                      className="text-[#007acc] hover:text-[#4ec9b0] transition-colors underline"
                    >
                      Request a Call
                    </button>
                  }
                />

                {/* Location */}
                <ContactItem
                  icon={<MapPin className="w-5 h-5 text-[var(--vscode-green)]" />}
                  label="location"
                  value={resumeData.personalInfo.location}
                />
                {/* LinkedIn */}
                <ContactItem
                  icon={<Linkedin className="w-5 h-5 text-[var(--vscode-green)]" />}
                  label="linkedin"
                  value={
                    <a
                      href={resumeData.personalInfo.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#007acc] hover:text-[#4ec9b0] transition-colors"
                    >
                      View Profile
                    </a>
                  }
                />
              </div>
            </div>

            {/* Status Card */}
            <div
              className="rounded-lg p-4 sm:p-6"
              style={{
                backgroundColor: "var(--vscode-bg)",
                borderColor: "var(--vscode-border)",
                border: "1px solid",
              }}
            >
              <div className="rounded p-3 sm:p-4" style={{ backgroundColor: "var(--vscode-input-bg)" }}>
                <code className="text-xs text-[#569cd6] font-mono block mb-2">// Available for opportunities</code>
                <code className="text-xs text-[#ce9178] font-mono block">const status = "Open to new challenges";</code>
                <code className="text-xs text-[#4ec9b0] font-mono block">const responseTime = "Within 24 hours";</code>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div
            className="rounded-lg p-6 sm:p-8 border border-[var(--vscode-border)] bg-[var(--vscode-bg)]">
            <h3
              className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 flex items-center gap-3"
              style={{ color: "var(--text-primary)" }}
            >
              <Send className="w-5 h-5 text-[#4ec9b0]" /> Send Message
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {["name", "email"].map((field) => (
                <div key={field}>
                  <label className="block text-[#569cd6] font-mono text-sm mb-1 sm:mb-2">{field}:</label>
                  <input
                    type={field === "email" ? "email" : "text"}
                    name={field}
                    value={formData[field as keyof typeof formData]}
                    onChange={handleInputChange}
                    placeholder={field === "email" ? "your.email@example.com" : "Your name"}
                    className="w-full rounded px-3 sm:px-4 py-2 sm:py-3 focus:border-[#007acc] focus:outline-none transition-colors"
                    style={{
                      backgroundColor: "var(--vscode-input-bg)",
                      borderColor: "var(--vscode-border)",
                      border: "1px solid",
                      color: "var(--text-primary)",
                    }}
                    required
                  />
                </div>
              ))}

              <div>
                <label className="block text-[#569cd6] font-mono text-sm mb-1 sm:mb-2">message:</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={5}
                  placeholder="Tell me about your project..."
                  className="w-full rounded px-3 sm:px-4 py-2 sm:py-3 focus:border-[#007acc] focus:outline-none transition-colors resize-none"
                  style={{
                    backgroundColor: "var(--vscode-input-bg)",
                    borderColor: "var(--vscode-border)",
                    border: "1px solid",
                    color: "var(--text-primary)",
                  }}
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-[#007acc] to-[#4ec9b0] hover:from-[#005a9e] hover:to-[#3a9d8a] text-white shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                size="lg"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" /> Send Message
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Terminal Window */}
      {showTerminal && (
        <div className="fixed bottom-4 right-4 w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl z-50">
          <TerminalWindow
            title="Message Sender"
            commands={terminalCommands}
            isProcessing={isSubmitting}
            cursorBlinkSpeed={isSubmitting ? 500 : 0}
            autoCloseAfter={14000}
            onClose={() => setShowTerminal(false)}
          />
        </div>
      )}
    </div>
  )
}

function ContactItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div
      className="flex items-start sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg transition-colors"
      style={{ backgroundColor: "var(--vscode-input-bg)" }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--vscode-hover)")}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--vscode-input-bg)")}
    >
      <div className="p-2">{icon}</div>
      <div>
        <p className="text-[#569cd6] font-mono text-xs sm:text-sm">{label}:</p>
        <p style={{ color: "var(--text-primary)" }} className="text-sm sm:text-base">
          {value}
        </p>
      </div>
    </div>
  )
}
