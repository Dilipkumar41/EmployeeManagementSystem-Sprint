import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authApi from '../../api/authApi'
import { setToken } from '../../api/axiosClient'   // ✅ make sure we import this
import { clearMyProfile } from '../me/meSlice'     // ✅ allow clearing profile on logout

// --- Helpers ---
const TOKEN_KEY = 'token'

const parseJwt = (token) => {
  try {
    const payload = token.split('.')[1]
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    return JSON.parse(json)
  } catch {
    return null
  }
}

const getInitialState = () => {
  const token = localStorage.getItem(TOKEN_KEY) || null
  let user = null
  let role = null

  if (token) {
    const claims = parseJwt(token) || {}
    role =
      claims.role ||
      (Array.isArray(claims.roles) ? claims.roles[0] : claims.roles) ||
      claims['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ||
      null
    user = {
      email:
        claims.email ||
        claims['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] ||
        null,
      name: claims.name || claims['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || null,
      id: claims.sub || claims.nameid || null,
    }
  }

  return { token, user, role, status: 'idle', error: null }
}

// --- Thunks ---
export const loginThunk = createAsyncThunk(
  'auth/login',
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      const data = await authApi.login(payload) // expected { token, user?, role? }

      // ✅ store token in localStorage + axiosClient
      if (data?.token) {
        setToken(data.token) // FIXED: ensure axiosClient uses new token
      }

      // ✅ clear previous profile so new one loads
      dispatch(clearMyProfile()) // FIXED

      return data
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Login failed'
      return rejectWithValue(msg)
    }
  }
)

export const logoutThunk = createAsyncThunk('auth/logout', async (_, { dispatch }) => {
  await authApi.logout()

  // ✅ clear token and profile on logout
  setToken(null)          // FIXED
  dispatch(clearMyProfile()) // FIXED

  return true
})

// --- Slice ---
const authSlice = createSlice({
  name: 'auth',
  initialState: getInitialState(),
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.status = 'succeeded'
        const { token, user, role } = action.payload || {}
        state.token = token || null
        if (token) localStorage.setItem(TOKEN_KEY, token)

        if (user) state.user = user
        if (role) state.role = role

        if ((!user || !role) && token) {
          const claims = parseJwt(token) || {}
          state.role =
            state.role ||
            claims.role ||
            (Array.isArray(claims.roles) ? claims.roles[0] : claims.roles) ||
            claims['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ||
            null

          state.user = state.user || {
            email:
              claims.email ||
              claims['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] ||
              null,
            name: claims.name || claims['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || null,
            id: claims.sub || claims.nameid || null,
          }
        }
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload || 'Login failed'
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        state.token = null
        state.user = null
        state.role = null
        state.status = 'idle'
        state.error = null
        localStorage.removeItem(TOKEN_KEY)
      })
  },
})

export default authSlice.reducer
