"use client"

import { memo, useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface PerformanceMetrics {
  fcp: number | null
  lcp: number | null
  fid: number | null
  cls: number | null
  ttfb: number | null
  memory: {
    used: number
    total: number
    limit: number
  } | null
}

const PerformanceMonitor = memo(() => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fcp: null,
    lcp: null,
    fid: null,
    cls: null,
    ttfb: null,
    memory: null
  })
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Only show in development
    if (process.env.NODE_ENV !== 'development') return

    const updateMetrics = () => {
      // Get Web Vitals
      if ('performance' in window) {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
        const paintEntries = performance.getEntriesByType('paint')
        
        const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint')?.startTime || null
        const lcp = paintEntries.find(entry => entry.name === 'largest-contentful-paint')?.startTime || null
        
        setMetrics(prev => ({
          ...prev,
          fcp,
          lcp,
          ttfb: navigation ? navigation.responseStart - navigation.requestStart : null,
          memory: (performance as any).memory ? {
            used: (performance as any).memory.usedJSHeapSize / 1048576,
            total: (performance as any).memory.totalJSHeapSize / 1048576,
            limit: (performance as any).memory.jsHeapSizeLimit / 1048576
          } : null
        }))
      }
    }

    // Update metrics after page load
    const timer = setTimeout(updateMetrics, 2000)
    
    // Show/hide with Ctrl+Shift+M
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toUpperCase() === 'M') {
        e.preventDefault()
        setIsVisible(prev => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    
    return () => {
      clearTimeout(timer)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  if (process.env.NODE_ENV !== 'development' || !isVisible) return null

  const getScoreColor = (value: number | null, thresholds: { good: number, needsImprovement: number }) => {
    if (value === null) return 'text-gray-500'
    if (value <= thresholds.good) return 'text-green-500'
    if (value <= thresholds.needsImprovement) return 'text-yellow-500'
    return 'text-red-500'
  }

  const getScoreText = (value: number | null, thresholds: { good: number, needsImprovement: number }) => {
    if (value === null) return 'N/A'
    if (value <= thresholds.good) return 'Good'
    if (value <= thresholds.needsImprovement) return 'Needs Improvement'
    return 'Poor'
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 300 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 300 }}
        className="fixed top-4 right-4 w-80 bg-black/90 backdrop-blur-sm border border-gray-700 rounded-lg p-4 z-50 text-white text-sm"
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-blue-400">Performance Monitor</h3>
          <button
            onClick={() => setIsVisible(false)}
            className="text-gray-400 hover:text-white"
          >
            ×
          </button>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <span>First Contentful Paint:</span>
            <span className={getScoreColor(metrics.fcp, { good: 1800, needsImprovement: 3000 })}>
              {metrics.fcp ? `${Math.round(metrics.fcp)}ms` : 'N/A'}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span>Largest Contentful Paint:</span>
            <span className={getScoreColor(metrics.lcp, { good: 2500, needsImprovement: 4000 })}>
              {metrics.lcp ? `${Math.round(metrics.lcp)}ms` : 'N/A'}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Time to First Byte:</span>
            <span className={getScoreColor(metrics.ttfb, { good: 800, needsImprovement: 1800 })}>
              {metrics.ttfb ? `${Math.round(metrics.ttfb)}ms` : 'N/A'}
            </span>
          </div>

          {metrics.memory && (
            <div className="pt-2 border-t border-gray-700">
              <div className="text-xs text-gray-400 mb-1">Memory Usage</div>
              <div className="flex justify-between text-xs">
                <span>Used:</span>
                <span>{Math.round(metrics.memory.used)}MB</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>Total:</span>
                <span>{Math.round(metrics.memory.total)}MB</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>Limit:</span>
                <span>{Math.round(metrics.memory.limit)}MB</span>
              </div>
            </div>
          )}

          <div className="pt-2 border-t border-gray-700 text-xs text-gray-400">
            Press Ctrl+Shift+M to toggle
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
})

PerformanceMonitor.displayName = 'PerformanceMonitor'
export default PerformanceMonitor
