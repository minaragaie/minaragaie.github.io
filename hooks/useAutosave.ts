import { useCallback, useEffect, useRef, useState } from 'react'
import { useDebounce } from './useDebounce'

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'

interface UseAutosaveOptions<T> {
  data: T
  onSave: (data: T) => Promise<void>
  delay?: number
  enabled?: boolean
  onSaveStart?: () => void
  onSaveSuccess?: () => void
  onSaveError?: (error: any) => void
}

interface UseAutosaveReturn {
  saveStatus: SaveStatus
  lastSaved: Date | null
  hasUnsavedChanges: boolean
  saveNow: () => Promise<void>
  resetStatus: () => void
}

/**
 * Custom hook for autosave functionality with debouncing and batching
 * Optimized to prevent excessive API calls and improve performance
 */
export function useAutosave<T>({
  data,
  onSave,
  delay = 1500, // Reduced default delay for better responsiveness
  enabled = true,
  onSaveStart,
  onSaveSuccess,
  onSaveError,
}: UseAutosaveOptions<T>): UseAutosaveReturn {
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle')
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  
  const previousDataRef = useRef<T>(data)
  const isInitialMount = useRef(true)
  const saveInProgressRef = useRef(false)

  // Debounce the data changes
  const debouncedData = useDebounce(data, delay)

  // Check if data has changed
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }

    const hasChanged = JSON.stringify(data) !== JSON.stringify(previousDataRef.current)
    setHasUnsavedChanges(hasChanged)
    
    if (hasChanged) {
      previousDataRef.current = data
    }
  }, [data])

  // Perform autosave when debounced data changes
  useEffect(() => {
    if (!enabled || !hasUnsavedChanges || isInitialMount.current || saveInProgressRef.current) {
      return
    }

    const performSave = async () => {
      if (saveInProgressRef.current) {
        return // Prevent concurrent saves
      }
      
      try {
        saveInProgressRef.current = true
        setSaveStatus('saving')
        onSaveStart?.()
        
        await onSave(debouncedData)
        
        setSaveStatus('saved')
        setLastSaved(new Date())
        setHasUnsavedChanges(false)
        onSaveSuccess?.()
        
        // Reset to idle after showing success for 1.5 seconds
        setTimeout(() => {
          setSaveStatus('idle')
        }, 1500)
        
      } catch (error) {
        setSaveStatus('error')
        onSaveError?.(error)
        
        // Reset to idle after showing error for 3 seconds
        setTimeout(() => {
          setSaveStatus('idle')
        }, 3000)
      } finally {
        saveInProgressRef.current = false
      }
    }

    performSave()
  }, [debouncedData, enabled, hasUnsavedChanges, onSave, onSaveStart, onSaveSuccess, onSaveError])

  // Manual save function
  const saveNow = useCallback(async () => {
    if (!enabled || !hasUnsavedChanges || saveInProgressRef.current) {
      return
    }

    try {
      saveInProgressRef.current = true
      setSaveStatus('saving')
      onSaveStart?.()
      
      await onSave(data)
      
      setSaveStatus('saved')
      setLastSaved(new Date())
      setHasUnsavedChanges(false)
      onSaveSuccess?.()
      
      setTimeout(() => {
        setSaveStatus('idle')
      }, 1500)
      
    } catch (error) {
      setSaveStatus('error')
      onSaveError?.(error)
      
      setTimeout(() => {
        setSaveStatus('idle')
      }, 3000)
    } finally {
      saveInProgressRef.current = false
    }
  }, [data, enabled, hasUnsavedChanges, onSave, onSaveStart, onSaveSuccess, onSaveError])

  // Reset status function
  const resetStatus = useCallback(() => {
    setSaveStatus('idle')
    setHasUnsavedChanges(false)
  }, [])

  return {
    saveStatus,
    lastSaved,
    hasUnsavedChanges,
    saveNow,
    resetStatus,
  }
}
