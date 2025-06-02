import { IEvent } from '@/interfaces/Event'
import {
  mockCollection,
  mockDocument2,
  mockEvent,
  mockFamiliesData,
} from '../utilsTest/mocks'
import {
  ICollection,
  ICollectionFormPost,
  IDocument,
  IDocumentFormPostModified,
  IEventFormPost,
  TFamily,
  TFamilyFormPost,
} from '@/interfaces'

let eventRepository = [mockEvent]
let documentRepository = [mockDocument2]
let collectionRepository = [mockCollection]
const familyRepository: TFamily[] = [...mockFamiliesData]

const getEvent = (id: string) => {
  return eventRepository.find((event) => event.import_id === id)
}

const createEvent = (data: IEventFormPost, org: string) => {
  const import_id = `${org}.event.${eventRepository.length}`
  eventRepository.push({
    import_id: import_id,
    event_status: 'created',
    ...data,
    date:
      data.date instanceof Date
        ? data.date.toISOString()
        : new Date(data.date).toISOString(),
  })
  return import_id
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

const createDocument = (data: IDocumentFormPostModified, org: string) => {
  const import_id = `${org}.document.${documentRepository.length}`
  documentRepository.push({
    import_id: import_id,
    status: 'created',
    ...data,
  } as IDocument)
  return import_id
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

const getFamily = (id: string) => {
  return familyRepository.find((fam) => fam.import_id === id)
}

const createFamily = (data: TFamilyFormPost, org: string) => {
  const import_id = `${org}.family.${familyRepository.length}`
  familyRepository.push({
    import_id: import_id,
    ...data,
  } as TFamily)
  return import_id
}

const reset = () => {
  eventRepository = [mockEvent]
  documentRepository = [mockDocument2]
  collectionRepository = [mockCollection]
}

export {
  getEvent,
  createEvent,
  updateEvent,
  getDocument,
  createDocument,
  updateDocument,
  getCollection,
  createCollection,
  updateCollection,
  getFamily,
  createFamily,
  reset,
}
