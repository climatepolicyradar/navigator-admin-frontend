import { familyHandlers } from './api/familyHandlers'
import { collectionHandlers } from './api/collectionHandlers'
import { eventHandlers } from './api/eventHandlers'
import { documentHandlers } from './api/documentHandlers'
import { configHandlers } from './api/configHandlers'
import { organisationHandlers } from './api/organisationHandlers'

export const handlers = [
  ...configHandlers,
  ...familyHandlers,
  ...collectionHandlers,
  ...eventHandlers,
  ...documentHandlers,
  ...organisationHandlers,
]
