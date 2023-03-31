import { extendTheme } from '@chakra-ui/react';
import { radioTheme } from './Radio';

export const theme = extendTheme({
  components: {
    Radio: radioTheme,
  },
});


