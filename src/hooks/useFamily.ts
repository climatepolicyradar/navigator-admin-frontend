import { useState, useEffect } from 'react'

import { IError, TFamily } from '@/interfaces'
import { getFamily } from '@/api/Families'

const useFamily = (id?: string) => {
  const [family, setFamily] = useState<TFamily | null>(null)
  const [error, setError] = useState<IError | null | undefined>()
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    let ignore = false
    if (id) {
      setLoading(true)

      getFamily(id)
        .then(({ response }) => {
          if (!ignore) setFamily(response.data)
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

  return { family, error, loading }
}

export default useFamily
