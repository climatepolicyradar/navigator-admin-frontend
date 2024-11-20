import { useState, useEffect, useCallback } from 'react'

import { IError, ICorpus } from '@/interfaces'
import { getCorpora } from '@/api/Corpora'

const useCorpora = (id: string) => {
  const [corpora, setCorpora] = useState<ICorpus[]>([])
  const [error, setError] = useState<IError | null | undefined>()
  const [loading, setLoading] = useState<boolean>(false)

  const handleGetCorpora = useCallback(() => {
    setLoading(true)
    setError(null)

    getCorpora(id)
      .then(({ response }) => {
        setCorpora(response)
      })
      .catch((error: IError) => {
        setError(error)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [id])

  const reload = () => {
    handleGetCorpora()
  }

  useEffect(() => {
    setLoading(true)
    handleGetCorpora()
  }, [handleGetCorpora])

  return { corpora, error, loading, reload }
}

export default useCorpora
