import { useCallback, useEffect, useState } from 'react'

import { getCorpusType } from '@/api/CorpusTypes'
import { IError } from '@/interfaces'
import { ICorpusType } from '@/interfaces/CorpusType'

const useCorpusType = (id?: string) => {
  const [corpusType, setCorpusType] = useState<ICorpusType>()
  const [error, setError] = useState<IError>()
  const [loading, setLoading] = useState<boolean>(false)

  const handleGetCorpusType = useCallback(() => {
    // Ignore is used to make sure that only the latest request's response
    // updates the state & to prevent outdated responses from overwriting newer
    // data, thus avoiding race conditions.
    let ignore = false
    if (id) {
      setLoading(true)

      getCorpusType(id)
        .then(({ response }) => {
          if (!ignore) setCorpusType(response.data)
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

  const reload = () => {
    handleGetCorpusType()
  }

  useEffect(() => {
    if (id) {
      setLoading(true)
      handleGetCorpusType()
    }
  }, [id, handleGetCorpusType])

  return { corpusType, error, loading, reload }
}

export default useCorpusType
