import { VStack, Button, ButtonGroup, useToast } from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import { useEffect, useState, useCallback } from 'react'
import { useForm, SubmitHandler, SubmitErrorHandler } from 'react-hook-form'
import * as Yup from 'yup'

import { IError } from '@/interfaces'
import { IOrganisation } from '@/interfaces/Organisation'
import { organisationSchema } from '@/schemas/organisationSchema'

import { ApiError } from '../feedback/ApiError'
import { TextField } from './fields/TextField'

type TProps = {
  organisation?: IOrganisation
}

export type IOrgFormSubmit = Yup.InferType<typeof organisationSchema>

export const OrganisationForm = ({ organisation: loadedOrg }: TProps) => {
  const toast = useToast()
  const [formError, setFormError] = useState<IError | null | undefined>()
  const {
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting },
  } = useForm<IOrgFormSubmit>({
    resolver: yupResolver(organisationSchema),
    context: {
      isNewOrg: loadedOrg ? false : true,
    },
  })

  const handleFormSubmission = useCallback(
    // TODO: Remove under APP-54.
    /* trunk-ignore(eslint/@typescript-eslint/require-await) */
    async (formValues: IOrgFormSubmit) => {
      setFormError(null)
      console.debug(formValues)

      if (loadedOrg) {
        toast({
          title: 'Not implemented',
          description: 'Organisation update has not been implemented',
          status: 'error',
          position: 'top',
        })
      } else {
        toast({
          title: 'Not implemented',
          description: 'Organisation create has not been implemented',
          status: 'error',
          position: 'top',
        })
      }
    },
    [loadedOrg, toast, setFormError],
  )

  const onSubmit: SubmitHandler<IOrgFormSubmit> = useCallback(
    (data) => {
      handleFormSubmission(data).catch((error: IError) => {
        console.error(error)
      })
    },
    [handleFormSubmission],
  )

  const onSubmitErrorHandler: SubmitErrorHandler<IOrgFormSubmit> = useCallback(
    (errors) => {
      console.error(errors)
    },
    [],
  )

  useEffect(() => {
    if (loadedOrg) {
      reset({
        internal_name: loadedOrg?.internal_name || '',
        type: loadedOrg?.type || '',
        display_name: loadedOrg?.display_name || '',
        description: loadedOrg?.description || '',
      })
    }
  }, [loadedOrg, reset])

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit, onSubmitErrorHandler)}>
        <VStack gap='4' mb={12} align={'stretch'}>
          {formError && <ApiError error={formError} />}

          <TextField
            name='internal_name'
            label='Shorthand'
            control={control}
            isRequired={true}
            showHelperText={loadedOrg ? true : false}
            isDisabled={loadedOrg ? true : false}
          />

          <TextField
            name='display_name'
            label='Display Name'
            control={control}
            isRequired={loadedOrg ? true : false}
          />

          <TextField
            name='description'
            label='Description'
            control={control}
            isRequired={true}
          />

          <TextField
            name='type'
            label='Organisation Type'
            control={control}
            isRequired={true}
          />

          <ButtonGroup>
            <Button type='submit' colorScheme='blue' disabled={isSubmitting}>
              {(loadedOrg ? 'Update ' : 'Create new ') + 'Organisation'}
            </Button>
          </ButtonGroup>
        </VStack>
      </form>
    </>
  )
}
