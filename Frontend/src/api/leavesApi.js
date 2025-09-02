import axiosClient from './axiosClient'

const leavesApi = {
  // employee
  apply: (payload) => axiosClient.post('/leaves', payload), // ApplyLeaveDto
  myLeaves: () => axiosClient.get('/leaves/mine'),          // if you exposed /mine; else filter client-side
  // general list (HR/Manager)
  getAll: () => axiosClient.get('/leaves'),
  getById: (id) => axiosClient.get(`/leaves/${id}`),
  // approve / reject
  updateStatus: (id, payload) => axiosClient.put(`/leaves/${id}/status`, payload), // { status: 'Approved'|'Rejected' }
}

export default leavesApi
