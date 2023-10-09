import { useState, useEffect } from 'react'

import { IError, IConfig } from '@/interfaces'
import { getConfig } from '@/api/Config'

const useConfig = () => {
  const [config, setConfig] = useState<IConfig | null>(null)
  const [error, setError] = useState<IError | null | undefined>()
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    let ignore = false
    setLoading(true)

    getConfig()
      .then(({ response }) => {
        if (!ignore) setConfig(response)
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
