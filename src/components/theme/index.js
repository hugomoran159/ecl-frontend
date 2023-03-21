import { extendTheme } from '@chakra-ui/react';
import { radioTheme } from '../radiobuttonstyle';

const theme = extendTheme({
  components: {
    Radio: radioTheme,
  },
});

export default theme;