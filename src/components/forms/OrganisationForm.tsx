import { useEffect, useState, useCallback } from 'react'
import { useForm, SubmitHandler, SubmitErrorHandler } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { IError } from '@/interfaces'
import { VStack, Button, ButtonGroup, useToast } from '@chakra-ui/react'
import { ApiError } from '../feedback/ApiError'
import { TextField } from './fields/TextField'
import * as Yup from 'yup'
import { IOrganisation, IOrganisationFormPost } from '@/interfaces/Organisation'
import { organisationSchema } from '@/schemas/organisationSchema'
import { useNavigate } from 'react-router-dom'
import { createOrganisation, updateOrganisation } from '@/api/Organisations'

type TProps = {
  organisation?: IOrganisation
}

export type IOrganisationForm = Yup.InferType<typeof organisationSchema>

export const OrganisationForm = ({ organisation: loadedOrg }: TProps) => {
  const navigate = useNavigate()
  const toast = useToast()
  const [formError, setFormError] = useState<IError | null | undefined>()
  const {
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting },
  } = useForm<IOrganisationForm>({
    resolver: yupResolver(organisationSchema),
    context: {
      isNewOrg: loadedOrg ? false : true,
    },
  })

  const handleFormSubmission = async (organisation: IOrganisationForm) => {
    setFormError(null)

    const organisationData: IOrganisationFormPost = {
      internal_name: organisation.internal_name,
      display_name: organisation.display_name ?? '',
      description: organisation.description,
      type: organisation.type,
      attribution_url: organisation.attribution_url
        ? organisation.attribution_url
        : null,
    }

    if (loadedOrg) {
      return await updateOrganisation(organisationData, loadedOrg.id)
        .then(() => {
          toast.closeAll()
          toast({
            title: 'Organisation has been successfully updated',
            status: 'success',
            position: 'top',
          })
        })
        .catch((error: IError) => {
          setFormError(error)
          toast({
            title: 'Organisation has not been updated',
            description: error.message,
            status: 'error',
            position: 'top',
          })
        })
    }
    return await createOrganisation(organisationData)
      .then((data) => {
        toast.closeAll()
        toast({
          title: 'Organisation has been successfully created',
          status: 'success',
          position: 'top',
        })
        navigate(`/organisation/${data.response.data}/edit`, { replace: true })
      })
      .catch((error: IError) => {
        setFormError(error)
        toast({
          title: 'Collection has not been created',
          description: error.message,
          status: 'error',
          position: 'top',
        })
      })
  }

  const onSubmit: SubmitHandler<IOrganisationForm> = (data) => {
    handleFormSubmission(data).catch((error: IError) => {
      console.error(error)
    })
  }

  const onSubmitErrorHandler: SubmitErrorHandler<IOrganisationForm> =
    useCallback((errors) => {
      console.error(errors)
    }, [])

  useEffect(() => {
    if (loadedOrg) {
      reset({
        internal_name: loadedOrg?.internal_name || '',
        type: loadedOrg?.type || '',
        display_name: loadedOrg?.display_name || '',
        description: loadedOrg?.description || '',
        attribution_url: loadedOrg?.attribution_url || '',
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
            isRequired={true}
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

          <TextField
            name='attribution_url'
            label='Attribution Link'
            control={control}
            isRequired={false}
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
