import { IDocument, IDocumentFormPostModified } from '@/interfaces'
import { http, HttpResponse } from 'msw'
import { createDocument, getDocument, updateDocument } from '../repository'
import { extractOrgFromAuthHeader } from '@/tests/helpers'

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
  http.post('*/v1/documents', async ({ request }) => {
    const org = extractOrgFromAuthHeader(request.headers)
    const document = await request.json()
    const createdDocumentId = createDocument(
      document as IDocumentFormPostModified,
      org,
    )
    return HttpResponse.json(createdDocumentId)
  }),
]
