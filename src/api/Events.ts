import { AxiosError } from 'axios'

import API from '@/api'
import { setToken } from '@/api/Auth'
import { IEvent, IEventFormPost, IError, IEventFormPut } from '@/interfaces'

export async function getEvents(query: string | undefined | null) {
  setToken(API)

  const response = await API.get<IEvent[]>('/v1/events/', {
    params: { q: query || 'climate' },
  })
    .then((response) => {
      return response.data
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

export async function getEvent(id: string) {
  setToken(API)

  const response = await API.get<IEvent>('/v1/events/' + id)
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

export async function createEvent(data: IEventFormPost) {
  setToken(API)

  const response = await API.post<string>('/v1/events', data)
    .then((response) => {
      return response.data
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

export async function updateEvent(data: IEventFormPut, id: string) {
  setToken(API)

  const response = await API.put<IEvent>('/v1/events/' + id, data)
    .then((response) => {
      return response.data
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

export async function deleteEvent(id: string) {
  setToken(API)

  const response = await API.delete('/v1/events/' + id)
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
