import axios, { AxiosError } from 'axios'

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL as string,
  headers: {
    'Content-Type': 'application/json',
  },
})

API.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (401 === error.response?.status) {
      console.log('401 - Unauthorized')
      delete API.defaults.headers.common['Authorization']
      localStorage.removeItem('token')
      window.location.href = '/login'
      return Promise.reject(error)
    } else {
      return Promise.reject(error)
    }
  },
)

export const GET = (url: string) => {
  return API.get(url)
};

export default API
