export interface IEvent {
  import_id: string
  event_title: string
  date: string
  event_type_value: string
  event_status: string
  family_import_id: string
  family_document_import_id?: string | null
}

export interface IEventFormPost {
  event_title: string
  date: Date
  event_type_value: string
  family_import_id: string
  family_document_import_id?: string | null
}

export interface IEventFormPut {
  event_title: string
  date: Date
  event_type_value: string
}
