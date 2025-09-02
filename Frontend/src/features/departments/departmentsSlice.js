// src/features/departments/departmentsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import departmentsApi from '../../api/departmentsApi'

// --- Thunks ---
export const fetchDepartments = createAsyncThunk(
  'departments/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await departmentsApi.getAll()
      return data
    } catch (err) {
      return rejectWithValue(err?.response?.data || err.message)
    }
  }
)

export const createDepartment = createAsyncThunk(
  'departments/create',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await departmentsApi.create(payload) // { departmentName }
      return data
    } catch (err) {
      return rejectWithValue(err?.response?.data || err.message)
    }
  }
)

export const updateDepartment = createAsyncThunk(
  'departments/update',
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      // our backend returns NoContent, so just return {id, ...payload}
      await departmentsApi.update(id, payload)
      return { id, ...payload }
    } catch (err) {
      return rejectWithValue(err?.response?.data || err.message)
    }
  }
)

export const deleteDepartment = createAsyncThunk(
  'departments/delete',
  async (id, { rejectWithValue }) => {
    try {
      await departmentsApi.remove(id)
      return id
    } catch (err) {
      return rejectWithValue(err?.response?.data || err.message)
    }
  }
)

// --- Slice ---
const departmentsSlice = createSlice({
  name: 'departments',
  initialState: {
    list: [],
    status: 'idle',
    error: null,
    actionStatus: 'idle',
    actionError: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetch
      .addCase(fetchDepartments.pending, (s) => {
        s.status = 'loading'
        s.error = null
      })
      .addCase(fetchDepartments.fulfilled, (s, a) => {
        s.status = 'succeeded'
        s.list = a.payload || []
      })
      .addCase(fetchDepartments.rejected, (s, a) => {
        s.status = 'failed'
        s.error = a.payload || 'Failed to load departments'
      })
      // create
      .addCase(createDepartment.fulfilled, (s, a) => {
        if (a.payload) s.list.push(a.payload)
      })
      // update
      .addCase(updateDepartment.fulfilled, (s, a) => {
        const updated = a.payload
        const idx = s.list.findIndex(
          (d) => (d.departmentId ?? d.id) === updated.id
        )
        if (idx >= 0) {
          s.list[idx] = {
            ...s.list[idx],
            ...updated
          }
        }
      })
      // delete
      .addCase(deleteDepartment.fulfilled, (s, a) => {
        s.list = s.list.filter(
          (d) => (d.departmentId ?? d.id) !== a.payload
        )
      })
  }
})

export default departmentsSlice.reducer
