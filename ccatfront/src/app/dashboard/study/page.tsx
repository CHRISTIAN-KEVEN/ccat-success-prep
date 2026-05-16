'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  BookOpen, CheckCircle2, Circle, Clock, Flame,
  PlayCircle, ChevronRight, Target, Calendar, Zap, Lock,
} from 'lucide-react'
import {
  studyPlanService,
  StudyDrillResponse,
  StudyWeekDayResponse,
  StudyMilestoneResponse,
  StudyDomainProgressResponse,
} from '@/lib/studyPlanService'

type Priority = 'Critical' | 'High' | 'Medium' | 'Review'

const priorityStyles: Record<Priority, string> = {
  Critical: 'bg-red-100 text-red-600',
  High:     'bg-orange-100 text-orange-600',
  Medium:   'bg-blue-100 text-blue-600',
  Review:   'bg-gray-100 text-gray-500',
}

const priorityBar: Record<Priority, string> = {
  Critical: 'bg-red-500',
  High:     'bg-orange-400',
  Medium:   'bg-blue-500',
  Review:   'bg-gray-300',
}

function DrillRow({ drill, onToggle }: { drill: StudyDrillResponse; onToggle: (key: string) => void }) {
  return (
    <div className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
      drill.bDone ? 'border-gray-100 bg-gray-50 opacity-70' : 'border-gray-200 bg-white hover:border-blue-200'
    }`}>
      <div className={`w-1 self-stretch rounded-full shrink-0 ${priorityBar[drill.emPriority]}`} />

      <button
        onClick={() => onToggle(drill.strDrillKey)}
        className="shrink-0 text-gray-300 hover:text-blue-500 transition-colors"
      >
        {drill.bDone
          ? <CheckCircle2 size={20} className="text-green-500" />
          : <Circle size={20} />
        }
      </button>

      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-bold text-gray-400 tracking-wide">{drill.strType}</p>
        <p className={`text-sm font-semibold mt-0.5 leading-snug ${drill.bDone ? 'line-through text-gray-400' : 'text-gray-800'}`}>
          {drill.strTitle}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span className="flex items-center gap-1 text-[10px] text-gray-400">
            <Clock size={10} /> {drill.strDuration}
          </span>
          <span className="text-[10px] text-yellow-500 font-semibold">+{drill.intXp} XP</span>
          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${priorityStyles[drill.emPriority]}`}>
            {drill.emPriority}
          </span>
        </div>
      </div>

      {!drill.bDone && (
        <Link href="/dashboard/test">
          <button className="shrink-0 flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors">
            <PlayCircle size={12} /> Start
          </button>
        </Link>
      )}
    </div>
  )
}

function WeekDay({ day }: { day: StudyWeekDayResponse }) {
  const allDone = day.intSessions > 0 && day.intDone === day.intSessions
  const partial = day.intDone > 0 && day.intDone < day.intSessions

  return (
    <div className={`flex flex-col items-center gap-1.5 p-2 rounded-xl cursor-pointer transition-all ${
      day.bIsToday
        ? 'bg-blue-600 text-white'
        : allDone
          ? 'bg-green-50 border border-green-200'
          : 'hover:bg-gray-50'
    }`}>
      <p className={`text-[10px] font-bold tracking-wide ${day.bIsToday ? 'text-blue-100' : 'text-gray-400'}`}>
        {day.strDay}
      </p>
      <p className={`text-sm font-bold ${day.bIsToday ? 'text-white' : allDone ? 'text-green-700' : 'text-gray-700'}`}>
        {day.intDate}
      </p>

      {day.intSessions === 0 ? (
        <div className="w-4 h-4 rounded-full border border-dashed border-gray-200" />
      ) : allDone ? (
        <CheckCircle2 size={14} className="text-green-500" />
      ) : partial ? (
        <div className="w-4 h-4 rounded-full border-2 border-blue-400 flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
        </div>
      ) : (
        <div className={`w-4 h-4 rounded-full border-2 ${day.bIsToday ? 'border-white' : 'border-gray-200'}`} />
      )}

      {day.intSessions > 0 && (
        <p className={`text-[9px] ${day.bIsToday ? 'text-blue-100' : 'text-gray-400'}`}>
          {day.intDone}/{day.intSessions}
        </p>
      )}
    </div>
  )
}

