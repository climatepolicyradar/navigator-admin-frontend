import { inputAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers, defineStyle } from '@chakra-ui/react'

const { defineMultiStyleConfig } = createMultiStyleConfigHelpers(
  inputAnatomy.keys,
)

export const inputTheme = defineMultiStyleConfig({
  defaultProps: {
    size: 'sm',
  },
})

export const textareaTheme = defineStyle({
  defaultProps: {
    size: 'sm',
  },
})
