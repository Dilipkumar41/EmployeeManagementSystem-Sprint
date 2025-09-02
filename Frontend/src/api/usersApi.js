import axiosClient from './axiosClient'

const usersApi = {
  getAll: () => axiosClient.get('/users'),
  getById: (id) => axiosClient.get(`/users/${id}`),
  create: (payload) => axiosClient.post('/users', payload),
  // 
  updateRole: (id, roleId) => axiosClient.put(`/users/${id}/role`, roleId, {
    headers: { 'Content-Type': 'application/json' }
  }),
  remove: (id) => axiosClient.delete(`/users/${id}`),
}

export default usersApi
