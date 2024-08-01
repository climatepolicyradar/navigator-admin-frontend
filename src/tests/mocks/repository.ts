import { IEvent } from '@/interfaces/Event'
import { mockDocument2, mockEvent } from '../utilsTest/mocks'
import { IDocument } from '@/interfaces'

let eventRepository = [mockEvent]
let documentRepository = [mockDocument2]

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

const reset = () => {
  eventRepository = [mockEvent]
  documentRepository = [mockDocument2]
}

export {
  eventRepository,
  getEvent,
  updateEvent,
  getDocument,
  updateDocument,
  reset,
}
