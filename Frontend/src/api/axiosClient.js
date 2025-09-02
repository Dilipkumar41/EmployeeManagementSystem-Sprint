import axios from 'axios'

// Use Vite proxy in dev, .env variable in prod
const baseURL = import.meta.env.DEV
  ? '/api'
  : import.meta.env.VITE_API_BASE_URL // e.g., https://localhost:7061/api

const axiosClient = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: false,
})

// --- Token helpers ---
export const getToken = () => localStorage.getItem('token')

export const setToken = (token) => {
  if (token) localStorage.setItem('token', token)
  else localStorage.removeItem('token')
}

// --- Request interceptor: attach JWT if present ---
axiosClient.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// --- Response interceptor: auto-handle 401 ---
axiosClient.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      setToken(null)
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(err)
  }
)

export default axiosClient
