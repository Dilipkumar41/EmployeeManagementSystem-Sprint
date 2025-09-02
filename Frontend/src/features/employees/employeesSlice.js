import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import employeesApi from '../../api/employeesApi'
import toast from 'react-hot-toast'

export const fetchEmployees = createAsyncThunk('employees/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const { data } = await employeesApi.getAll()
    return data
  } catch (err) {
    toast.error('Failed to load employees')
    return rejectWithValue(err?.response?.data || err.message)
  }
})

export const fetchEmployeeById = createAsyncThunk('employees/fetchById', async (id, { rejectWithValue }) => {
  try {
    const { data } = await employeesApi.getById(id)
    return data
  } catch (err) {
    toast.error('Failed to load employee')
    return rejectWithValue(err?.response?.data || err.message)
  }
})

export const createEmployee = createAsyncThunk('employees/create', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await employeesApi.create(payload)
    toast.success('Employee created')
    return data
  } catch (err) {
    toast.error('Failed to create employee')
    return rejectWithValue(err?.response?.data || err.message)
  }
})

export const updateEmployee = createAsyncThunk('employees/update', async ({ id, payload }, { rejectWithValue }) => {
  try {
    const { data } = await employeesApi.update(id, { ...payload, employeeId: id })
    toast.success('Employee updated')
    return data
  } catch (err) {
    toast.error('Failed to update employee')
    return rejectWithValue(err?.response?.data || err.message)
  }
})

export const deleteEmployee = createAsyncThunk('employees/delete', async (id, { rejectWithValue }) => {
  try {
    await employeesApi.remove(id)
    toast.success('Employee deleted')
    return id
  } catch (err) {
    toast.error('Failed to delete employee')
    return rejectWithValue(err?.response?.data || err.message)
  }
})

const employeesSlice = createSlice({
  name: 'employees',
  initialState: {
    list: [],
    current: null,
    status: 'idle',
    error: null,
  },
  reducers: {
    clearCurrentEmployee: (state) => { state.current = null },
  },
  extraReducers: (builder) => {
    builder
      // fetch all
      .addCase(fetchEmployees.pending, (s) => { s.status = 'loading'; s.error = null })
      .addCase(fetchEmployees.fulfilled, (s, a) => { s.status = 'succeeded'; s.list = a.payload || [] })
      .addCase(fetchEmployees.rejected, (s, a) => { s.status = 'failed'; s.error = a.payload || 'Failed to load employees' })
      // fetch by id
      .addCase(fetchEmployeeById.pending, (s) => { s.status = 'loading'; s.error = null })
      .addCase(fetchEmployeeById.fulfilled, (s, a) => { s.status = 'succeeded'; s.current = a.payload || null })
      .addCase(fetchEmployeeById.rejected, (s, a) => { s.status = 'failed'; s.error = a.payload || 'Failed to load employee' })
      // create
      .addCase(createEmployee.fulfilled, (s, a) => { if (a.payload) s.list.push(a.payload) })
      // update
      .addCase(updateEmployee.fulfilled, (s, a) => {
        const updated = a.payload
        if (!updated) return
        const uid = updated.employeeId ?? updated.id
        const idx = s.list.findIndex(e => (e.employeeId ?? e.id) === uid)
        if (idx >= 0) s.list[idx] = updated
        if ((s.current?.employeeId ?? s.current?.id) === uid) s.current = updated
      })
      // delete
      .addCase(deleteEmployee.fulfilled, (s, a) => {
        s.list = s.list.filter(e => (e.employeeId ?? e.id) !== a.payload)
        if ((s.current?.employeeId ?? s.current?.id) === a.payload) s.current = null
      })
  }
})

export const { clearCurrentEmployee } = employeesSlice.actions
export default employeesSlice.reducer
