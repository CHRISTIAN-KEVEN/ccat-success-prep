'use client'
import { useState } from 'react'
import Link from 'next/link'
import {
  BookOpen, CheckCircle2, Circle, Clock, Flame,
  PlayCircle, ChevronRight, Target, Calendar, Zap, Lock,
} from 'lucide-react'

/* ── Types ── */
type Priority = 'Critical' | 'High' | 'Medium' | 'Review'
type SessionStatus = 'done' | 'active' | 'locked'

type Drill = {
  id: number
  type: string
  title: string
  duration: string
  priority: Priority
  xp: number
  done: boolean
}

type DayPlan = {
  day: string
  date: number
  sessions: number
  done: number
  isToday: boolean
  isWeekend: boolean
}

type Milestone = {
  label: string
  target: number
  current: number
  unit: string
  status: SessionStatus
}

/* ── Mock data ── */
const todayDrills: Drill[] = [
  { id: 1, type: 'HIGH PRIORITY', title: 'Number Series: Pattern Recognition', duration: '15 min', priority: 'Critical', xp: 50, done: true },
  { id: 2, type: 'SPEED DRILL', title: 'Basic Algebra Flashcards', duration: '10 min', priority: 'High', xp: 30, done: true },
  { id: 3, type: 'ACCURACY DRILL', title: 'Abstract Logic: Matrix Rotation', duration: '20 min', priority: 'High', xp: 40, done: false },
  { id: 4, type: 'THEORY REVIEW', title: 'Sentence Completion Logic', duration: '12 min', priority: 'Medium', xp: 20, done: false },
  { id: 5, type: 'MINI MOCK', title: 'Mixed 10-Question Sprint', duration: '5 min', priority: 'Review', xp: 60, done: false },
]

const weekPlan: DayPlan[] = [
  { day: 'Mon', date: 11, sessions: 4, done: 4, isToday: false, isWeekend: false },
  { day: 'Tue', date: 12, sessions: 4, done: 4, isToday: false, isWeekend: false },
  { day: 'Wed', date: 13, sessions: 5, done: 2, isToday: true, isWeekend: false },
  { day: 'Thu', date: 14, sessions: 3, done: 0, isToday: false, isWeekend: false },
  { day: 'Fri', date: 15, sessions: 4, done: 0, isToday: false, isWeekend: false },
  { day: 'Sat', date: 16, sessions: 2, done: 0, isToday: false, isWeekend: true },
  { day: 'Sun', date: 17, sessions: 0, done: 0, isToday: false, isWeekend: true },
]

const milestones: Milestone[] = [
  { label: 'Score 40+ on Full Mock', target: 40, current: 42, unit: 'pts', status: 'done' },
  { label: 'Number Series Accuracy', target: 70, current: 42, unit: '%', status: 'active' },
  { label: 'Avg. Speed under 15s', target: 15, current: 17.2, unit: 's', status: 'active' },
  { label: 'Complete 20 Drills', target: 20, current: 12, unit: 'drills', status: 'active' },
  { label: 'Score 45+ on Full Mock', target: 45, current: 42, unit: 'pts', status: 'locked' },
]

const domainProgress = [
  { name: 'Verbal Reasoning', pct: 88, color: 'bg-green-500' },
  { name: 'Spatial Reasoning', pct: 78, color: 'bg-blue-500' },
  { name: 'Numerical Reasoning', pct: 66, color: 'bg-orange-400' },
]

/* ── Helpers ── */
const priorityStyles: Record<Priority, string> = {
  Critical: 'bg-red-100 text-red-600',
  High: 'bg-orange-100 text-orange-600',
  Medium: 'bg-blue-100 text-blue-600',
  Review: 'bg-gray-100 text-gray-500',
}

const priorityBar: Record<Priority, string> = {
  Critical: 'bg-red-500',
  High: 'bg-orange-400',
  Medium: 'bg-blue-500',
  Review: 'bg-gray-300',
}

