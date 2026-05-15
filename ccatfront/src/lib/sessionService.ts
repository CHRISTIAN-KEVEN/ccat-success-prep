import { api } from './apiClient'

export interface AnswerResponse {
  lgId: number
  strAnswerText: string
  strAnswerLabel: string
  bIsCorrect: boolean
  strExplanation: string | null
  intSortOrder: number
}

export interface QuestionResponse {
  lgId: number
  strUuid: string
  strDomainCode: string
  emDifficulty: string
  emQuestionType: string
  emContentType: string
  strQuestionText: string
  strImageUrl: string | null
  strImageAlt: string | null
  strExplanation: string | null
  strHint: string | null
  intPointValue: number
  intTimeLimitMs: number | null
  bActive: boolean
  bVerified: boolean
  answers: AnswerResponse[]
}

export interface TestSessionResponse {
  lgId: number
  strUuid: string
  lgUserId: number
  emSessionType: string
  emStatus: string
  bIsFreeTest: boolean
  intQuestionCount: number
  intDurationSeconds: number
  emDomainRatio: string
  emDifficultyMix: string
  intQuestionsAnswered: number
  intQuestionsSkipped: number
  dtStarted: string
  dtExpires: string
  dtSubmitted: string | null
  questionOrder: number[]
}

export interface DomainPerformanceResponse {
  strDomainCode: string
  strDomainLabel: string
  intCorrectCount: number
  intWrongCount: number
  intSkippedCount: number
  intTotalCount: number
  dbAccuracyPercent: number
}

export interface TestResultResponse {
  lgId: number
  lgSessionId: number
  intTotalScore: number
  intQuestionCount: number
  intAnsweredCount: number
  intSkippedCount: number
  dbAccuracyPercent: number
  dbCompletionPercent: number
  intTimeUsedMs: number
  intTimeAvailableMs: number
  emPaceRating: string
  intPercentileEstimate: number
  bPassedThreshold: boolean
  domainPerformances: DomainPerformanceResponse[]
}

export interface ResponseSubmitResponse {
  lgId: number
  lgSessionId: number
  lgQuestionId: number
  lgAnswerId: number | null
  bIsCorrect: boolean
  bWasSkipped: boolean
  intResponseTimeMs: number
}

export const sessionService = {
  start: (emSessionType: string) =>
    api.post<TestSessionResponse>('/api/v1/sessions', { emSessionType }),

  getQuestions: (sessionId: number) =>
    api.get<QuestionResponse[]>(`/api/v1/sessions/${sessionId}/questions`),

  submitResponse: (sessionId: number, payload: {
    lgSessionId: number
    lgQuestionId: number
    lgAnswerId: number | null
    intResponseTimeMs: number
    intDisplayOrder: number
    strAnswerOptionsOrder: string
  }) => api.post<ResponseSubmitResponse>(`/api/v1/sessions/${sessionId}/responses`, payload),

  finish: (sessionId: number, timerExpired = false) =>
    api.post<TestResultResponse>(`/api/v1/sessions/${sessionId}/finish?timerExpired=${timerExpired}`, {}),

  getResult: (sessionId: number) =>
    api.get<TestResultResponse>(`/api/v1/sessions/${sessionId}/result`),

  getMyHistory: () =>
    api.get<TestSessionResponse[]>('/api/v1/sessions/me'),
}
