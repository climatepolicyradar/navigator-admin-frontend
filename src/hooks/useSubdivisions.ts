import { useState, useEffect } from 'react'

import { IError, ISubdivision } from '@/interfaces'
import { getSubdivisions } from '@/api/Subdivisions'

let cache: ISubdivision[] | null = null

const useSubdivisions = () => {
  const [subdivisions, setSubdivisions] = useState<ISubdivision[] | []>([])
  const [error, setError] = useState<IError | null | undefined>()
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    let ignore = false
    setLoading(true)

    if (cache) {
      setSubdivisions(cache)
      setLoading(false)
      return
    }

    getSubdivisions()
      .then(({ response }) => {
        if (!ignore) {
          cache = response
          setSubdivisions(cache)
        }
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

  return { subdivisions, error, loading }
}

export default useSubdivisions
