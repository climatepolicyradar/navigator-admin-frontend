import { collectionHandlers } from './api/collectionHandlers'
import { configHandlers } from './api/configHandlers'
import { documentHandlers } from './api/documentHandlers'
import { eventHandlers } from './api/eventHandlers'
import { familyHandlers } from './api/familyHandlers'

export const handlers = [
  ...configHandlers,
  ...familyHandlers,
  ...collectionHandlers,
  ...eventHandlers,
  ...documentHandlers,
]
