import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import leavesApi from '../../api/leavesApi'
import toast from 'react-hot-toast'

// Fetch all leaves (HR/Manager)
export const fetchAllLeaves = createAsyncThunk('leaves/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const { data } = await leavesApi.getAll()
    return data
  } catch (err) {
    toast.error('Failed to load leaves')
    return rejectWithValue(err?.response?.data || err?.message || 'Error')
  }
})

// Fetch my leaves (Employee). If your API doesn’t have /leaves/mine, remove this thunk.
export const fetchMyLeaves = createAsyncThunk('leaves/fetchMine', async (_, { rejectWithValue }) => {
  try {
    const { data } = await leavesApi.myLeaves()
    return data
  } catch (err) {
    toast.error('Failed to load your leaves')
    return rejectWithValue(err?.response?.data || err?.message || 'Error')
  }
})

// Apply for leave — payload must match ApplyLeaveDto:
// { employeeId: number, startDate: 'YYYY-MM-DD', endDate: 'YYYY-MM-DD', reason?: string }
export const applyLeave = createAsyncThunk('leaves/apply', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await leavesApi.apply(payload)
    toast.success('Leave request submitted ✅')
    return data
  } catch (err) {
    toast.error('Failed to submit leave')
    return rejectWithValue(err?.response?.data || err?.message || 'Error')
  }
})

// Approve/Reject leave — backend expects { status: 'Approved' | 'Rejected' }
export const updateLeaveStatus = createAsyncThunk(
  'leaves/updateStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const { data } = await leavesApi.updateStatus(id, { status })
      toast.success(`Leave ${status} ✅`)
      return data
    } catch (err) {
      toast.error('Failed to update status')
      return rejectWithValue(err?.response?.data || err?.message || 'Error')
    }
  }
)

const leavesSlice = createSlice({
  name: 'leaves',
  initialState: {
    all: [],
    mine: [],
    status: 'idle',        // loading state for list fetches
    error: null,
    actionStatus: 'idle',  // loading state for apply/approve/reject
    actionError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ===== All Leaves =====
      .addCase(fetchAllLeaves.pending, (s) => {
        s.status = 'loading'
        s.error = null
      })
      .addCase(fetchAllLeaves.fulfilled, (s, a) => {
        s.status = 'succeeded'
        s.all = Array.isArray(a.payload) ? a.payload : (a.payload ? [a.payload] : [])
      })
      .addCase(fetchAllLeaves.rejected, (s, a) => {
        s.status = 'failed'
        s.error = a.payload || 'Failed to load leaves'
      })

      // ===== My Leaves =====
      .addCase(fetchMyLeaves.pending, (s) => {
        s.status = 'loading'
        s.error = null
      })
      .addCase(fetchMyLeaves.fulfilled, (s, a) => {
        s.status = 'succeeded'
        s.mine = Array.isArray(a.payload) ? a.payload : (a.payload ? [a.payload] : [])
      })
      .addCase(fetchMyLeaves.rejected, (s, a) => {
        s.status = 'failed'
        s.error = a.payload || 'Failed to load my leaves'
      })

      // ===== Apply =====
      .addCase(applyLeave.pending, (s) => {
        s.actionStatus = 'loading'
        s.actionError = null
      })
      .addCase(applyLeave.fulfilled, (s, a) => {
        s.actionStatus = 'succeeded'
        const created = a.payload
        if (created) {
          if (Array.isArray(s.mine)) s.mine.push(created)
          if (Array.isArray(s.all)) s.all.push(created)
        }
      })
      .addCase(applyLeave.rejected, (s, a) => {
        s.actionStatus = 'failed'
        s.actionError = a.payload || 'Apply failed'
      })

      // ===== Approve / Reject =====
      .addCase(updateLeaveStatus.pending, (s) => {
        s.actionStatus = 'loading'
        s.actionError = null
      })
      .addCase(updateLeaveStatus.fulfilled, (s, a) => {
        s.actionStatus = 'succeeded'
        const updated = a.payload
        const updatedId = updated?.leaveId ?? updated?.id
        if (!updatedId) return

        const patch = (arr) => {
          if (!Array.isArray(arr)) return
          const idx = arr.findIndex(x => (x?.leaveId ?? x?.id) === updatedId)
          if (idx >= 0) arr[idx] = updated
        }
        patch(s.all)
        patch(s.mine)
      })
      .addCase(updateLeaveStatus.rejected, (s, a) => {
        s.actionStatus = 'failed'
        s.actionError = a.payload || 'Update failed'
      })
  }
})

export default leavesSlice.reducer