/* ── Sub-components ── */
function DrillRow({ drill, onToggle }: { drill: Drill; onToggle: (id: number) => void }) {
  return (
    <div className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
      drill.done ? 'border-gray-100 bg-gray-50 opacity-70' : 'border-gray-200 bg-white hover:border-blue-200'
    }`}>
      <div className={`w-1 self-stretch rounded-full shrink-0 ${priorityBar[drill.priority]}`} />

      <button
        onClick={() => onToggle(drill.id)}
        className="shrink-0 text-gray-300 hover:text-blue-500 transition-colors"
      >
        {drill.done
          ? <CheckCircle2 size={20} className="text-green-500" />
          : <Circle size={20} />
        }
      </button>

      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-bold text-gray-400 tracking-wide">{drill.type}</p>
        <p className={`text-sm font-semibold mt-0.5 leading-snug ${drill.done ? 'line-through text-gray-400' : 'text-gray-800'}`}>
          {drill.title}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span className="flex items-center gap-1 text-[10px] text-gray-400">
            <Clock size={10} /> {drill.duration}
          </span>
          <span className="text-[10px] text-yellow-500 font-semibold">+{drill.xp} XP</span>
          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${priorityStyles[drill.priority]}`}>
            {drill.priority}
          </span>
        </div>
      </div>

      {!drill.done && (
        <Link href="/dashboard/test">
          <button className="shrink-0 flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors">
            <PlayCircle size={12} /> Start
          </button>
        </Link>
      )}
    </div>
  )
}

function WeekDay({ day }: { day: DayPlan }) {
  const allDone = day.sessions > 0 && day.done === day.sessions
  const partial = day.done > 0 && day.done < day.sessions

  return (
    <div className={`flex flex-col items-center gap-1.5 p-2 rounded-xl cursor-pointer transition-all ${
      day.isToday
        ? 'bg-blue-600 text-white'
        : allDone
          ? 'bg-green-50 border border-green-200'
          : 'hover:bg-gray-50'
    }`}>
      <p className={`text-[10px] font-bold tracking-wide ${day.isToday ? 'text-blue-100' : 'text-gray-400'}`}>
        {day.day}
      </p>
      <p className={`text-sm font-bold ${day.isToday ? 'text-white' : allDone ? 'text-green-700' : 'text-gray-700'}`}>
        {day.date}
      </p>

      {day.sessions === 0 ? (
        <div className="w-4 h-4 rounded-full border border-dashed border-gray-200" />
      ) : allDone ? (
        <CheckCircle2 size={14} className="text-green-500" />
      ) : partial ? (
        <div className="w-4 h-4 rounded-full border-2 border-blue-400 flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
        </div>
      ) : (
        <div className={`w-4 h-4 rounded-full border-2 ${day.isToday ? 'border-white' : 'border-gray-200'}`} />
      )}

      {day.sessions > 0 && (
        <p className={`text-[9px] ${day.isToday ? 'text-blue-100' : 'text-gray-400'}`}>
          {day.done}/{day.sessions}
        </p>
      )}
    </div>
  )
}

