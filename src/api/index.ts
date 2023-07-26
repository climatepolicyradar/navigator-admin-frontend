import axios from 'axios'

const API = axios.create({
  baseURL: 'https://uxyp33gdsz.eu-west-1.awsapprunner.com/api/v1/',
  headers: {
    'Content-Type': 'application/json',
  },
})

export default API
