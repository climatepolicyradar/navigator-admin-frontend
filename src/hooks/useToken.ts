import { useMemo } from 'react'
import { IDecodedToken } from '@/interfaces'
import { decodeToken } from '@/utils/decodeToken'
import { useAuth } from './useAuth'

const useToken = (): IDecodedToken | null => {
  const { token } = useAuth()
  return useMemo(() => (token ? decodeToken(token) : null), [token])
}

export default useToken
