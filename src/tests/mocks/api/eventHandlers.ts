import { http, HttpResponse } from 'msw'
import { getEvent, updateEvent } from '../repository'
import { IEvent } from '@/interfaces/Event'

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
]
