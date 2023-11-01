import { jwtDecode } from 'jwt-decode'
import { IDecodedToken } from '@/interfaces/Auth'

export function decodeToken(token: string): IDecodedToken | null {
  try {
    const decoded = jwtDecode<IDecodedToken>(token) as IDecodedToken
    return decoded
  } catch (err) {
    return null
  }
}
