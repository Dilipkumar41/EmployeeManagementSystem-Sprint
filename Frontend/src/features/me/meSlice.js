import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import meApi from '../../api/meApi'

/**
 * Expected /api/me response (flexible):
 * {
 *   user: { userId, email, createdAt },
 *   employee: {
 *     employeeId, firstName, lastName, gender, dateOfBirth,
 *     hireDate, jobTitle, departmentId, managerId
 *     department?: { departmentId, departmentName }
 *     manager?: { employeeId, firstName, lastName }
 *   },
 *   role: "HR" | "Manager" | "Employee"
 * }
 */

export const fetchMyProfile = createAsyncThunk('me/fetch', async (_, { rejectWithValue }) => {
  try {
    const { data } = await meApi.getProfile()
    return data
  } catch (err) {
    const msg = err?.response?.data?.message || err?.message || 'Failed to load profile'
    return rejectWithValue(msg)
  }
})

const meSlice = createSlice({
  name: 'me',
  initialState: {
    data: null,
    status: 'idle',
    error: null,
  },
  reducers: {
    // ✅ new reducer to clear profile (on logout or re-login)
    clearMyProfile: (state) => {
      state.data = null
      state.status = 'idle'
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyProfile.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchMyProfile.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.data = action.payload
      })
      .addCase(fetchMyProfile.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload || 'Failed to load profile'
      })
  },
})

export const { clearMyProfile } = meSlice.actions
export default meSlice.reducer

// Selectors
export const selectMyProfile = (state) => state.me?.data
export const selectMyProfileStatus = (state) => state.me?.status
export const selectMyProfileError = (state) => state.me?.error
