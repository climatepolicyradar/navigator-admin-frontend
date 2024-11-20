import { useState, useEffect, useCallback } from 'react'

import { IError, ICorpus } from '@/interfaces'
import { getCorpus } from '@/api/Corpora'

const useCorpus = (id?: string) => {
  const [corpus, setCorpus] = useState<ICorpus>()
  const [error, setError] = useState<IError | null | undefined>()
  const [loading, setLoading] = useState<boolean>(false)

  const handleGetCorpus = useCallback(() => {
    let ignore = false
    if (id) {
      setLoading(true)

      getCorpus(id)
        .then(({ response }) => {
          if (!ignore) setCorpus(response.data)
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
    handleGetCorpus()
  }

  useEffect(() => {
    if (id) {
      setLoading(true)
      handleGetCorpus()
    }
  }, [handleGetCorpus])

  return { corpus, error, loading, reload }
}

export default useCorpus
