import { useState, useEffect } from 'react'

import { IError, ICollection } from '@/interfaces'
import { getCollections } from '@/api/Collections'

const useCollections = () => {
  const [collections, setCollections] = useState<ICollection[]>([])
  const [error, setError] = useState<IError | null | undefined>()
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    let ignore = false
    setLoading(true)

    getCollections()
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
  }, [])

  return { collections, error, loading }
}

export default useCollections
