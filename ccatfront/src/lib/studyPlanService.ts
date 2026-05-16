import { api } from './apiClient'

export interface StudyDrillResponse {
  strDrillKey: string
  strType: string
  strTitle: string
  strDuration: string
  emPriority: 'Critical' | 'High' | 'Medium' | 'Review'
  intXp: number
  bDone: boolean
}

export interface StudyWeekDayResponse {
  strDay: string
  intDate: number
  intSessions: number
  intDone: number
  bIsToday: boolean
  bIsWeekend: boolean
}

export interface StudyMilestoneResponse {
  strLabel: string
  dbTarget: number
  dbCurrent: number
  strUnit: string
  emStatus: 'done' | 'active' | 'locked'
}

export interface StudyDomainProgressResponse {
  strName: string
  intPct: number
  strColor: string
}

export interface StudyPlanResponse {
  todayDrills: StudyDrillResponse[]
  weekPlan: StudyWeekDayResponse[]
  milestones: StudyMilestoneResponse[]
  domainProgress: StudyDomainProgressResponse[]
  intDaysToExam: number
  intStreak: number
  intWeekSessionsDone: number
  intWeekSessionsTotal: number
}

export const studyPlanService = {
  getPlan: () =>
    api.get<StudyPlanResponse>('/api/v1/study/plan'),

  completeDrill: (drillKey: string) =>
    api.patch<void>(`/api/v1/study/drills/${encodeURIComponent(drillKey)}/complete`, {}),
}
