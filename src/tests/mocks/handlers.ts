import { http, HttpResponse } from 'msw'
import {
  cclwConfigMock,
  mockCCLWFamilyWithOneEvent,
  mockEvent,
  mockFamiliesData,
} from '../utilsTest/mocks'
import { updateEvent } from './repository'
import { IEvent } from '@/interfaces/Event'

export const handlers = [
  http.get('*/v1/config', () => {
    return HttpResponse.json({ ...cclwConfigMock })
  }),

  http.get('*/v1/families/:id', ({ params }) => {
    const { id } = params
    if (id === 'mockCCLWFamilyWithOneEvent') {
      return HttpResponse.json({ ...mockCCLWFamilyWithOneEvent })
    }
    return HttpResponse.json({ ...mockFamiliesData[0] })
  }),
  http.get('*/v1/families/', () => {
    return HttpResponse.json({ families: { data: mockFamiliesData } })
  }),
  http.get('*/v1/family/:id/edit', ({ params }) => {
    const { id } = params
    if (id === 'mockCCLWFamilyWithOneEvent') {
      return HttpResponse.json({ ...mockCCLWFamilyWithOneEvent })
    }
    return HttpResponse.json({ ...mockFamiliesData[0] })
  }),

  http.get('*/v1/collections/*', () => {
    return HttpResponse.json([])
  }),

  http.get('*/v1/events/:id', () => {
    return HttpResponse.json({ ...mockEvent })
  }),
  http.put('*/v1/events/:id', async ({ request, params }) => {
    const { id } = params
    const updateData = await request.json()
    updateEvent(updateData as IEvent, id as string)
    return HttpResponse.json({ ...mockEvent })
  }),
]
