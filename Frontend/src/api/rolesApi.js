import axiosClient from './axiosClient'

const rolesApi = {
  getAll: () => axiosClient.get('/roles'),
}

export default rolesApi
