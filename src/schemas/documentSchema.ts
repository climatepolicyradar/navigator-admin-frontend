import * as yup from 'yup'

export const documentSchema = yup
  .object({
    family_import_id: yup.string().required(),
    variant_name: yup.string().optional(),
    role: yup.string().required(),
    type: yup.string().required(),
    title: yup.string().required(),
    source_url: yup.string().required(),
    user_language_name: yup.string().required(),
    // TODO: update this if we use the react-chakra-select
    // user_language_name: yup
    //   .object<{ label: string; value: string }>({
    //     label: yup.string().required(),
    //     value: yup.string().required(),
    //   })
    //   .required(),
  })
  .required()
