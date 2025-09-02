import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import rolesApi from '../../api/rolesApi'

export const fetchRoles = createAsyncThunk('roles/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const { data } = await rolesApi.getAll()
    return data
  } catch (err) {
    return rejectWithValue(err?.response?.data || err.message)
  }
})

const rolesSlice = createSlice({
  name: 'roles',
  initialState: {
    list: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchRoles.pending, (s) => { s.status = 'loading'; s.error = null })
     .addCase(fetchRoles.fulfilled, (s, a) => { s.status = 'succeeded'; s.list = a.payload || [] })
     .addCase(fetchRoles.rejected, (s, a) => { s.status = 'failed'; s.error = a.payload || 'Failed to load roles' })
  }
})

export default rolesSlice.reducer
