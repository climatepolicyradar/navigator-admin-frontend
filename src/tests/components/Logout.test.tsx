import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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
  })

  afterEach(() => {
    // Clean up after each test
  })

  it('signs out with a single click', async () => {
    // Arrange
    const user = userEvent.setup()
    render(
      <BrowserRouter>
        <AuthContext.Provider value={mockAuthContext}>
          <Logout />
        </AuthContext.Provider>
      </BrowserRouter>,
    )

    // Act
    const signOutButton = screen.getByRole('button', { name: /sign out/i })
    await user.click(signOutButton)

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

    // Act & Assert
    const signOutButton = screen.queryByRole('button', { name: /sign out/i })
    expect(signOutButton).not.toBeInTheDocument()
  })
})
