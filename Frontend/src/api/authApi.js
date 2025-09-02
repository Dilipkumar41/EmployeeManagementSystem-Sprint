import axiosClient, { setToken } from './axiosClient'

const authApi = {
  register: (payload) => axiosClient.post('/auth/register', payload),
  login: async (payload) => {
    const { data } = await axiosClient.post('/auth/login', payload)
    // Expecting { token, user, role } (adjust if your API differs)
    if (data?.token) setToken(data.token)
    return data
  },
  logout: () => {
    setToken(null)
    return Promise.resolve()
  },
}

export default authApi
