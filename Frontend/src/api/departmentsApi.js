import axiosClient from './axiosClient'

const departmentsApi = {
  getAll: () => axiosClient.get('/departments'),
  getById: (id) => axiosClient.get(`/departments/${id}`),
  create: (payload) => axiosClient.post('/departments', payload), // CreateDepartmentDto
  update: (id, payload) => axiosClient.put(`/departments/${id}`, payload),
  remove: (id) => axiosClient.delete(`/departments/${id}`),
}

export default departmentsApi
