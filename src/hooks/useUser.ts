import { useCallback, useEffect, useState } from 'react'

import { getUser } from '@/api/Users'
import { IError } from '@/interfaces'
import { IUser } from '@/interfaces/User'

const useUser = (email?: string) => {
  const [user, setUser] = useState<IUser>()
  const [error, setError] = useState<IError>()
  const [loading, setLoading] = useState<boolean>(false)

  const handleGetUser = useCallback(() => {
    let ignore = false
    if (email) {
      setLoading(true)

      getUser(email)
        .then(({ response }) => {
          if (!ignore) setUser(response.data)
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
  }, [email])

  const reload = () => {
    handleGetUser()
  }

  useEffect(() => {
    if (email) {
      setLoading(true)
      handleGetUser()
    }
  }, [email, handleGetUser])

  return { user, error, loading, reload }
}

export default useUser
