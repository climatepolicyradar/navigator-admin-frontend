import { useCallback, useEffect, useState } from 'react'

import { getUsers } from '@/api/Users'
import { IError } from '@/interfaces'
import { IUser } from '@/interfaces/User'

const useUsers = () => {
  const [users, setUsers] = useState<IUser[]>([])
  const [error, setError] = useState<IError | null | undefined>()
  const [loading, setLoading] = useState<boolean>(false)

  const handleGetUsers = useCallback(() => {
    setLoading(true)
    setError(null)

    getUsers()
      .then(({ response }) => {
        setUsers(response)
      })
      .catch((error: IError) => {
        setError(error)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const reload = () => {
    handleGetUsers()
  }

  useEffect(() => {
    setLoading(true)
    handleGetUsers()
  }, [handleGetUsers])

  return { users, error, loading, reload }
}

export default useUsers
