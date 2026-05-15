'use client'
import { useState, useEffect } from 'react'
import { User, Loader2, Lock } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { api } from '@/lib/apiClient'
import type { UserResponse } from '@/lib/authService'

export default function SettingsPage() {
  const { user, saveSession } = useAuth()

  const [profile, setProfile] = useState({ strFirstName: '', strLastName: '', strLocale: 'fr' })
  const [passwords, setPasswords] = useState({ strCurrentPassword: '', strNewPassword: '', confirm: '' })
  const [loadingProfile, setLoadingProfile] = useState(false)
  const [loadingPwd, setLoadingPwd] = useState(false)
  const [savedProfile, setSavedProfile] = useState(false)
  const [savedPwd, setSavedPwd] = useState(false)
  const [errorProfile, setErrorProfile] = useState('')
  const [errorPwd, setErrorPwd] = useState('')

  // Load latest profile from API
  useEffect(() => {
    api.get<UserResponse>('/api/v1/auth/me').then(u => {
      setProfile({
        strFirstName: u.strFirstName,
        strLastName: u.strLastName,
        strLocale: u.strLocale ?? 'fr',
      })
    }).catch(() => {
      if (user) setProfile({ strFirstName: user.strFirstName, strLastName: user.strLastName, strLocale: user.strLocale ?? 'fr' })
    })
  }, [])

  const initials = `${profile.strFirstName?.[0] ?? ''}${profile.strLastName?.[0] ?? ''}`.toUpperCase()

  const handleSaveProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrorProfile('')
    setLoadingProfile(true)
    try {
      const updated = await api.patch<UserResponse>('/api/v1/auth/me', { strFirstName: profile.strFirstName, strLastName: profile.strLastName, strLocale: profile.strLocale })
      // update session cache
      if (user) saveSession({ accessToken: localStorage.getItem('accessToken')!, refreshToken: localStorage.getItem('refreshToken')!, tokenType: 'Bearer', expiresIn: 3600, user: updated })
      setSavedProfile(true)
      setTimeout(() => setSavedProfile(false), 2500)
    } catch (err: unknown) {
      setErrorProfile(err && typeof err === 'object' && 'message' in err ? String((err as { message: string }).message) : 'Erreur')
    } finally {
      setLoadingProfile(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (passwords.strNewPassword !== passwords.confirm) { setErrorPwd('Les mots de passe ne correspondent pas'); return }
    setErrorPwd('')
    setLoadingPwd(true)
    try {
      await api.post('/api/v1/auth/change-password', { strCurrentPassword: passwords.strCurrentPassword, strNewPassword: passwords.strNewPassword })
      setPasswords({ strCurrentPassword: '', strNewPassword: '', confirm: '' })
      setSavedPwd(true)
      setTimeout(() => setSavedPwd(false), 2500)
    } catch (err: unknown) {
      setErrorPwd(err && typeof err === 'object' && 'message' in err ? String((err as { message: string }).message) : 'Erreur')
    } finally {
      setLoadingPwd(false)
    }
  }

  return (
    <div className="p-4 sm:p-6 flex flex-col gap-6 max-w-2xl">

      {/* Profile */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-7">
        <div className="flex items-center gap-3 mb-6 pb-5 border-b border-gray-100">
          <User size={20} className="text-gray-400" />
          <h1 className="text-xl font-bold text-gray-900">Profile</h1>
        </div>

        <div className="flex items-center gap-4 mb-7">
          <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-700 font-bold text-xl flex items-center justify-center ring-2 ring-blue-200 shrink-0">
            {initials || '?'}
          </div>
          <div>
            <p className="font-semibold text-gray-900">{profile.strFirstName} {profile.strLastName}</p>
            <p className="text-sm text-gray-500">{user?.emRole} · {user?.strEmail}</p>
            <span className="text-xs border border-gray-200 text-gray-600 px-2 py-0.5 rounded-full mt-1 inline-block">{user?.emStatus}</span>
          </div>
        </div>

        {errorProfile && <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg mb-4">{errorProfile}</p>}

        <form onSubmit={handleSaveProfile} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Prénom</label>
              <input type="text" value={profile.strFirstName} onChange={e => setProfile(p => ({ ...p, strFirstName: e.target.value }))}
                className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Nom</label>
              <input type="text" value={profile.strLastName} onChange={e => setProfile(p => ({ ...p, strLastName: e.target.value }))}
                className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input type="email" value={user?.strEmail ?? ''} disabled
                className="border border-gray-100 bg-gray-50 rounded-xl px-3 py-2.5 text-sm text-gray-400" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Langue</label>
              <select value={profile.strLocale} onChange={e => setProfile(p => ({ ...p, strLocale: e.target.value }))}
                className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition">
                <option value="fr">Français</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end">
            <button type="submit" disabled={loadingProfile}
              className={`px-6 py-2.5 rounded-xl text-sm font-semibold text-white flex items-center gap-2 transition-colors ${savedProfile ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-700'}`}>
              {loadingProfile ? <Loader2 size={15} className="animate-spin" /> : savedProfile ? '✓ Enregistré!' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>

      {/* Change password */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-7">
        <div className="flex items-center gap-3 mb-6 pb-5 border-b border-gray-100">
          <Lock size={20} className="text-gray-400" />
          <h1 className="text-xl font-bold text-gray-900">Changer le mot de passe</h1>
        </div>

        {errorPwd && <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg mb-4">{errorPwd}</p>}

        <form onSubmit={handleChangePassword} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Mot de passe actuel</label>
            <input type="password" required value={passwords.strCurrentPassword}
              onChange={e => setPasswords(p => ({ ...p, strCurrentPassword: e.target.value }))}
              className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Nouveau mot de passe</label>
              <input type="password" required minLength={8} value={passwords.strNewPassword}
                onChange={e => setPasswords(p => ({ ...p, strNewPassword: e.target.value }))}
                className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Confirmer</label>
              <input type="password" required minLength={8} value={passwords.confirm}
                onChange={e => setPasswords(p => ({ ...p, confirm: e.target.value }))}
                className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition" />
            </div>
          </div>
          <div className="flex justify-end">
            <button type="submit" disabled={loadingPwd}
              className={`px-6 py-2.5 rounded-xl text-sm font-semibold text-white flex items-center gap-2 transition-colors ${savedPwd ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-700'}`}>
              {loadingPwd ? <Loader2 size={15} className="animate-spin" /> : savedPwd ? '✓ Modifié!' : 'Changer le mot de passe'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