function MilestoneRow({ m }: { m: Milestone }) {
  const achieved = m.status === 'done'
  const locked = m.status === 'locked'
  const pct = Math.min(100, Math.round((m.current / m.target) * 100))

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
          {m.label}
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
              {m.current}{m.unit} / {m.target}{m.unit}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

/* ── Page ── */
export default function StudyPlanPage() {
  const [drills, setDrills] = useState(todayDrills)

  const toggle = (id: number) =>
    setDrills(prev => prev.map(d => d.id === id ? { ...d, done: !d.done } : d))

  const doneCount = drills.filter(d => d.done).length
  const totalXP = drills.filter(d => d.done).reduce((a, d) => a + d.xp, 0)
  const planPct = Math.round((doneCount / drills.length) * 100)

  return (
    <div className="p-4 sm:p-6 flex flex-col gap-5 max-w-7xl mx-auto w-full">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <BookOpen size={20} className="text-blue-600" />
          <div>
            <h1 className="text-xl font-bold text-gray-900">Study Plan</h1>
            <p className="text-xs text-gray-400 mt-0.5">Week of May 13 – 17, 2026 · Target: Score 45+</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 bg-orange-50 border border-orange-100 text-orange-600 text-xs font-semibold px-3 py-2 rounded-lg">
            <Flame size={13} /> 7-day streak
          </div>
          <Link href="/dashboard/test">
            <button className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors">
              <PlayCircle size={14} /> Continue Session
            </button>
          </Link>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Today Progress</p>
          <p className="text-2xl font-extrabold text-gray-900 mt-1">{doneCount}<span className="text-base text-gray-400 font-normal">/{drills.length}</span></p>
          <p className="text-[11px] text-gray-400 mt-0.5">sessions completed</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">XP Earned Today</p>
          <p className="text-2xl font-extrabold text-yellow-500 mt-1">{totalXP}<span className="text-base text-gray-400 font-normal"> xp</span></p>
          <p className="text-[11px] text-gray-400 mt-0.5">+{drills.filter(d => !d.done).reduce((a, d) => a + d.xp, 0)} xp remaining</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Week Completion</p>
          <p className="text-2xl font-extrabold text-gray-900 mt-1">58<span className="text-base text-gray-400 font-normal">%</span></p>
          <p className="text-[11px] text-gray-400 mt-0.5">10 of 17 sessions done</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Days to Exam</p>
          <p className="text-2xl font-extrabold text-blue-600 mt-1">18</p>
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
              <div>
                <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                  <Calendar size={14} className="text-blue-600" /> Weekly Schedule
                </h2>
                <p className="text-[11px] text-gray-400 mt-0.5">May 11 – 17, 2026</p>
              </div>
              <button className="text-xs text-blue-600 font-semibold hover:underline">Edit Plan</button>
            </div>
            <div className="grid grid-cols-7 gap-1 sm:gap-2">
              {weekPlan.map(day => <WeekDay key={day.day} day={day} />)}
            </div>
            <div className="flex items-center gap-4 mt-4 pt-3 border-t border-gray-50">
              {[
                { dot: 'bg-green-500', label: 'All done' },
                { dot: 'bg-blue-500', label: 'In progress' },
                { dot: 'bg-gray-200', label: 'Upcoming' },
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
                <p className="text-[11px] text-gray-400 mt-0.5">Wednesday, May 13 · {planPct}% complete</p>
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
                <DrillRow key={drill.id} drill={drill} onToggle={toggle} />
              ))}
            </div>

            {planPct === 100 && (
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
                <div key={d.name}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium text-gray-700">{d.name}</span>
                    <span className={`font-bold ${d.pct >= 80 ? 'text-green-600' : d.pct >= 70 ? 'text-blue-600' : 'text-orange-500'}`}>
                      {d.pct}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${d.color} transition-all`} style={{ width: `${d.pct}%` }} />
                  </div>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    Target: <span className="font-semibold">80%</span>
                    {d.pct >= 80 ? ' · Achieved!' : ` · ${80 - d.pct}% to go`}
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

          {/* Upcoming sessions */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <p className="text-[10px] font-semibold text-gray-400 tracking-widest mb-3">TOMORROW · THU MAY 14</p>
            {[
              { title: 'Number Series Level 2', type: 'DRILL', duration: '15 min' },
              { title: 'Verbal Analogies Sprint', type: 'SPEED', duration: '8 min' },
              { title: 'Full CCAT Simulation', type: 'MOCK', duration: '15 min' },
            ].map((s, i) => (
              <div key={i} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
                <div>
                  <p className="text-[10px] font-bold text-gray-400">{s.type}</p>
                  <p className="text-xs font-semibold text-gray-700 mt-0.5">{s.title}</p>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-gray-400">
                  <Clock size={10} /> {s.duration}
                </div>
              </div>
            ))}
            <button className="mt-3 w-full text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center justify-center gap-1 py-1.5">
              See full week <ChevronRight size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
