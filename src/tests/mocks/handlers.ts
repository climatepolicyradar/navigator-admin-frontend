import { http, HttpResponse } from 'msw'
import { cclwConfigMock } from '../utilsTest/mocks'
import { familyHandlers } from './api/familyHandlers'
import { collectionHandlers } from './api/collectionHandlers'
import { eventHandlers } from './api/eventHandlers'
import { documentHandlers } from './api/documentHandlers'

export const handlers = [
  http.get('*/v1/config', () => {
    return HttpResponse.json({ ...cclwConfigMock })
  }),
  ...familyHandlers,
  ...collectionHandlers,
  ...eventHandlers,
  ...documentHandlers,
]
