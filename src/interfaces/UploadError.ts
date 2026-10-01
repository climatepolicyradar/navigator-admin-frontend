export interface UploadError {
  /** CSV row the error relates to. Omitted for file-level and header errors. */
  row?: number
  field: string
  message: string
}
