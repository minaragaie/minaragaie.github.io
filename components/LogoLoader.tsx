"use client"

import { useState, useEffect } from "react"

interface LogoLoaderProps {
  onLoadComplete: () => void
}

export default function LogoLoader({ onLoadComplete }: LogoLoaderProps) {
  const [loadingText, setLoadingText] = useState("")
  const [showCursor, setShowCursor] = useState(true)

  useEffect(() => {
    const text = "Mina.dev"
    let currentIndex = 0

    const typeText = () => {
      if (currentIndex < text.length) {
        setLoadingText(text.slice(0, currentIndex + 1))
        currentIndex++
        setTimeout(typeText, 150)
      } else {
        // Wait a moment then complete loading
        setTimeout(() => {
          onLoadComplete()
        }, 1000)
      }
    }

    // Start typing after a brief delay
    setTimeout(typeText, 500)

    // Cursor blinking effect
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev)
    }, 500)

    return () => {
      clearInterval(cursorInterval)
    }
  }, [onLoadComplete])

  return (
    <div className="fixed inset-0 bg-[#1e1e1e] flex items-center justify-center z-[100000]">
      <div className="text-center">
        {/* Logo with typing effect */}
        <div className="text-6xl font-mono font-bold text-[#007acc] mb-8">
          {loadingText}
          <span className={`${showCursor ? "opacity-100" : "opacity-0"} transition-opacity duration-100`}>|</span>
        </div>

        {/* Loading animation */}
        <div className="flex items-center justify-center space-x-2">
          <div className="w-2 h-2 bg-[#007acc] rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-[#007acc] rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
          <div className="w-2 h-2 bg-[#007acc] rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
        </div>

        {/* Loading text */}
        <p className="text-[#d4d4d4] mt-4 font-mono text-sm">Initializing portfolio...</p>
      </div>
    </div>
  )
}
