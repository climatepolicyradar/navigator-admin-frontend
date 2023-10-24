import { useState, useEffect } from 'react'

import { IError, IEvent } from '@/interfaces'
import { getEvent } from '@/api/Events'

const useEvent = (id?: string) => {
  const [event, setEvent] = useState<IEvent | null>(null)
  const [error, setError] = useState<IError | null | undefined>()
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    let ignore = false
    if (id) {
      setLoading(true)

      getEvent(id)
        .then(({ response }) => {
          if (!ignore) setEvent(response.data)
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

  return { event, error, loading }
}

export default useEvent
