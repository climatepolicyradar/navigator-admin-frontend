import { http, HttpResponse } from 'msw'
import {
  cclwConfigMock,
  mockCCLWFamilyOneDocument,
  mockCCLWFamilyWithOneEvent,
  mockCollection,
  mockFamiliesData,
} from '../utilsTest/mocks'
import {
  getDocument,
  getEvent,
  updateEvent,
  updateDocument,
} from './repository'
import { IEvent } from '@/interfaces/Event'
import { IDocument } from '@/interfaces'

export const handlers = [
  http.get('*/v1/config', () => {
    return HttpResponse.json({ ...cclwConfigMock })
  }),

  http.get('*/v1/families/:id', ({ params }) => {
    const { id } = params
    if (id === 'mockCCLWFamilyWithOneEvent') {
      return HttpResponse.json({ ...mockCCLWFamilyWithOneEvent })
    }
    if (id === 'mockCCLWFamilyOneDocument') {
      return HttpResponse.json({ ...mockCCLWFamilyOneDocument })
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
    if (id === 'mockCCLWFamilyOneDocument') {
      return HttpResponse.json({ ...mockCCLWFamilyOneDocument })
    }
    return HttpResponse.json({ ...mockFamiliesData[0] })
  }),

  http.get('*/v1/collection/:id/edit', () => {
    return HttpResponse.json(mockCollection)
  }),
  http.get('*/v1/collections/:id', ({ params }) => {
    const { id } = params
    if (id === mockCollection.id) {
      return HttpResponse.json(mockCollection)
    }
    return HttpResponse.json([])
  }),
  http.get('*/v1/collections/*', () => {
    return HttpResponse.json([])
  }),
  http.post('*/v1/collections', () => {
    return HttpResponse.json(mockCollection.id)
  }),

  http.get('*/v1/events/:id', ({ params }) => {
    const { id } = params
    const event = getEvent(id as string)
    return HttpResponse.json(event)
  }),
  http.put('*/v1/events/:id', async ({ request, params }) => {
    const { id } = params
    const updateData = await request.json()
    updateEvent(updateData as IEvent, id as string)
    const updatedEvent = getEvent(id as string)
    return HttpResponse.json(updatedEvent)
  }),

  http.get('*/v1/documents/:id', ({ params }) => {
    const { id } = params
    const document = getDocument(id as string)
    return HttpResponse.json(document)
  }),
  http.put('*/v1/documents/:id', async ({ request, params }) => {
    const { id } = params
    const updateData = await request.json()
    updateDocument(updateData as IDocument, id as string)
    const updatedDocument = getDocument(id as string)
    return HttpResponse.json(updatedDocument)
  }),
]
