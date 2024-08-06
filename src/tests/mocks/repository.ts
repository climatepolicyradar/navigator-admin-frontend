import { IEvent } from '@/interfaces/Event'
import { mockCollection, mockDocument2, mockEvent } from '../utilsTest/mocks'
import { ICollection, ICollectionFormPost, IDocument } from '@/interfaces'

let eventRepository = [mockEvent]
let documentRepository = [mockDocument2]
let collectionRepository = [mockCollection]

const getEvent = (id: string) => {
  return eventRepository.find((event) => event.import_id === id)
}

const updateEvent = (data: IEvent, id: string) => {
  eventRepository = eventRepository.map((event) => {
    if (id === event.import_id) {
      return { ...event, ...data }
    }
    return event
  })
}

const getDocument = (id: string) => {
  return documentRepository.find((doc) => doc.import_id === id)
}

const updateDocument = (data: IDocument, id: string) => {
  documentRepository = documentRepository.map((doc) => {
    if (id === doc.import_id) {
      return { ...doc, ...data }
    }
    return doc
  })
}

const getCollection = (id: string) => {
  return collectionRepository.find((coll) => coll.import_id === id)
}

const createCollection = (data: ICollectionFormPost) => {
  const import_id = `${data.title}-${collectionRepository.length}`
  collectionRepository.push({
    title: data.title,
    description: data.description ?? '',
    import_id: import_id,
    families: [],
    organisation: 'CCLW',
  })
  return import_id
}

const updateCollection = (data: ICollection, id: string) => {
  collectionRepository = collectionRepository.map((coll) => {
    if (id === coll.import_id) {
      return { ...coll, ...data }
    }
    return coll
  })
}

const reset = () => {
  eventRepository = [mockEvent]
  documentRepository = [mockDocument2]
  collectionRepository = [mockCollection]
}

export {
  getEvent,
  updateEvent,
  getDocument,
  updateDocument,
  getCollection,
  createCollection,
  updateCollection,
  reset,
}
