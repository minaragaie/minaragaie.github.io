import { type NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY || "dummy-key-for-build")

export async function POST(request: NextRequest) {
  console.log("[v0] API Route called - Contact form submission")
  console.log("[v0] Environment check - RESEND_API_KEY exists:", !!process.env.RESEND_API_KEY)
  console.log("[v0] RESEND_API_KEY value:", process.env.RESEND_API_KEY?.substring(0, 10) + "...")

  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === "dummy-key-for-build") {
    console.log("[v0] RESEND_API_KEY not configured")
    return NextResponse.json({ error: "Email service not configured" }, { status: 500 })
  }

  try {
    const { name, email, message } = await request.json()
    console.log("[v0] Request data received:", { name, email, messageLength: message?.length })

    // Validate required fields
    if (!name || !email || !message) {
      console.log("[v0] Validation failed - missing fields:", {
        name: !!name,
        email: !!email,
        message: !!message,
      })
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    console.log("[v0] Validation passed - attempting to send email")

    const emailData = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "minaragaie@hotmail.com",
      subject: `New Contact Form Message from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #007acc;">New Contact Form Submission</h2>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong></p>
            <div style="background: white; padding: 15px; border-radius: 4px; margin-top: 10px;">
              ${message.replace(/\n/g, "<br>")}
            </div>
          </div>
          <p style="color: #666; font-size: 12px;">
            This message was sent from your portfolio contact form.
          </p>
        </div>
      `,
      replyTo: email,
    })

    if (emailData.error) {
      console.error("[v0] Resend returned error:", emailData.error)
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
    }

    console.log("[v0] Email sent successfully:", emailData)
    return NextResponse.json({ message: "Message sent successfully" }, { status: 200 })
  } catch (err) {
    console.error("[v0] Contact form error:", err)
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 })
  }
}
