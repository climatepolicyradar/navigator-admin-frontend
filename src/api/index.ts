import axios from 'axios'

const API = axios.create({
  baseURL: 'https://admin.dev.climatepolicyradar.org/api/',
  headers: {
    'Content-Type': 'application/json',
  },
})

export const GET = (url: string) => {
  return API.get(url)
}

export default API
