import { http, HttpResponse } from 'msw'

import { extractOrgFromAuthHeader } from '@/tests/helpers'
import {
  cclwConfigMock,
  mcfConfigMock,
  unfcccConfigMock,
} from '@/tests/utilsTest/mocks'

export const configHandlers = [
  http.get('*/v1/config', ({ request }) => {
    const org = extractOrgFromAuthHeader(request.headers)
    if (org && ['GCF', 'GEF', 'AF', 'CIF'].includes(org)) {
      return HttpResponse.json({ ...mcfConfigMock })
    }
    if (org && org == 'UNFCCC') {
      return HttpResponse.json({ ...unfcccConfigMock })
    }
    return HttpResponse.json({ ...cclwConfigMock })
  }),
]
