"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Terminal, 
  Search, 
  Eye, 
  Keyboard, 
  Save, 
  Activity, 
  LogOut, 
  CheckCircle, 
  AlertCircle, 
  Database, 
  Zap, 
  BarChart3, 
  Loader2, 
  Undo2, 
  Redo2, 
  History,
  RefreshCw,
  Download
} from "lucide-react"
import { SaveStatusIndicator } from "@/components/SaveStatusIndicator"
import { SaveStatus, ErrorState, CommitHistory } from "./types"

interface AdminHeaderProps {
  // Header state
  username?: string | null
  searchQuery: string
  setSearchQuery: (query: string) => void
  showPreview: boolean
  setShowPreview: (show: boolean) => void
  showKeyboardShortcuts: boolean
  setShowKeyboardShortcuts: (show: boolean) => void
  
  // Save state
  saveStatus: SaveStatus
  lastSaved: Date | null
  hasUnsavedChanges: boolean
  onSaveNow: () => void
  
  // Version control state
  commitHistory: CommitHistory[]
  currentCommitIndex: number
  isLoadingHistory: boolean
  onUndo: () => void
  onRedo: () => void
  onShowHistory: () => void
  
  // Error and status state
  errorState: ErrorState
  isOffline: boolean
  retryQueue: any[]
  onRetryFailedSync: () => void
  
  // Cache and data state
  cacheHit: boolean
  isPreloading: boolean
  isValidating: boolean
  validationErrors: Record<string, string>
  validationWarnings: Record<string, string>
  onRefreshData: () => void
  onLoadSampleData: () => void
  onClearCache: () => void
  
  // Stats
  stats: {
    experienceCount: number
    skillCount: number
    educationCount: number
    certificationCount: number
    projectCount: number
  }
}

