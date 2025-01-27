import { cclwConfigMock, mcfConfigMock } from '@/tests/utilsTest/mocks'
import { http, HttpResponse } from 'msw'
import { jwtDecode } from 'jwt-decode'

export const configHandlers = [
  http.get('*/v1/config', (req) => {
    const authHeader = req.request.headers.get('authorization')
    const parsedAuthToken: Record<string, object> = jwtDecode(authHeader || '')
    const authorisation = parsedAuthToken?.authorisation || {}
    const org = Object.keys(authorisation)[0]
    if (org && ['GCF', 'GEF', 'AF', 'CIF'].includes(org)) {
      return HttpResponse.json({ ...mcfConfigMock })
    }
    return HttpResponse.json({ ...cclwConfigMock })
  }),
]
