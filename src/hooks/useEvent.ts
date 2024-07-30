import { useState, useEffect, useCallback } from 'react'

import { IError, IEvent } from '@/interfaces'
import { getEvent } from '@/api/Events'

const useEvent = (id?: string) => {
  const [event, setEvent] = useState<IEvent | null>(null)
  const [error, setError] = useState<IError | null | undefined>()
  const [loading, setLoading] = useState<boolean>(false)

  const handleGetEvent = useCallback(
    (ignore: boolean) => {
      setLoading(true)
      if (id) {
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
    },
    [id],
  )

  const reload = useCallback(() => {
    handleGetEvent(false)
  }, [handleGetEvent])

  useEffect(() => {
    let ignore = false
    handleGetEvent(ignore)
    return () => {
      ignore = true
    }
  }, [id, handleGetEvent])

  return { event, error, loading, reload }
}

export default useEvent
