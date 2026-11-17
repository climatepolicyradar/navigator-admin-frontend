import { renderHook } from '@testing-library/react'
import AuthProvider from '@/providers/AuthProvider'
import useIsSuperUser from '@/hooks/useIsSuperUser'
import { setupUser } from '@/tests/helpers'

const renderUseIsSuperUser = () =>
  renderHook(() => useIsSuperUser(), {
    wrapper: ({ children }) => <AuthProvider>{children}</AuthProvider>,
  })

describe('useIsSuperUser', () => {
  afterEach(() => setupUser())

  it('returns true when the token belongs to a superuser', () => {
    setupUser({ isSuperuser: true })
    const { result } = renderUseIsSuperUser()
    expect(result.current).toBe(true)
  })

  it('returns false when the token belongs to a non-superuser', () => {
    setupUser({ isSuperuser: false })
    const { result } = renderUseIsSuperUser()
    expect(result.current).toBe(false)
  })

  it('returns false when there is no token', () => {
    localStorage.removeItem('token')
    const { result } = renderUseIsSuperUser()
    expect(result.current).toBe(false)
  })

  it('returns false when the token cannot be decoded', () => {
    localStorage.setItem('token', 'not-a-jwt')
    const { result } = renderUseIsSuperUser()
    expect(result.current).toBe(false)
  })
})
