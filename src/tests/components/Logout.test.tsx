import { render, screen, fireEvent } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import Logout from '@/components/Logout'
import { AuthContext } from '@/providers/AuthProvider'

// Mock the navigate function
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

describe('Logout Component', () => {
  const mockLogout = vi.fn()
  const mockSetToken = vi.fn()
  const mockLogin = vi.fn()
  const mockToken = 'test-token'

  const mockAuthContext = {
    token: mockToken,
    setToken: mockSetToken,
    login: mockLogin,
    logout: mockLogout,
  }

  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks()
    // Reset timers before each test
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('signs out with a single click', () => {
    // Arrange
    render(
      <BrowserRouter>
        <AuthContext.Provider value={mockAuthContext}>
          <Logout />
        </AuthContext.Provider>
      </BrowserRouter>,
    )

    // Act
    const signOutButton = screen.getByRole('button', { name: /sign out/i })
    fireEvent.click(signOutButton)
    vi.runAllTimers()

    // Assert
    expect(mockLogout).toHaveBeenCalledTimes(1)
    expect(mockNavigate).toHaveBeenCalledTimes(1)
    expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true })
  })

  it('does not show sign out button when not logged in', () => {
    // Arrange
    render(
      <BrowserRouter>
        <AuthContext.Provider value={{ ...mockAuthContext, token: null }}>
          <Logout />
        </AuthContext.Provider>
      </BrowserRouter>,
    )

    // Assert
    const signOutButton = screen.queryByRole('button', { name: /sign out/i })
    expect(signOutButton).not.toBeInTheDocument()
  })
})
