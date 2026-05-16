import { api } from './apiClient'
import type { AnswerResponse } from './sessionService'

export interface BookmarkResponse {
  lgId: number
  lgQuestionId: number
  strQuestionText: string
  strImageUrl: string | null
  strDomainCode: string
  emDifficulty: string
  emQuestionType: string
  strExplanation: string | null
  strNote: string | null
  bBookmarked: boolean
  dtCreated: string
  answers: AnswerResponse[]
}

export const bookmarkService = {
  toggle: (questionId: number) =>
    api.post<{ bBookmarked: boolean }>(`/api/v1/bookmarks/${questionId}/toggle`, {}),

  getMyBookmarks: () =>
    api.get<BookmarkResponse[]>('/api/v1/bookmarks'),

  getMyBookmarkedIds: () =>
    api.get<number[]>('/api/v1/bookmarks/ids'),
}
