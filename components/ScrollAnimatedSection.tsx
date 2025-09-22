"use client"

import { ReactNode, memo, useMemo } from 'react'
import useScrollAnimation from '@/hooks/useScrollAnimation'

interface ScrollAnimatedSectionProps {
  children: ReactNode
  animationType?: 'slideUp' | 'slideLeft' | 'slideRight' | 'scale' | 'fade'
  delay?: number
  className?: string
  threshold?: number
}

const ScrollAnimatedSection = memo(function ScrollAnimatedSection({
  children,
  animationType = 'slideUp',
  delay = 0,
  className = '',
  threshold = 0.1
}: ScrollAnimatedSectionProps) {
  const { elementRef, isVisible } = useScrollAnimation({
    threshold,
    delay,
    triggerOnce: true
  })

  const animationClass = useMemo(() => {
    const baseClass = 'transition-all duration-800 ease-out'
    
    switch (animationType) {
      case 'slideUp':
        return `${baseClass} scroll-animate ${isVisible ? 'animate' : ''}`
      case 'slideLeft':
        return `${baseClass} scroll-animate-left ${isVisible ? 'animate' : ''}`
      case 'slideRight':
        return `${baseClass} scroll-animate-right ${isVisible ? 'animate' : ''}`
      case 'scale':
        return `${baseClass} scroll-animate-scale ${isVisible ? 'animate' : ''}`
      case 'fade':
        return `${baseClass} ${isVisible ? 'opacity-100' : 'opacity-0'}`
      default:
        return `${baseClass} scroll-animate ${isVisible ? 'animate' : ''}`
    }
  }, [animationType, isVisible])

  return (
    <div
      ref={elementRef}
      className={`${animationClass} ${className}`}
    >
      {children}
    </div>
  )
})

export default ScrollAnimatedSection
