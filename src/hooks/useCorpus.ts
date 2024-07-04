import { useState, useEffect } from 'react'

import { IError, ICorpus } from '@/interfaces'
import { getCorpus } from '@/api/Corpora'

const useCorpus = (id?: string) => {
  const [corpus, setCorpus] = useState<ICorpus | null>(null)
  const [error, setError] = useState<IError | null | undefined>()
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
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

  return { corpus, error, loading }
}

export default useCorpus
