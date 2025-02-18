import { createContext, useEffect, useMemo, useState } from 'react'
import API from '@/api'

import { login as APILogin } from '@/api/Auth'

interface ILoginParams {
  username: string
  password: string
}

interface IAuthContext {
  token: string | null
  setToken: (newToken?: string) => void
  login: (user: ILoginParams) => Promise<string | null>
  logout: (returnTo?: string | null) => void
}

interface IAuthProviderProps {
  children: React.ReactNode
}

export const AuthContext = createContext<IAuthContext>({
  token: '',
  setToken: () => null,
  login: () => Promise.resolve(''),
  logout: () => null,
})

const AuthProvider = ({ children }: IAuthProviderProps) => {
  const [token, setTokenState] = useState<string | null>(
    localStorage.getItem('token'),
  )
  const [returnTo, setReturnTo] = useState<string | null>(
    localStorage.getItem('returnTo'),
  )

  const setToken = (newToken?: string) => {
    setTokenState(newToken ?? null)
  }

  // token storage management
  useEffect(() => {
    if (token) {
      API.defaults.headers.common['Authorization'] = 'Bearer ' + token
      localStorage.setItem('token', token)
      // Dispatch custom event for token change
      window.dispatchEvent(new Event('tokenChange'))
    } else {
      delete API.defaults.headers.common['Authorization']
      localStorage.removeItem('token')
      // Dispatch custom event for token removal
      window.dispatchEvent(new Event('tokenChange'))
    }
  }, [token])

  // returnTo storage management
  useEffect(() => {
    if (returnTo) {
      localStorage.setItem('returnTo', returnTo)
    } else {
      localStorage.removeItem('returnTo')
    }
  }, [returnTo])

  const login = async (user: ILoginParams) => {
    const { response: token } = await APILogin(user)
    setTokenState(token)
    return returnTo
  }

  const logout = (returnTo?: string | null) => {
    setToken()
    setReturnTo(returnTo ?? null)
  }

  const contextValue = useMemo(
    () => ({
      token,
      logout,
      login,
      setToken,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [token],
  )

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  )
}

export default AuthProvider