export default function AdminHeader({
  username,
  searchQuery,
  setSearchQuery,
  showPreview,
  setShowPreview,
  showKeyboardShortcuts,
  setShowKeyboardShortcuts,
  saveStatus,
  lastSaved,
  hasUnsavedChanges,
  onSaveNow,
  commitHistory,
  currentCommitIndex,
  isLoadingHistory,
  onUndo,
  onRedo,
  onShowHistory,
  errorState,
  isOffline,
  retryQueue,
  onRetryFailedSync,
  cacheHit,
  isPreloading,
  isValidating,
  validationErrors,
  validationWarnings,
  onRefreshData,
  onLoadSampleData,
  onClearCache,
  stats
}: AdminHeaderProps) {
  return (
    <div className="sticky top-0 z-40 bg-gradient-to-r from-[#0d1117] via-[#1e1e1e] to-[#0d1117] border-b border-[#30363d] shadow-2xl backdrop-blur-sm">
      <div className="p-2 sm:p-4">
        {/* Mobile Header */}
        <div className="flex flex-col lg:hidden space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-[#ff5f57] shadow-sm"></div>
                <div className="w-2 h-2 rounded-full bg-[#ffbd2e] shadow-sm"></div>
                <div className="w-2 h-2 rounded-full bg-[#28ca42] shadow-sm"></div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-[#007acc] to-[#4ec9b0] rounded-lg flex items-center justify-center shadow-lg">
                  <Terminal className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold bg-gradient-to-r from-[#007acc] to-[#4ec9b0] bg-clip-text text-transparent">
                    Admin
                  </h1>
                  <p className="text-xs text-gray-400">v2.0</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-[#4ec9b0] to-[#007acc] rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-white">{username?.charAt(0)?.toUpperCase()}</span>
              </div>
            </div>
          </div>
          
          {/* Mobile Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full bg-[#0d1117] border-[#30363d] text-[#d4d4d4] focus:border-[#4ec9b0] focus:ring-2 focus:ring-[#4ec9b0]/20"
            />
          </div>
          
          {/* Mobile Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 px-2 py-1 bg-[#0d1117] rounded-lg border border-[#30363d]">
              {hasUnsavedChanges ? (
                <>
                  <AlertCircle className="w-3 h-3 text-yellow-400" />
                  <span className="text-xs text-yellow-400">Unsaved</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-3 h-3 text-green-400" />
                  <span className="text-xs text-green-400">Saved</span>
                </>
              )}
            </div>
            <div className="text-xs text-gray-400">
              Welcome, {username}
            </div>
          </div>
          
          {/* Mobile Action Buttons - Responsive Layout */}
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <Button
                onClick={() => setShowPreview(!showPreview)}
                variant="outline"
                className="flex-1 border-[#30363d] text-[#d4d4d4] hover:bg-[#2d2d30] hover:border-[#4ec9b0] transition-all duration-200 text-xs"
              >
                <Eye className="w-3 h-3 mr-1" />
                Preview
              </Button>
              <Button
                onClick={() => setShowKeyboardShortcuts(!showKeyboardShortcuts)}
                variant="outline"
                className="flex-1 border-[#30363d] text-[#d4d4d4] hover:bg-[#2d2d30] hover:border-[#d2a8ff] transition-all duration-200 text-xs"
              >
                <Keyboard className="w-3 h-3 mr-1" />
                Shortcuts
              </Button>
            </div>
            
            {/* Mobile Version Control Buttons */}
            <div className="flex gap-2">
              <Button
                onClick={onUndo}
                disabled={currentCommitIndex >= commitHistory.length - 1 || isLoadingHistory}
                variant="outline"
                className="flex-1 border-[#30363d] text-[#d4d4d4] hover:bg-[#2d2d30] hover:border-[#4ec9b0] transition-all duration-200 text-xs disabled:opacity-50"
              >
                <Undo2 className="w-3 h-3 mr-1" />
                Undo
              </Button>
              
              <Button
                onClick={onRedo}
                disabled={currentCommitIndex <= 0 || isLoadingHistory}
                variant="outline"
                className="flex-1 border-[#30363d] text-[#d4d4d4] hover:bg-[#2d2d30] hover:border-[#4ec9b0] transition-all duration-200 text-xs disabled:opacity-50"
              >
                <Redo2 className="w-3 h-3 mr-1" />
                Redo
              </Button>
              
              <Button
                onClick={onShowHistory}
                variant="outline"
                className="flex-1 border-[#30363d] text-[#d4d4d4] hover:bg-[#2d2d30] hover:border-[#4ec9b0] transition-all duration-200 text-xs"
              >
                <History className="w-3 h-3 mr-1" />
                History
              </Button>
            </div>
            
            <SaveStatusIndicator
              status={saveStatus}
              lastSaved={lastSaved}
              hasUnsavedChanges={hasUnsavedChanges}
              onSaveNow={onSaveNow}
              className="text-xs"
            />
            
            {/* Error notification */}
            {errorState.hasError && (
              <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded ${
                errorState.type === 'network' 
                  ? 'bg-red-900/20 text-red-400 border border-red-800' 
                  : errorState.type === 'validation'
                  ? 'bg-yellow-900/20 text-yellow-400 border border-yellow-800'
                  : 'bg-gray-900/20 text-gray-400 border border-gray-800'
              }`}>
                <AlertCircle className="w-3 h-3" />
                <span className="flex-1">{errorState.message}</span>
                {retryQueue.length > 0 && (
                  <Button
                    size="sm"
                    onClick={onRetryFailedSync}
                    className="ml-2 h-6 px-2 text-xs bg-red-600 hover:bg-red-700"
                  >
                    Retry ({retryQueue.length})
                  </Button>
                )}
              </div>
            )}
            
            {/* Dev tools for debugging */}
            {process.env.NODE_ENV === 'development' && (
              <div className="flex items-center gap-2 text-xs">
                {/* Cache management button */}
                {cacheHit && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={onClearCache}
                    className="h-6 px-2 text-xs border-current hover:bg-current/10"
                    title="Clear cache"
                  >
                    🗑️ Clear Cache
                  </Button>
                )}
                
                {/* Refresh data button */}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onRefreshData}
                  disabled={false}
                  className="ml-2 h-6 px-2 text-xs border-current hover:bg-current/10"
                  title="Refresh data from backend"
                >
                  {false ? '⏳' : '🔄'}
                </Button>
                
                {/* Load sample data button */}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onLoadSampleData}
                  className="ml-2 h-6 px-2 text-xs border-current hover:bg-current/10"
                  title="Load sample data for testing"
                >
                  📝 Sample
                </Button>
              </div>
            )}
            
            {/* Offline indicator */}
            {isOffline && (
              <div className="flex items-center gap-1 text-xs text-orange-400">
                <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                <span>Offline - Changes will sync when reconnected</span>
              </div>
            )}
            
            {/* Cache status indicator */}
            {cacheHit && (
              <div className="flex items-center gap-1 text-xs text-blue-400">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span>Cache</span>
              </div>
            )}
            
            {/* Preloading indicator */}
            {isPreloading && (
              <div className="flex items-center gap-1 text-xs text-purple-400">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                <span>Updating...</span>
              </div>
            )}
            
            {/* Validation indicator */}
            {isValidating && (
              <div className="flex items-center gap-1 text-xs text-yellow-400">
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                <span>Validating...</span>
              </div>
            )}
            
            {/* Validation errors indicator */}
            {Object.keys(validationErrors).length > 0 && (
              <div className="flex items-center gap-1 text-xs text-red-400">
                <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                <span>{Object.keys(validationErrors).length} error(s)</span>
              </div>
            )}
            
            {/* Validation warnings indicator */}
            {Object.keys(validationWarnings).length > 0 && (
              <div className="flex items-center gap-1 text-xs text-yellow-400">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span>{Object.keys(validationWarnings).length} warning(s)</span>
              </div>
            )}
            
            {/* Validation summary button */}
            {(Object.keys(validationErrors).length > 0 || Object.keys(validationWarnings).length > 0) && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  const allIssues = { ...validationErrors, ...validationWarnings }
                  console.log('📋 Validation Summary:', allIssues)
                  alert(`Validation Issues:\n\nErrors: ${Object.keys(validationErrors).length}\nWarnings: ${Object.keys(validationWarnings).length}\n\nCheck console for details.`)
                }}
                className="ml-2 h-6 px-2 text-xs border-current hover:bg-current/10"
                title="View validation summary"
              >
                📋 Issues
              </Button>
            )}
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden lg:flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-[#ff5f57] shadow-sm"></div>
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e] shadow-sm"></div>
              <div className="w-3 h-3 rounded-full bg-[#28ca42] shadow-sm"></div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#007acc] to-[#4ec9b0] rounded-xl flex items-center justify-center shadow-lg">
                <Terminal className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-[#007acc] to-[#4ec9b0] bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
                <p className="text-sm text-gray-400">Resume Management System v2.0</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Search Bar - Smaller */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-48 bg-[#0d1117] border-[#30363d] text-[#d4d4d4] focus:border-[#4ec9b0] focus:ring-2 focus:ring-[#4ec9b0]/20"
              />
            </div>
            
            {/* Status Indicator - Compact */}
            <div className="flex items-center gap-2 px-3 py-1 bg-[#0d1117] rounded-lg border border-[#30363d]">
              {hasUnsavedChanges ? (
                <>
                  <AlertCircle className="w-4 h-4 text-yellow-400" />
                  <span className="text-xs text-yellow-400">Unsaved</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-xs text-green-400">Saved</span>
                </>
              )}
            </div>
            
            {/* User Info - Compact */}
            <div className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-[#1e1e1e] to-[#2d2d30] rounded-lg border border-[#30363d]">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-gray-300 font-medium">{username}</span>
              <div className="w-5 h-5 bg-gradient-to-br from-[#4ec9b0] to-[#007acc] rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-white">{username?.charAt(0)?.toUpperCase()}</span>
              </div>
            </div>

            {/* Action Buttons - Compact */}
            <div className="flex gap-1">
              <Button
                onClick={() => setShowPreview(!showPreview)}
                variant="outline"
                size="sm"
                className="border-[#30363d] text-[#d4d4d4] hover:bg-[#2d2d30] hover:border-[#4ec9b0] transition-all duration-200"
                title="Toggle Preview"
              >
                <Eye className="w-3 h-3" />
              </Button>
              
              <Button
                onClick={() => setShowKeyboardShortcuts(!showKeyboardShortcuts)}
                variant="outline"
                size="sm"
                className="border-[#30363d] text-[#d4d4d4] hover:bg-[#2d2d30] hover:border-[#d2a8ff] transition-all duration-200"
                title="Keyboard Shortcuts"
              >
                <Keyboard className="w-3 h-3" />
              </Button>
              
              {hasUnsavedChanges && (
                <Button 
                  onClick={onSaveNow}
                  disabled={saveStatus === 'saving'}
                  size="sm"
                  className="bg-[#238636] hover:bg-[#2ea043] text-white border-0 px-2 transition-all duration-200"
                >
                  {saveStatus === 'saving' ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <Save className="w-3 h-3" />
                  )}
                </Button>
              )}
              
              {/* Version Control Buttons */}
              <Button
                onClick={onUndo}
                disabled={currentCommitIndex >= commitHistory.length - 1 || isLoadingHistory}
                variant="outline"
                size="sm"
                className="border-[#30363d] text-[#d4d4d4] hover:bg-[#2d2d30] hover:border-[#4ec9b0] transition-all duration-200 disabled:opacity-50"
                title="Undo (Previous Version)"
              >
                <Undo2 className="w-3 h-3" />
              </Button>
              
              <Button
                onClick={onRedo}
                disabled={currentCommitIndex <= 0 || isLoadingHistory}
                variant="outline"
                size="sm"
                className="border-[#30363d] text-[#d4d4d4] hover:bg-[#2d2d30] hover:border-[#4ec9b0] transition-all duration-200 disabled:opacity-50"
                title="Redo (Next Version)"
              >
                <Redo2 className="w-3 h-3" />
              </Button>
              
              <Button
                onClick={onShowHistory}
                variant="outline"
                size="sm"
                className="border-[#30363d] text-[#d4d4d4] hover:bg-[#2d2d30] hover:border-[#4ec9b0] transition-all duration-200"
                title="Version History"
              >
                <History className="w-3 h-3" />
              </Button>
              
              <Button
                onClick={() => window.open("/", "_blank")}
                variant="outline"
                size="sm"
                className="border-[#30363d] text-[#d4d4d4] hover:bg-[#2d2d30] hover:border-[#4ec9b0] transition-all duration-200"
                title="View Resume"
              >
                <Activity className="w-3 h-3" />
              </Button>
              
              <Button
                onClick={() => {
                  // Logout functionality
                  window.location.href = '/signin'
                }}
                variant="outline"
                size="sm"
                className="border-[#f85149] text-[#f85149] hover:bg-[#f85149] hover:text-white transition-all duration-200 hover:scale-105"
                title="Logout"
              >
                <LogOut className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
