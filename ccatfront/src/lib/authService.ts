import { api } from './apiClient'

export interface UserResponse {
  lgId: number
  strUuid: string
  strEmail: string
  strFirstName: string
  strLastName: string
  emRole: string
  emStatus: string
  bEmailVerified: boolean
  strLocale: string | null
  strTimezone: string | null
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  tokenType: string
  expiresIn: number
  user: UserResponse
}

export const authService = {
  login: (strEmail: string, strPassword: string) =>
    api.post<AuthResponse>('/api/v1/auth/login', { strEmail, strPassword }),

  register: (strEmail: string, strPassword: string, strFirstName: string, strLastName: string) =>
    api.post<void>('/api/v1/auth/register', { strEmail, strPassword, strFirstName, strLastName, strLocale: 'fr' }),

  verifyEmail: (strEmail: string, strOtp: string) =>
    api.post<void>('/api/v1/auth/verify-email', { strEmail, strOtp }),

  resendVerification: (strEmail: string) =>
    api.post<void>('/api/v1/auth/resend-verification', { strEmail }),

  forgotPassword: (strEmail: string) =>
    api.post<void>('/api/v1/auth/forgot-password', { strEmail }),

  resetPassword: (strEmail: string, strOtp: string, strNewPassword: string) =>
    api.post<void>('/api/v1/auth/reset-password', { strEmail, strOtp, strNewPassword }),

  me: () => api.get<UserResponse>('/api/v1/auth/me'),

  googleLogin: (strAccessToken: string) =>
    api.post<AuthResponse>('/api/v1/auth/google', { strAccessToken }),
}
