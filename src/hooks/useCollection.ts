import { useState, useEffect } from 'react'

import { getCollection } from '@/api/Collections'
import { IError, ICollection } from '@/interfaces'

const useCollection = (id?: string) => {
  const [collection, setCollection] = useState<ICollection | null>(null)
  const [error, setError] = useState<IError | null | undefined>()
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    let ignore = false
    if (id) {
      setLoading(true)

      getCollection(id)
        .then(({ response }) => {
          if (!ignore) setCollection(response.data)
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

  return { collection, error, loading }
}

export default useCollection
