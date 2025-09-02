import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import usersApi from '../../api/usersApi'

// Fetch all users
export const fetchUsers = createAsyncThunk('users/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const { data } = await usersApi.getAll()
    return data
  } catch (err) {
    return rejectWithValue(err?.response?.data || err.message)
  }
})

// (Optional) Create user – only works if you expose POST /users in backend, otherwise use /auth/register
export const createUser = createAsyncThunk('users/create', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await usersApi.create(payload)
    return data
  } catch (err) {
    return rejectWithValue(err?.response?.data || err.message)
  }
})

// ✅ Update user role
export const updateUserRole = createAsyncThunk('users/updateRole', async ({ id, roleId }, { rejectWithValue }) => {
  try {
    // Backend expects an int, not { roleId: ... }
    const { data } = await usersApi.updateRole(id, roleId)
    return data
  } catch (err) {
    return rejectWithValue(err?.response?.data || err.message)
  }
})

// Delete user
export const deleteUser = createAsyncThunk('users/delete', async (id, { rejectWithValue }) => {
  try {
    await usersApi.remove(id)
    return id
  } catch (err) {
    return rejectWithValue(err?.response?.data || err.message)
  }
})

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    list: [],
    status: 'idle',
    error: null,
    actionStatus: 'idle',
    actionError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetch
      .addCase(fetchUsers.pending, (s) => { s.status = 'loading'; s.error = null })
      .addCase(fetchUsers.fulfilled, (s, a) => { s.status = 'succeeded'; s.list = a.payload || [] })
      .addCase(fetchUsers.rejected, (s, a) => { s.status = 'failed'; s.error = a.payload || 'Failed to load users' })

      // create
      .addCase(createUser.fulfilled, (s, a) => { s.list.push(a.payload) })

      // update role
      .addCase(updateUserRole.fulfilled, (s, a) => {
        const updated = a.payload
        const id = updated.userId ?? updated.id
        const idx = s.list.findIndex(u => (u.userId ?? u.id) === id)
        if (idx >= 0) s.list[idx] = updated
      })

      // delete
      .addCase(deleteUser.fulfilled, (s, a) => {
        s.list = s.list.filter(u => (u.userId ?? u.id) !== a.payload)
      })
  }
})

export default usersSlice.reducer
