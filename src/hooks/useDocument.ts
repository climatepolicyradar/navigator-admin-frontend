import { useState, useEffect } from 'react'

import { IError, IDocument } from '@/interfaces'
import { getDocument } from '@/api/Documents'

const useDocument = (id?: string) => {
  const [document, setDocument] = useState<IDocument | null>(null)
  const [error, setError] = useState<IError | null | undefined>()
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    let ignore = false
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

    return () => {
      ignore = true
    }
  }, [id])

  return { document, error, loading }
}

export default useDocument
