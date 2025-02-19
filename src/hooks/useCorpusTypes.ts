import { useState, useEffect, useCallback } from 'react'

import { getCorpusTypes } from '@/api/CorpusTypes'
import { IError } from '@/interfaces'
import { ICorpusType } from '@/interfaces/CorpusType'

const useCorpusTypes = () => {
  const [corpusTypes, setCorpusTypes] = useState<ICorpusType[]>([])
  const [error, setError] = useState<IError | null | undefined>()
  const [loading, setLoading] = useState<boolean>(false)

  const handleGetCorpusTypes = useCallback(() => {
    setLoading(true)
    setError(null)

    getCorpusTypes()
      .then(({ response }) => {
        setCorpusTypes(response)
      })
      .catch((error: IError) => {
        setError(error)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const reload = () => {
    handleGetCorpusTypes()
  }

  useEffect(() => {
    setLoading(true)
    handleGetCorpusTypes()
  }, [handleGetCorpusTypes])

  return { corpusTypes, error, loading, reload }
}

export default useCorpusTypes
