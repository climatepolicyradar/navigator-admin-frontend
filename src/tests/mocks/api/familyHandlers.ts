import { TFamilyFormPost } from '@/interfaces'
import {
  mockCCLWFamilyOneDocument,
  mockCCLWFamilyWithOneEvent,
  mockUNFCCCFamilyNoDocumentsNoEvents,
  mockFamiliesData,
  mockUNFCCCFamily,
} from '@/tests/utilsTest/mocks'
import { http, HttpResponse } from 'msw'
import { createFamily, getFamily } from '../repository'
import { extractOrgFromAuthHeader } from '@/tests/helpers'

export const familyHandlers = [
  http.get('*/v1/families/:id', ({ params }) => {
    const { id } = params
    if (id === 'mockCCLWFamilyWithOneEvent') {
      return HttpResponse.json({ ...mockCCLWFamilyWithOneEvent })
    }
    if (id === 'mockCCLWFamilyOneDocument') {
      return HttpResponse.json({ ...mockCCLWFamilyOneDocument })
    }
    if (id === 'mockUNFCCCFamilyNoDocumentsNoEvents') {
      return HttpResponse.json({ ...mockUNFCCCFamilyNoDocumentsNoEvents })
    }
    if (id?.includes('GCF')) {
      const family = getFamily(id as string)
      return HttpResponse.json(family)
    }
    return HttpResponse.json({ ...mockUNFCCCFamily })
  }),
  http.get('*/v1/families/', () => {
    return HttpResponse.json({ families: { data: mockFamiliesData } })
  }),
  http.post('*/v1/families', async ({ request }) => {
    const org = extractOrgFromAuthHeader(request.headers)
    const updateData = await request.json()
    const createdFamilyId = createFamily(updateData as TFamilyFormPost, org)
    return HttpResponse.json(createdFamilyId)
  }),
  http.get('*/v1/family/:id/edit', ({ params }) => {
    const { id } = params
    if (id === 'mockCCLWFamilyWithOneEvent') {
      return HttpResponse.json({ ...mockCCLWFamilyWithOneEvent })
    }
    if (id === 'mockCCLWFamilyOneDocument') {
      return HttpResponse.json({ ...mockCCLWFamilyOneDocument })
    }
    if (id === 'mockUNFCCCFamilyNoDocumentsNoEvents') {
      return HttpResponse.json({ ...mockUNFCCCFamilyNoDocumentsNoEvents })
    }
    return HttpResponse.json({ ...mockFamiliesData[0] })
  }),
]
