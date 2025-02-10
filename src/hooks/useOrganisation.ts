import { useCallback, useEffect, useState } from 'react'

import { getOrganisation } from '@/api/Organisations'
import { IError } from '@/interfaces'
import { IOrganisation } from '@/interfaces/Organisation'

const useOrganisation = (id?: string) => {
  const [organisation, setOrganisation] = useState<IOrganisation>()
  const [error, setError] = useState<IError>()
  const [loading, setLoading] = useState<boolean>(false)

  const handleGetOrganisation = useCallback(() => {
    // Ignore is used to make sure that only the latest request's response
    // updates the state & to prevent outdated responses from overwriting newer
    // data, thus avoiding race conditions.
    let ignore = false
    if (id) {
      setLoading(true)

      getOrganisation(id)
        .then(({ response }) => {
          if (!ignore) setOrganisation(response.data)
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

  const reload = () => {
    handleGetOrganisation()
  }

  useEffect(() => {
    if (id) {
      setLoading(true)
      handleGetOrganisation()
    }
  }, [id, handleGetOrganisation])

  return { organisation, error, loading, reload }
}

export default useOrganisation
