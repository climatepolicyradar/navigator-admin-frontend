import { useState, useEffect, useCallback } from 'react'

import { getDocument } from '@/api/Documents'
import { IError, IDocument } from '@/interfaces'

const useDocument = (id?: string) => {
  const [document, setDocument] = useState<IDocument | null>(null)
  const [error, setError] = useState<IError | null | undefined>()
  const [loading, setLoading] = useState<boolean>(false)

  const handleGetDocument = useCallback(
    (ignore: boolean) => {
      if (id) {
        setLoading(true)

        getDocument(id)
          .then(({ response }) => {
            if (!ignore) setDocument(response.data)
          })
          .catch((error: IError) => {
            setError(error)
          })
          .finally(() => {
            setLoading(false)
          })
      }
    },
    [id],
  )

  const reload = useCallback(() => {
    handleGetDocument(false)
  }, [handleGetDocument])

  useEffect(() => {
    let ignore = false
    handleGetDocument(ignore)
    return () => {
      ignore = true
    }
  }, [id, handleGetDocument])

  return { document, error, loading, reload }
}

export default useDocument
