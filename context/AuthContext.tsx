"use client"

import React, { createContext, useContext, useState, ReactNode } from "react"

interface AuthContextProps {
  isAuthenticated: boolean
  username: string | null
  login: (username: string) => void
  logout: () => void
  showAuthTerminal: boolean
  openAuthTerminal: () => void
  closeAuthTerminal: () => void
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState<string | null>(null)
  const [showAuthTerminal, setShowAuthTerminal] = useState(false)

  const login = (username: string) => {
    setIsAuthenticated(true)
    setUsername(username)
    setShowAuthTerminal(false)
  }

  const logout = () => {
    setIsAuthenticated(false)
    setUsername(null)
  }

  const openAuthTerminal = () => {
    setShowAuthTerminal(true)
  }

  const closeAuthTerminal = () => {
    setShowAuthTerminal(false)
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        username,
        login,
        logout,
        showAuthTerminal,
        openAuthTerminal,
        closeAuthTerminal,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
