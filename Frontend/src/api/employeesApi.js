import axiosClient from './axiosClient'

const employeesApi = {
  getAll: () => axiosClient.get('/employees'),
  getById: (id) => axiosClient.get(`/employees/${id}`),
  create: (payload) => axiosClient.post('/employees', payload),
  update: (id, payload) => axiosClient.put(`/employees/${id}`, payload),
  remove: (id) => axiosClient.delete(`/employees/${id}`),
}

export default employeesApi
