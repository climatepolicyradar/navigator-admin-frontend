import { useState, useEffect, useRef } from 'react'

import { IError, IConfig } from '@/interfaces'
import { getConfig } from '@/api/Config'

let cache: IConfig | null = null

const useConfig = () => {
  const [config, setConfig] = useState<IConfig | null>(null)
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

    getConfig()
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

  return { config, error, loading }
}

export default useConfig
