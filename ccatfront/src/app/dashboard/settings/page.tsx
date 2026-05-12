'use client'
import { useState } from 'react'
import { User } from 'lucide-react'
import { mockUser } from '@/data/mockDashboard'

export default function SettingsPage() {
  const [form, setForm] = useState({
    name: mockUser.name,
    email: mockUser.email,
    role: mockUser.role,
    timezone: mockUser.timezone,
  })
  const [saved, setSaved] = useState(false)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="flex-1 p-4 sm:p-6 w-full">
      <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-7">

        {/* Section title */}
        <div className="flex items-center gap-3 mb-6 pb-5 border-b border-gray-100">
          <User size={20} className="text-gray-400" />
          <h1 className="text-xl font-bold text-gray-900">Profile Information</h1>
        </div>

        {/* Avatar */}
        <div className="flex items-center gap-4 mb-7">
          <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-700 font-bold text-xl flex items-center justify-center ring-2 ring-blue-200 shrink-0">
            {mockUser.initials}
          </div>
          <div>
            <p className="font-semibold text-gray-900">{mockUser.name}</p>
            <p className="text-sm text-gray-500">{mockUser.role} · Pro Member since {mockUser.memberSince}</p>
            <div className="flex gap-2 mt-1.5">
              <span className="text-xs border border-gray-200 text-gray-600 px-2 py-0.5 rounded-full">Active</span>
              <span className="text-xs border border-blue-200 text-blue-600 px-2 py-0.5 rounded-full">LinkedIn Verified</span>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="flex flex-col gap-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition min-h-[44px]"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Email Address</label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition min-h-[44px]"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Current Role</label>
              <input
                type="text"
                value={form.role}
                onChange={e => setForm({ ...form, role: e.target.value })}
                className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition min-h-[44px]"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Timezone</label>
              <input
                type="text"
                value={form.timezone}
                onChange={e => setForm({ ...form, timezone: e.target.value })}
                className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition min-h-[44px]"
              />
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className={`px-6 py-2.5 rounded-xl text-sm font-semibold text-white min-h-[44px] transition-colors ${
                saved ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {saved ? '✓ Saved!' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
