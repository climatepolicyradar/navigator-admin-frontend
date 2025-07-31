import { AxiosError } from 'axios'

import API from '@/api'
import { setToken } from '@/api/Auth'
import { IError } from '@/interfaces'
import { IOrganisation } from '@/interfaces/Organisation'
import { IOrganisationForm } from '@/components/forms/OrganisationForm'

export async function getOrganisations() {
  setToken(API)

  const response = await API.get<IOrganisation[]>('/v1/organisations')
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

export async function getOrganisation(id: string) {
  setToken(API)

  const response = await API.get<IOrganisation>('/v1/organisations/' + id)
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

export async function createOrganisation(data: IOrganisationForm) {
  setToken(API)

  const response = await API.post<string>('/v1/organisations', data)
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
