import {
  getCollection,
  createCollection,
  updateCollection,
} from '../repository'
import { ICollection, ICollectionFormPost } from '@/interfaces'
import { http, HttpResponse } from 'msw'

export const collectionHandlers = [
  http.get('*/v1/collection/:id/edit', async ({ request, params }) => {
    const { id } = params
    const updateData = await request.json()
    updateCollection(updateData as ICollection, id as string)
    const updatedCollection = getCollection(id as string)
    return HttpResponse.json(updatedCollection)
  }),
  http.get('*/v1/collections/:id', ({ params }) => {
    const { id } = params
    const collection = getCollection(id as string)
    return HttpResponse.json(collection)
  }),
  http.get('*/v1/collections/*', () => {
    return HttpResponse.json([])
  }),
  http.post('*/v1/collections', async ({ request }) => {
    const updateData = await request.json()
    const createdCollectionId = createCollection(
      updateData as ICollectionFormPost,
    )
    return HttpResponse.json(createdCollectionId)
  }),
]
