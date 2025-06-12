import { useState, useEffect, useCallback } from 'react'

import { getCollections } from '@/api/Collections'
import { IError, ICollection } from '@/interfaces'

const useCollections = (query: string) => {
  const [collections, setCollections] = useState<ICollection[]>([])
  const [error, setError] = useState<IError | null | undefined>()
  const [loading, setLoading] = useState<boolean>(false)

  const handleGetCollections = useCallback(() => {
    setLoading(true)
    setError(null)

    getCollections(query)
      .then(({ response }) => {
        setCollections(response)
      })
      .catch((error: IError) => {
        setError(error)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [query])

  const reload = () => {
    handleGetCollections()
  }

  useEffect(() => {
    setLoading(true)
    handleGetCollections()
  }, [handleGetCollections])

  return { collections, error, loading, reload }
}

export default useCollections
