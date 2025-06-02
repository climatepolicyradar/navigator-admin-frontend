import { http, HttpResponse } from 'msw'
import { createEvent, getEvent, updateEvent } from '../repository'
import { IEvent, IEventFormPost } from '@/interfaces/Event'
import { extractOrgFromAuthHeader } from '@/tests/helpers'

export const eventHandlers = [
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
  http.post('*/v1/events', async ({ request }) => {
    const org = extractOrgFromAuthHeader(request.headers)
    const event = await request.json()
    const createdEventId = createEvent(event as IEventFormPost, org)
    return HttpResponse.json(createdEventId)
  }),
]
