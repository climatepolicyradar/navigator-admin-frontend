import useToken from './useToken'

const useIsSuperUser = (): boolean => {
  const token = useToken()
  return token?.is_superuser ?? false
}

export default useIsSuperUser
