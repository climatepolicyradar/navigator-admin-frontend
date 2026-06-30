import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  useForm,
  SubmitHandler,
  SubmitErrorHandler,
  Controller,
} from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import {
  VStack,
  Button,
  ButtonGroup,
  useToast,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Checkbox,
  Switch,
  HStack,
  Text,
} from '@chakra-ui/react'
import { IError } from '@/interfaces'
import { IUser } from '@/interfaces/User'
import { ApiError } from '../feedback/ApiError'
import { TextField } from './fields/TextField'
import { updateUser } from '@/api/Users'
import useOrganisations from '@/hooks/useOrganisations'

const userSchema = Yup.object({
  name: Yup.string().nullable().default(null),
  organisations: Yup.array()
    .of(
      Yup.object({
        id: Yup.number().required(),
        is_admin: Yup.boolean().required(),
      }),
    )
    .required(),
})

export type IUserForm = Yup.InferType<typeof userSchema>

type TProps = {
  user: IUser
}

export const UserForm = ({ user }: TProps) => {
  const navigate = useNavigate()
  const toast = useToast()
  const [formError, setFormError] = useState<IError | null | undefined>()
  const { organisations } = useOrganisations()
  const originalOrgIds = new Set(user.organisations.map((o) => o.id))

  const {
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting },
  } = useForm<IUserForm>({
    resolver: yupResolver(userSchema),
  })

  useEffect(() => {
    reset({
      name: user.name ?? null,
      organisations: user.organisations.map((o) => ({
        id: o.id,
        is_admin: o.is_admin,
      })),
    })
  }, [user, reset])

  const handleFormSubmission = async (data: IUserForm) => {
    setFormError(null)
    await updateUser(user.email, {
      name: data.name ?? null,
      organisations: (data.organisations ?? []).map((o) => ({
        id: o.id,
        is_admin: o.is_admin ?? false,
      })),
    })
      .then(() => {
        toast.closeAll()
        toast({
          title: 'User has been successfully updated',
          status: 'success',
          position: 'top',
        })
        navigate('/users')
      })
      .catch((error: IError) => {
        setFormError(error)
        toast({
          title: 'User has not been updated',
          description: error.message,
          status: 'error',
          position: 'top',
        })
      })
  }

  const onSubmit: SubmitHandler<IUserForm> = (data) => {
    handleFormSubmission(data).catch(console.error)
  }

  const onSubmitErrorHandler: SubmitErrorHandler<IUserForm> = useCallback(
    (errors) => {
      console.error(errors)
    },
    [],
  )

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit, onSubmitErrorHandler)}>
        <VStack gap='4' mb={12} align='stretch'>
          {formError && <ApiError error={formError} />}

          <TextField name='name' label='Name' control={control} />

          <Controller
            name='organisations'
            control={control}
            render={({ field, fieldState: { error } }) => {
              const selected: Array<{ id: number; is_admin: boolean }> =
                field.value ?? []

              const isSelected = (orgId: number) =>
                selected.some((o) => o.id === orgId)

              const isAdmin = (orgId: number) =>
                selected.find((o) => o.id === orgId)?.is_admin ?? false

              const toggleOrg = (orgId: number) => {
                if (originalOrgIds.has(orgId)) return
                if (isSelected(orgId)) {
                  field.onChange(selected.filter((o) => o.id !== orgId))
                } else {
                  field.onChange([...selected, { id: orgId, is_admin: true }])
                }
              }

              const toggleAdmin = (orgId: number) => {
                field.onChange(
                  selected.map((o) =>
                    o.id === orgId ? { ...o, is_admin: !o.is_admin } : o,
                  ),
                )
              }

              return (
                <FormControl isInvalid={!!error}>
                  <FormLabel>Organisations</FormLabel>
                  <VStack align='stretch' gap={2}>
                    {organisations.map((org) => {
                      const locked = originalOrgIds.has(org.id)
                      return (
                        <HStack
                          key={org.id}
                          p={3}
                          bg='white'
                          borderRadius='md'
                          border='1px solid'
                          borderColor={locked ? 'blue.200' : 'gray.200'}
                        >
                          <Checkbox
                            isChecked={isSelected(org.id)}
                            onChange={() => toggleOrg(org.id)}
                            isDisabled={locked}
                          >
                            <Text>{org.display_name}</Text>
                          </Checkbox>
                          {locked && (
                            <Text fontSize='xs' color='blue.500' ml={2}>
                              original
                            </Text>
                          )}
                          {isSelected(org.id) && (
                            <HStack ml='auto'>
                              <Text fontSize='sm' color='gray.600'>
                                Admin
                              </Text>
                              <Switch
                                isChecked={isAdmin(org.id)}
                                onChange={() => toggleAdmin(org.id)}
                              />
                            </HStack>
                          )}
                        </HStack>
                      )
                    })}
                  </VStack>
                  {error && (
                    <FormErrorMessage>{error.message}</FormErrorMessage>
                  )}
                </FormControl>
              )
            }}
          />

          <ButtonGroup>
            <Button type='submit' colorScheme='blue' isLoading={isSubmitting}>
              Update User
            </Button>
          </ButtonGroup>
        </VStack>
      </form>
    </>
  )
}
