import { mockCollection } from '@/tests/utilsTest/mocks'
import { http, HttpResponse } from 'msw'

export const collectionHandlers = [
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
]
