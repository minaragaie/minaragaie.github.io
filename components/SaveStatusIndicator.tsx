import React from 'react'
import { Save, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { SaveStatus } from '@/hooks/useAutosave'

interface SaveStatusIndicatorProps {
  status: SaveStatus
  lastSaved: Date | null
  hasUnsavedChanges: boolean
  onSaveNow?: () => void
  className?: string
}

export function SaveStatusIndicator({
  status,
  lastSaved,
  hasUnsavedChanges,
  onSaveNow,
  className = '',
}: SaveStatusIndicatorProps) {
  const getStatusIcon = () => {
    switch (status) {
      case 'saving':
        return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
      case 'saved':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />
      default:
        return hasUnsavedChanges ? (
          <Save className="w-4 h-4 text-yellow-500" />
        ) : null
    }
  }

  const getStatusText = () => {
    switch (status) {
      case 'saving':
        return 'Saving...'
      case 'saved':
        return lastSaved ? `Saved at ${lastSaved.toLocaleTimeString()}` : 'Saved'
      case 'error':
        return 'Save failed'
      default:
        return hasUnsavedChanges ? 'Unsaved changes' : 'All changes saved'
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case 'saving':
        return 'text-blue-600'
      case 'saved':
        return 'text-green-600'
      case 'error':
        return 'text-red-600'
      default:
        return hasUnsavedChanges ? 'text-yellow-600' : 'text-gray-600'
    }
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex items-center gap-1">
        {getStatusIcon()}
        <span className={`text-sm font-medium ${getStatusColor()}`}>
          {getStatusText()}
        </span>
      </div>
      
      {hasUnsavedChanges && status === 'idle' && onSaveNow && (
        <button
          onClick={onSaveNow}
          className="px-2 py-1 text-xs bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
        >
          Save Now
        </button>
      )}
    </div>
  )
}

