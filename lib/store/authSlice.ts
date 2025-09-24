import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface AuthState {
  isAuthenticated: boolean
  username: string | null
  token: string | null
  showAuthTerminal: boolean
}

const initialState: AuthState = {
  isAuthenticated: false,
  username: null,
  token: null,
  showAuthTerminal: false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ username: string; token: string }>) => {
      state.isAuthenticated = true
      state.username = action.payload.username
      state.token = action.payload.token
      state.showAuthTerminal = false
      
      // Store in localStorage
      localStorage.setItem('admin_token', action.payload.token)
      localStorage.setItem('admin_username', action.payload.username)
    },
    logout: (state) => {
      state.isAuthenticated = false
      state.username = null
      state.token = null
      
      // Clear localStorage
      localStorage.removeItem('admin_token')
      localStorage.removeItem('admin_username')
    },
    openAuthTerminal: (state) => {
      state.showAuthTerminal = true
    },
    closeAuthTerminal: (state) => {
      state.showAuthTerminal = false
    },
    initializeAuth: (state) => {
      const token = localStorage.getItem('admin_token')
      const username = localStorage.getItem('admin_username')
      
      if (token && username) {
        state.isAuthenticated = true
        state.username = username
        state.token = token
      }
    },
  },
})

export const {
  setCredentials,
  logout,
  openAuthTerminal,
  closeAuthTerminal,
  initializeAuth,
} = authSlice.actions

export default authSlice.reducer

