import { useState, useEffect } from 'react'

import { getSummary } from '@/api/Summary'
import { IError, ISummary } from '@/interfaces'

let cache: ISummary | null = null

const useSummary = () => {
  const [summary, setConfig] = useState<ISummary | null>(null)
  const [error, setError] = useState<IError | null | undefined>()
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    let ignore = false
    setLoading(true)

    if (cache) {
      setConfig(cache)
      setLoading(false)
      return
    }

    getSummary()
      .then(({ response }) => {
        if (!ignore) {
          cache = response
          setConfig(response)
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

  return { summary, error, loading }
}

export default useSummary
