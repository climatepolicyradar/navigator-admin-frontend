import { useAuth } from './hooks/useAuth'

export default function Login() {
  const { token } = useAuth()

  return (
    <>
      {token && <div>Authenticated as {token}</div>}
      <button type="button" onClick={() => null}>
        Sign In
      </button>
    </>
  )
}
