import axios from 'axios'

const API = axios.create({
  baseURL: 'https://admin.dev.climatepolicyradar.org/api/',
  // baseURL: 'https://m2bv8pdzts.eu-west-1.awsapprunner.com/api/',
  headers: {
    'Content-Type': 'application/json',
  },
})

export const GET = (url: string) => {
  return API.get(url)
}

export default API
