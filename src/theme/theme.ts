import { extendTheme } from '@chakra-ui/react'
import { inputTheme, textareaTheme } from './Form'

const theme = extendTheme({
  components: {
    Input: inputTheme,
    Textarea: textareaTheme,
  },
})

export default theme
