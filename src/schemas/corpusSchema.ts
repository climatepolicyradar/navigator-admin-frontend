import * as yup from 'yup'

export const corpusSchema = yup
  .object({
    import_id: yup.string().when('$isNewCorpus', {
      is: false,
      then: (schema) => schema.required(),
      otherwise: (schema) => schema.notRequired(),
    }),
    // .nullable(),
    import_id_part1: yup
      .object({
        label: yup.string().when('$isNewCorpus', {
          is: true,
          then: (schema) => schema.required(),
          otherwise: (schema) => schema.notRequired(),
        }),
        value: yup.string().when('$isNewCorpus', {
          is: true,
          then: (schema) => schema.required(),
          otherwise: (schema) => schema.notRequired(),
        }),
      })
      .nullable(), // This allows the box to be cleared when the user changes the organisation.
    // .test('is-not-null', 'import_id_part1 is required', function (value) {
    //   const { path, createError } = this
    //   // Check if the value is null when the form is being submitted & throw if so.
    //   if (this.parent.isNewCorpus && value === null) {
    //     return createError({ path, message: 'import_id_part1 is required' })
    //   }
    //   return true
    // }),
    import_id_part2: yup.string().when('$isNewCorpus', {
      is: true,
      then: (schema) => schema.required(),
      otherwise: (schema) => schema.notRequired(),
    }),
    import_id_part3: yup.string().when('$isNewCorpus', {
      is: true,
      then: (schema) => schema.required(),
      otherwise: (schema) => schema.notRequired(),
    }),
    import_id_part4: yup.string().when('$isNewCorpus', {
      is: true,
      then: (schema) => schema.required(),
      otherwise: (schema) => schema.notRequired(),
    }),
    title: yup.string().required(),
    description: yup.string().required(),
    corpus_text: yup.string().nullable(),
    corpus_image_url: yup.string().nullable(),
    corpus_type_name: yup.object({
      label: yup.string().required(),
      value: yup.string().required(),
    }),
    corpus_type_description: yup.string().required(),
    organisation_id: yup.object({
      label: yup.string().required(),
      value: yup.number().required(),
    }),
  })
  .required()
