import { createContext, useEffect, useMemo, useState } from 'react'
import API from '@/api'

import { login as APILogin } from '@/api/Auth'

type TLoginParams = {
  username: string
  password: string
}

interface IAuthContext {
  token: string | null
  setToken: (newToken?: string) => void
  login: (user: TLoginParams) => Promise<void>
}

interface IAuthProviderProps {
  children: React.ReactNode
}

export const AuthContext = createContext<IAuthContext>({
  token: '',
  setToken: () => null,
  login: () => Promise.resolve(),
})

const AuthProvider = ({ children }: IAuthProviderProps) => {
  const [token, setTokenState] = useState<string | null>(
    localStorage.getItem('token'),
  )

  const setToken = (newToken?: string) => {
    setTokenState(newToken ?? null)
  }

  useEffect(() => {
    if (token) {
      API.defaults.headers.common['Authorization'] = 'Bearer ' + token
      localStorage.setItem('token', token)
    } else {
      delete API.defaults.headers.common['Authorization']
      localStorage.removeItem('token')
    }
  }, [token])

  const login = async (user: TLoginParams) => {
    const { response: token } = await APILogin(user)
    console.log(token)
    setTokenState(token)
  }

  const contextValue = useMemo(
    () => ({
      token,
      setToken,
      login,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [token],
  )

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  )
}

export default AuthProvider
