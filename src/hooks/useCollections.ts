import { useState, useEffect } from 'react'

import { IError, ICollection } from '@/interfaces'
import { getCollections } from '@/api/Collections'

const useCollections = (query: string) => {
  const [collections, setCollections] = useState<ICollection[]>([])
  const [error, setError] = useState<IError | null | undefined>()
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    let ignore = false
    setLoading(true)

    getCollections(query)
      .then(({ response }) => {
        if (!ignore) setCollections(response)
      })
      .catch((error: IError) => {
        setError(error)
      })
      .finally(() => {
        setLoading(false)
      })

    return () => {
      ignore = true
    }
  }, [query])

  return { collections, error, loading }
}

export default useCollections
