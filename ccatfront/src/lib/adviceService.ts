import { api } from './apiClient'

export interface AdviceCardResponse {
  lgId: number
  strCode: string
  emTriggerRule: string
  emCategory: string
  strTargetDomainCode: string | null
  emPriority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'
  strTitle: string
  strContent: string
  strActionLabel: string | null
  strActionUrl: string | null
  bActive: boolean
}

export interface UserAdviceResponse {
  lgId: number
  lgUserId: number
  lgResultId: number
  adviceCard: AdviceCardResponse
  emTriggerMatched: string
  intDisplayRank: number
  bWasRead: boolean
  bWasHelpful: boolean | null
  intTimeSpentMs: number
  strUserNote: string | null
  dtShown: string
  dtRead: string | null
}

export const adviceService = {
  getBySession: (sessionId: number) =>
    api.get<UserAdviceResponse[]>(`/api/v1/sessions/${sessionId}/advices`),

  markRead: (adviceId: number) =>
    api.patch<UserAdviceResponse>(`/api/v1/advices/${adviceId}/read`, {}),

  submitFeedback: (lgUserAdviceId: number, bWasHelpful: boolean, strUserNote?: string) =>
    api.patch<UserAdviceResponse>('/api/v1/advices/feedback', {
      lgUserAdviceId,
      bWasHelpful,
      strUserNote: strUserNote ?? null,
    }),
}
