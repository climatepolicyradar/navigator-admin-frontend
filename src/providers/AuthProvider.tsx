import { createContext, useEffect, useMemo, useState } from 'react'
import axios from 'axios'

import { fakeAuth } from '@/api/Auth'

interface IAuthContext {
  token: string | null
  setToken: (newToken: string) => void
  // onLogin: () => void
  // onLogout: () => void
}

interface IAuthProviderProps {
  children: React.ReactNode
}

export const AuthContext = createContext<IAuthContext>({
  token: '',
  setToken: () => null,
  // onLogin: () => null,
  // onLogout: () => null,
})

const AuthProvider = ({ children }: IAuthProviderProps) => {
  const [token, setTokenState] = useState<string | null>(
    localStorage.getItem('token'),
  )

  const setToken = (newToken: string) => {
    setTokenState(newToken)
  }

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + token
      localStorage.setItem('token', token)
    } else {
      delete axios.defaults.headers.common['Authorization']
      localStorage.removeItem('token')
    }
  }, [token])

  const contextValue = useMemo(
    () => ({
      token,
      setToken,
    }),
    [token],
  )

  // const handleLogin = async () => {
  //   const token = await fakeAuth()

  //   setTokenState(token)
  // }

  // const handleLogout = () => {
  //   setTokenState(null)
  // }

  // const value = {
  //   token,
  //   onLogin: handleLogin,
  //   onLogout: handleLogout,
  // }

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  )
}

export default AuthProvider
