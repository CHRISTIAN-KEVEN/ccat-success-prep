import { api } from './apiClient'
import type { QuestionResponse } from './sessionService'

export const questionService = {
  findByDomain: (domainCode: string) =>
    api.get<QuestionResponse[]>(`/api/v1/questions/domain/${domainCode}`),

  findByDomainAndDifficulty: (domainCode: string, difficulty: string) =>
    api.get<QuestionResponse[]>(`/api/v1/questions/domain/${domainCode}/difficulty/${difficulty}`),

  findByUuid: (uuid: string) =>
    api.get<QuestionResponse>(`/api/v1/questions/${uuid}`),
}
