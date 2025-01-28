import {
  mockCCLWFamilyOneDocument,
  mockCCLWFamilyWithOneEvent,
  mockFamiliesData,
  mockGCFFamily,
} from '@/tests/utilsTest/mocks'
import { http, HttpResponse } from 'msw'

export const familyHandlers = [
  http.get('*/v1/families/:id', ({ params }) => {
    const { id } = params
    if (id === 'mockCCLWFamilyWithOneEvent') {
      return HttpResponse.json({ ...mockCCLWFamilyWithOneEvent })
    }
    if (id === 'mockCCLWFamilyOneDocument') {
      return HttpResponse.json({ ...mockCCLWFamilyOneDocument })
    }
    if (id?.includes('GCF')) {
      return HttpResponse.json({ ...mockGCFFamily })
    }
    return HttpResponse.json({ ...mockFamiliesData[0] })
  }),
  http.get('*/v1/families/', () => {
    return HttpResponse.json({ families: { data: mockFamiliesData } })
  }),
  http.post('*/v1/families', () => {
    return HttpResponse.json('GCF.family.i00000004.n0000')
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
]
