import { useState, useEffect } from 'react'

import { getConfig } from '@/api/Config'
import { IError, IConfig } from '@/interfaces'
import { modifyConfig } from '@/utils/modifyConfig'

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
          cache = modifyConfig(response)
          setConfig(cache)
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
