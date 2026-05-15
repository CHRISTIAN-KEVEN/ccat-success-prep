import { config } from './config'

const BASE_URL = config.apiUrl

// Queues callbacks waiting for a refresh in progress
let isRefreshing = false
let refreshQueue: Array<(token: string | null) => void> = []

async function tryRefresh(): Promise<string | null> {
  const strRefreshToken = typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null
  if (!strRefreshToken) return null
  try {
    const res = await fetch(`${BASE_URL}/api/v1/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ strRefreshToken }),
    })
    if (!res.ok) return null
    const data = await res.json()
    localStorage.setItem('accessToken', data.accessToken)
    localStorage.setItem('refreshToken', data.refreshToken)
    return data.accessToken as string
  } catch {
    return null
  }
}

function clearSessionAndRedirect() {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
  localStorage.removeItem('user')
  if (typeof window !== 'undefined') window.location.href = '/login'
}

async function doFetch<T>(path: string, options: RequestInit, token: string | null): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }))
    // ProblemDetail uses 'detail' not 'message' — normalise so callers see err.message
    if (!err.message && err.detail) err.message = err.detail
    if (!err.message && err.title) err.message = `${err.status ?? res.status} ${err.title}`
    throw err
  }
  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null

  try {
    return await doFetch<T>(path, options, token)
  } catch (err: unknown) {
    const status = (err as { status?: number })?.status
    const isAuthEndpoint = path.includes('/api/v1/auth/')

    // On 401, try once to refresh — but never on auth endpoints to avoid loops
    if ((err as { detail?: string; title?: string })?.title === 'Unauthorized' ||
        (typeof err === 'object' && err !== null && 'status' in err && (err as { status: number }).status === 401) ||
        status === 401) {
      if (isAuthEndpoint) { clearSessionAndRedirect(); throw err }

      if (isRefreshing) {
        // Wait for the in-progress refresh then retry
        return new Promise<T>((resolve, reject) => {
          refreshQueue.push(async (newToken) => {
            if (!newToken) { reject(err); return }
            try { resolve(await doFetch<T>(path, options, newToken)) }
            catch (e) { reject(e) }
          })
        })
      }

      isRefreshing = true
      const newToken = await tryRefresh()
      isRefreshing = false

      // Drain the queue
      refreshQueue.forEach(cb => cb(newToken))
      refreshQueue = []

      if (!newToken) { clearSessionAndRedirect(); throw err }
      return doFetch<T>(path, options, newToken)
    }

    throw err
  }
}

export const api = {
  get:    <T>(path: string) => request<T>(path),
  post:   <T>(path: string, body: unknown) => request<T>(path, { method: 'POST',  body: JSON.stringify(body) }),
  patch:  <T>(path: string, body: unknown) => request<T>(path, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
}
