import { http, HttpResponse } from 'msw'

import { IDocument } from '@/interfaces'

import { getDocument, updateDocument } from '../repository'

export const documentHandlers = [
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
