import { IDecodedToken } from '@/interfaces'
import { decodeToken } from '@/utils/decodeToken'
import { useMemo } from 'react'

const useToken = (): IDecodedToken | null => {
  return useMemo(() => {
    const token = localStorage.getItem('token')
    if (!token) return null
    const decodedToken: IDecodedToken | null = decodeToken(token)
    return decodedToken
  }, [])
}

export default useToken