function MilestoneRow({ m }: { m: StudyMilestoneResponse }) {
  const achieved = m.emStatus === 'done'
  const locked   = m.emStatus === 'locked'
  const pct      = Math.min(100, Math.round((m.dbCurrent / m.dbTarget) * 100))

  return (
    <div className={`flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0 ${locked ? 'opacity-40' : ''}`}>
      <div className="shrink-0">
        {achieved
          ? <CheckCircle2 size={16} className="text-green-500" />
          : locked
            ? <Lock size={14} className="text-gray-400" />
            : <Target size={16} className="text-blue-500" />
        }
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-xs font-semibold ${achieved ? 'line-through text-gray-400' : 'text-gray-700'}`}>
          {m.strLabel}
        </p>
        {!locked && (
          <div className="flex items-center gap-2 mt-1">
            <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${achieved ? 'bg-green-500' : 'bg-blue-500'}`}
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="text-[10px] text-gray-400 shrink-0">
              {m.dbCurrent}{m.strUnit} / {m.dbTarget}{m.strUnit}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

export default function StudyPlanPage() {
  const [drills, setDrills]               = useState<StudyDrillResponse[]>([])
  const [weekPlan, setWeekPlan]           = useState<StudyWeekDayResponse[]>([])
  const [milestones, setMilestones]       = useState<StudyMilestoneResponse[]>([])
  const [domainProgress, setDomainProgress] = useState<StudyDomainProgressResponse[]>([])
  const [daysToExam, setDaysToExam]       = useState(18)
  const [streak, setStreak]               = useState(0)
  const [weekDone, setWeekDone]           = useState(0)
  const [weekTotal, setWeekTotal]         = useState(0)
  const [loading, setLoading]             = useState(true)

  useEffect(() => {
    studyPlanService.getPlan()
      .then(data => {
        setDrills(data.todayDrills)
        setWeekPlan(data.weekPlan)
        setMilestones(data.milestones)
        setDomainProgress(data.domainProgress)
        setDaysToExam(data.intDaysToExam)
        setStreak(data.intStreak)
        setWeekDone(data.intWeekSessionsDone)
        setWeekTotal(data.intWeekSessionsTotal)
      })
      .finally(() => setLoading(false))
  }, [])

  const toggle = async (key: string) => {
    setDrills(prev => prev.map(d => d.strDrillKey === key ? { ...d, bDone: !d.bDone } : d))
    await studyPlanService.completeDrill(key)
  }

  const doneCount = drills.filter(d => d.bDone).length
  const totalXP   = drills.filter(d => d.bDone).reduce((a, d) => a + d.intXp, 0)
  const planPct   = drills.length > 0 ? Math.round((doneCount / drills.length) * 100) : 0
  const weekPct   = weekTotal > 0 ? Math.round((weekDone / weekTotal) * 100) : 0

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="p-4 sm:p-6 flex flex-col gap-5 max-w-7xl mx-auto w-full">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <BookOpen size={20} className="text-blue-600" />
          <div>
            <h1 className="text-xl font-bold text-gray-900">Study Plan</h1>
            <p className="text-xs text-gray-400 mt-0.5">This week · Target: Score 45+</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {streak > 0 && (
            <div className="flex items-center gap-1.5 bg-orange-50 border border-orange-100 text-orange-600 text-xs font-semibold px-3 py-2 rounded-lg">
              <Flame size={13} /> {streak}-day streak
            </div>
          )}
          <Link href="/dashboard/test">
            <button className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors">
              <PlayCircle size={14} /> Continue Session
            </button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Today Progress</p>
          <p className="text-2xl font-extrabold text-gray-900 mt-1">{doneCount}<span className="text-base text-gray-400 font-normal">/{drills.length}</span></p>
          <p className="text-[11px] text-gray-400 mt-0.5">sessions completed</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">XP Earned Today</p>
          <p className="text-2xl font-extrabold text-yellow-500 mt-1">{totalXP}<span className="text-base text-gray-400 font-normal"> xp</span></p>
          <p className="text-[11px] text-gray-400 mt-0.5">+{drills.filter(d => !d.bDone).reduce((a, d) => a + d.intXp, 0)} xp remaining</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Week Completion</p>
          <p className="text-2xl font-extrabold text-gray-900 mt-1">{weekPct}<span className="text-base text-gray-400 font-normal">%</span></p>
          <p className="text-[11px] text-gray-400 mt-0.5">{weekDone} of {weekTotal} sessions done</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Days to Exam</p>
          <p className="text-2xl font-extrabold text-blue-600 mt-1">{daysToExam}</p>
          <p className="text-[11px] text-gray-400 mt-0.5">Stay consistent!</p>
        </div>
      </div>

      {/* Main layout */}
      <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">

        {/* Left */}
        <div className="lg:col-span-2 flex flex-col gap-4 sm:gap-6">

          {/* Weekly calendar */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <Calendar size={14} className="text-blue-600" /> Weekly Schedule
              </h2>
            </div>
            <div className="grid grid-cols-7 gap-1 sm:gap-2">
              {weekPlan.map(day => <WeekDay key={day.strDay} day={day} />)}
            </div>
            <div className="flex items-center gap-4 mt-4 pt-3 border-t border-gray-50">
              {[
                { dot: 'bg-green-500', label: 'All done' },
                { dot: 'bg-blue-500',  label: 'In progress' },
                { dot: 'bg-gray-200',  label: 'Upcoming' },
              ].map(l => (
                <div key={l.label} className="flex items-center gap-1.5">
                  <div className={`w-2 h-2 rounded-full ${l.dot}`} />
                  <span className="text-[10px] text-gray-400">{l.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Today's drills */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-semibold text-gray-900">Today Sessions</h2>
                <p className="text-[11px] text-gray-400 mt-0.5">{planPct}% complete</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${planPct}%` }} />
                </div>
                <span className="text-xs font-semibold text-gray-600">{planPct}%</span>
              </div>
            </div>

            <div className="flex flex-col gap-2.5">
              {drills.map(drill => (
                <DrillRow key={drill.strDrillKey} drill={drill} onToggle={toggle} />
              ))}
            </div>

            {planPct === 100 && drills.length > 0 && (
              <div className="mt-4 bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                <p className="text-sm font-semibold text-green-700">All done for today!</p>
                <p className="text-xs text-green-600 mt-0.5">You earned <strong>{totalXP} XP</strong> — see you tomorrow.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right sidebar */}
        <div className="flex flex-col gap-4 sm:gap-6">

          {/* Domain progress */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Domain Progress</h3>
            <div className="flex flex-col gap-3.5">
              {domainProgress.map(d => (
                <div key={d.strName}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium text-gray-700">{d.strName}</span>
                    <span className={`font-bold ${d.intPct >= 80 ? 'text-green-600' : d.intPct >= 70 ? 'text-blue-600' : 'text-orange-500'}`}>
                      {d.intPct}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${d.strColor} transition-all`} style={{ width: `${d.intPct}%` }} />
                  </div>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    Target: <span className="font-semibold">80%</span>
                    {d.intPct >= 80 ? ' · Achieved!' : ` · ${80 - d.intPct}% to go`}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Milestones */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Zap size={14} className="text-yellow-500" />
              <h3 className="text-sm font-semibold text-gray-900">Milestones</h3>
            </div>
            <div className="flex flex-col">
              {milestones.map((m, i) => <MilestoneRow key={i} m={m} />)}
            </div>
          </div>

          {/* Quick nav */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <p className="text-[10px] font-semibold text-gray-400 tracking-widest mb-3">QUICK ACTIONS</p>
            <Link href="/dashboard/test">
              <button className="w-full flex items-center justify-between py-2.5 border-b border-gray-50 hover:text-blue-600 transition-colors">
                <span className="text-xs font-semibold text-gray-700">Start Full Mock Test</span>
                <ChevronRight size={12} className="text-gray-400" />
              </button>
            </Link>
            <Link href="/dashboard/results">
              <button className="w-full flex items-center justify-between py-2.5 hover:text-blue-600 transition-colors">
                <span className="text-xs font-semibold text-gray-700">View My Results</span>
                <ChevronRight size={12} className="text-gray-400" />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
