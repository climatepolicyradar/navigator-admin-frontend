import { cclwConfigMock, mcfConfigMock } from '@/tests/utilsTest/mocks'
import { http, HttpResponse } from 'msw'
import { extractOrgFromAuthHeader } from '@/tests/helpers'

export const configHandlers = [
  http.get('*/v1/config', ({ request }) => {
    const org = extractOrgFromAuthHeader(request.headers)
    if (org && ['GCF', 'GEF', 'AF', 'CIF'].includes(org)) {
      return HttpResponse.json({ ...mcfConfigMock })
    }
    return HttpResponse.json({ ...cclwConfigMock })
  }),
]
