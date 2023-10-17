import { useState, useEffect, useCallback } from 'react'

import { IError, IDocument } from '@/interfaces'
import { getDocuments } from '@/api/Documents'

const useDocuments = (query: string) => {
  const [documents, setDocuments] = useState<IDocument[]>([])
  const [error, setError] = useState<IError | null | undefined>()
  const [loading, setLoading] = useState<boolean>(false)

  const handleGetDocuments = useCallback(() => {
    setLoading(true)
    setError(null)

    getDocuments(query)
      .then(({ response }) => {
        setDocuments(response)
      })
      .catch((error: IError) => {
        setError(error)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [query])

  const reload = () => {
    handleGetDocuments()
  }

  useEffect(() => {
    setLoading(true)
    handleGetDocuments()
  }, [handleGetDocuments])

  return { documents, error, loading, reload }
}

export default useDocuments
