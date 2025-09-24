"use client"

import { Provider } from 'react-redux'
import { store } from '@/lib/store/store'
import { useEffect } from 'react'
import { initializeAuth } from '@/lib/store/authSlice'
import { useAppDispatch } from '@/lib/hooks/redux'

function ReduxInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch()

  useEffect(() => {
    // Initialize auth state from localStorage on app start
    dispatch(initializeAuth())
  }, [dispatch])

  return <>{children}</>
}

export default function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ReduxInitializer>{children}</ReduxInitializer>
    </Provider>
  )
}

