'use client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { config } from '@/lib/config'

export default function GoogleProvider({ children }: { children: React.ReactNode }) {
  return (
    <GoogleOAuthProvider clientId={config.googleClientId}>
      {children}
    </GoogleOAuthProvider>
  )
}
