"use client"

import { useEffect, useRef, useState, useCallback } from 'react'

interface UseScrollAnimationOptions {
  threshold?: number
  rootMargin?: string
  triggerOnce?: boolean
  delay?: number
}

export function useScrollAnimation(options: UseScrollAnimationOptions = {}) {
  const {
    threshold = 0.1,
    rootMargin = '0px 0px -50px 0px',
    triggerOnce = true,
    delay = 0
  } = options

  const [isVisible, setIsVisible] = useState(false)
  const [hasAnimated, setHasAnimated] = useState(false)
  const elementRef = useRef<HTMLElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const hasTriggeredRef = useRef(false)

  const handleIntersection = useCallback(([entry]: IntersectionObserverEntry[]) => {
    if (entry.isIntersecting && !hasTriggeredRef.current) {
      hasTriggeredRef.current = true
      
      if (delay > 0) {
        // Clear any existing timeout
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
        
        timeoutRef.current = setTimeout(() => {
          setIsVisible(true)
          if (triggerOnce) {
            setHasAnimated(true)
          }
        }, delay)
      } else {
        setIsVisible(true)
        if (triggerOnce) {
          setHasAnimated(true)
        }
      }
    } else if (!triggerOnce && !entry.isIntersecting) {
      setIsVisible(false)
    }
  }, [delay, triggerOnce])

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const observer = new IntersectionObserver(handleIntersection, {
      threshold,
      rootMargin,
    })

    observer.observe(element)

    return () => {
      observer.unobserve(element)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [threshold, rootMargin, handleIntersection])

  return {
    elementRef,
    isVisible: triggerOnce ? (hasAnimated || isVisible) : isVisible,
    hasAnimated
  }
}

export default useScrollAnimation
