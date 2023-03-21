import { radioAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(radioAnatomy.keys)

const baseStyle = definePartsStyle({
    // define the part you're going to style
    control: {
      borderRadius: '12px', // change the border radius
      borderColor: 'teal.500', // change the border color
    },
  })

  export const radioTheme = defineMultiStyleConfig({ baseStyle })