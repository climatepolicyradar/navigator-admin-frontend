import { AxiosInstance } from 'axios'

export const checkAuth = (API: AxiosInstance) => {
  if (!API.defaults.headers.common['Authorization']) {
    API.defaults.headers.common['Authorization'] =
      'Bearer ' + (localStorage.getItem('token') ?? '')
  }
}
