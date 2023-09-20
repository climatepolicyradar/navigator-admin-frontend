import { AxiosError } from 'axios'

import API from '@/api'
import { IFamily, IError } from '@/interfaces'

const checkAuth = () => {
  if (!API.defaults.headers.common['Authorization']) {
    API.defaults.headers.common['Authorization'] =
      'Bearer ' + (localStorage.getItem('token') ?? '')
  }
}

export async function getFamilies(query: string | undefined | null) {
  checkAuth()

  const response = await API.get<IFamily[]>('/v1/families/', {
    params: { q: query || 'redd' },
  })
    .then((response) => {
      return response
    })
    .catch((error: AxiosError<{ detail: string }>) => {
      const e: IError = {
        status: error.response?.status || 500,
        detail: error.response?.data?.detail || 'Unknown error',
        message: error.message,
        returnPage: '/families',
      }
      throw e
    })

  return { response }
}

export async function getFamily(id: string) {
  checkAuth()

  const response = await API.get<IFamily[]>('/v1/families/' + id)
    .then((response) => {
      return response
    })
    .catch((error: AxiosError<{ detail: string }>) => {
      const e: IError = {
        status: error.response?.status || 500,
        detail: error.response?.data?.detail || 'Unknown error',
        message: error.message,
      }
      throw e
    })

  return { response }
}

interface IFamilyPost_TEMP {
  import_id: string
  title: string
  summary: string
  geography: string
  category: string
  status: string
  metadata: object // json string
  slug: string
  events: string[]
  published_date?: string
  last_updated_date?: string
  documents: string[]
  collections: string[]
  organisation: string
}

interface IFamilyPostFromForm_TEMP {
  import_id: string
  title: string
  summary: string
  geography: string
  category: string
  // metadata: string
  organisation: string
}

export async function createFamily(data: IFamilyPostFromForm_TEMP) {
  checkAuth()

  // FIXME: This is a temporary fix to test the POST request
  const familyToPost: IFamilyPost_TEMP = {
    ...data,
    status: 'draft',
    metadata: {},
    slug: '',
    events: [],
    documents: [],
    collections: [],
  }

  console.log('modified family to POST: ', familyToPost)

  const response = await API.post<IFamilyPost_TEMP>(
    '/v1/families',
    familyToPost,
  )
    .then((response) => {
      console.log('POST createFamily: ', response)
      return response
    })
    .catch((error: AxiosError<{ detail: string }>) => {
      const e: IError = {
        status: error.response?.status || 500,
        detail: error.response?.data?.detail || 'Unknown error',
        message: error.message,
      }
      throw e
    })

  return { response }
}
