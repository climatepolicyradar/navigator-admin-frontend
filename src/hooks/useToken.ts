import { IDecodedToken } from '@/interfaces'
import { decodeToken } from '@/utils/decodeToken'

import { useAuth } from './useAuth'

const useToken = (): IDecodedToken | null => {
  const { token } = useAuth()
  return token ? decodeToken(token) : null
}

export default useToken
