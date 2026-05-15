const NODE_ENV = process.env.NODE_ENV

const devApiUrl = 'http://localhost:8080'
const prodApiUrl = 'https://your-production-api.com'

const devGoogleClientId = ''
const prodGoogleClientId = ''

const defaultApiUrl = NODE_ENV === 'production' ? prodApiUrl : devApiUrl
const defaultGoogleClientId = NODE_ENV === 'production' ? prodGoogleClientId : devGoogleClientId

export const config = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL ?? defaultApiUrl,
  googleClientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? defaultGoogleClientId,
} as const
