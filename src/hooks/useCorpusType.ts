import { useState, useEffect, useCallback } from 'react'

import { IError } from '@/interfaces'
import { getCorpusType } from '@/api/CorpusTypes'
import { ICorpusType } from '@/interfaces/CorpusType'

const useCorpusType = (id: string) => {
  const [corpusType, setCorpusType] = useState<ICorpusType>()
  const [error, setError] = useState<IError | null | undefined>()
  const [loading, setLoading] = useState<boolean>(false)

  const handleGetCorpusType = useCallback(() => {
    setLoading(true)
    setError(null)

    getCorpusType(id)
      .then(({ response }) => {
        setCorpusType(response)
      })
      .catch((error: IError) => {
        setError(error)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [id])

  const reload = () => {
    handleGetCorpusType()
  }

  useEffect(() => {
    setLoading(true)
    handleGetCorpusType()
  }, [handleGetCorpusType])

  return { corpusType, error, loading, reload }
}

export default useCorpusType
