import axiosClient from './axiosClient'

const meApi = {
  getProfile: () => axiosClient.get('/me'),
}

export default meApi
