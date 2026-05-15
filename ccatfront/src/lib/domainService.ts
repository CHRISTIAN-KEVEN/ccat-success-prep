import { api } from './apiClient'

export interface DomainResponse {
  strDomainCode: string
  strLabel: string
  strDescription: string | null
  emStatus: string
  intDefaultRatio: number
  intQuestionCount: number
  dbAvgAccuracy: number
}

export const domainService = {
  findAllActive: () => api.get<DomainResponse[]>('/api/v1/domains'),
  findByCode: (code: string) => api.get<DomainResponse>(`/api/v1/domains/${code}`),
}
