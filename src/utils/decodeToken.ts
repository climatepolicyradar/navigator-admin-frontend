import { jwtDecode } from 'jwt-decode'

import { IDecodedToken } from '@/interfaces/Auth'

export function decodeToken(token: string): IDecodedToken | null {
  try {
    const decoded = jwtDecode<IDecodedToken>(token)
    return decoded
  } catch (err) {
    return null
  }
}
