import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { IError } from '@/interfaces'

import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Button,
  Heading,
  FormErrorMessage,
  Text,
} from '@chakra-ui/react'

export const LoginForm = () => {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [formError, setFormError] = useState<IError | null | undefined>()
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async () => {
    setFormError(null)
    setEmailError('')
    setPasswordError('')
    setIsLoading(true)

    if (email === '') {
      setEmailError('Please enter your email address')
    }
    if (password === '') {
      setPasswordError('Please enter your password')
    }
    if (email === '' || password === '') {
      return setIsLoading(false)
    }

    if (login) {
      await login({
        username: email,
        password: password,
      })
        .then((returnTo) => {
          // TODO: set up return to page after login if provided
          // console.log(returnTo)
          navigate('/', { replace: true })
        })
        .catch((error: IError) => {
          setFormError(error)
          setIsLoading(false)
        })
    }
  }

  useEffect(() => {
    if (email !== '') {
      setEmailError('')
    }
  }, [email])

  useEffect(() => {
    if (password !== '') {
      setPasswordError('')
    }
  }, [password])

  return (
    <Flex minH={'100vh'} align={'center'} justify={'center'} bg={'gray.50'}>
      <Stack
        spacing={8}
        mx={'auto'}
        maxW={'lg'}
        py={12}
        px={6}
        w={'50%'}
        minW={'400px'}
      >
        <Stack align={'center'}>
          <Heading fontSize={'4xl'}>Log in</Heading>
        </Stack>
        <Box rounded={'lg'} bg={'white'} boxShadow={'lg'} p={8}>
          {formError && (
            <Box mb={4}>
              <Text color={'red.500'}>{formError.message}</Text>
              <Text fontSize="xs" color={'gray.500'} mb={4}>
                {formError.detail}
              </Text>
            </Box>
          )}
          <Stack spacing={4}>
            <FormControl
              id="email"
              isRequired
              isInvalid={emailError !== ''}
              isDisabled={isLoading}
            >
              <FormLabel>Email address</FormLabel>
              <Input type="email" onChange={(e) => setEmail(e.target.value)} />
              <FormErrorMessage>{emailError}</FormErrorMessage>
            </FormControl>
            <FormControl
              id="password"
              isRequired
              isInvalid={passwordError !== ''}
              isDisabled={isLoading}
            >
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <FormErrorMessage>{passwordError}</FormErrorMessage>
            </FormControl>
            <Stack spacing={10}>
              <Button
                bg={'blue.400'}
                color={'white'}
                _hover={{
                  bg: 'blue.500',
                }}
                onClick={() => void handleLogin()}
                isDisabled={isLoading}
              >
                Sign in
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  )
}
