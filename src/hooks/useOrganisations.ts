import { useCallback, useEffect, useState } from 'react'

import { getOrganisations } from '@/api/Organisations'
import { IError } from '@/interfaces'
import { IOrganisation } from '@/interfaces/Organisation'

const useOrganisations = () => {
  const [organisations, setOrganisations] = useState<IOrganisation[]>([])
  const [error, setError] = useState<IError | null | undefined>()
  const [loading, setLoading] = useState<boolean>(false)

  const handleGetOrganisations = useCallback(() => {
    setLoading(true)
    setError(null)

    getOrganisations()
      .then(({ response }) => {
        setOrganisations(response)
      })
      .catch((error: IError) => {
        setError(error)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const reload = () => {
    handleGetOrganisations()
  }

  useEffect(() => {
    setLoading(true)
    handleGetOrganisations()
  }, [handleGetOrganisations])

  return { organisations, error, loading, reload }
}

export default useOrganisations
