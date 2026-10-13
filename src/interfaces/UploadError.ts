import { IDetailedError } from './Auth'

export interface UploadError {
  /** CSV/PDF row the error relates to. Omitted for file-level and header errors. */
  row?: number
  field: string
  message: string
  detail?: string | IDetailedError[]
}
