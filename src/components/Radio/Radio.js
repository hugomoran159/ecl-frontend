import { radioAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';
import "./Radio.css";


const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(radioAnatomy.keys);

// define the base component styles
const baseStyle = definePartsStyle({
  // define the part you're going to style
  control: {

    borderColor: '#000',
    
  

    _hover: {
        borderColor: "#fff",

  },

    _checked: {
      backgroundColor: "#000",
      color: "#000",
      borderColor: "#fff",

      _hover: {
        bg: "#000",
        borderColor: "#fff",
        color: "#000",
      }
    }
},

  label: {
    fontFamily: "customFont",
    color: "#000",

    _hover: {
        color: "#000",
    },

  }

});

const sizes = {
  // define custom styles for xl size
  xl: definePartsStyle({
    control: { w: "6", h: "6" },
    label: { fontSize: "xl" }
  })
};


// define custom variant
const variants = {
  groove: definePartsStyle({
    control: {
      borderRadius: 0,
      borderWidth: "2px",
      borderStyle: "solid",
      borderColor: "purple.500",
      background: "purple.500",

      _checked: {
        background: "purple.500",
        borderColor: "purple.500",

        _hover: {
          bg: "purple.700",
          borderColor: "purple.700"
        }
      },
      _dark: {
        borderColor: "purple.200",
        

        _hover: {
          bg: "purple.400",
          borderColor: "purple.400"
        }
      },
      _hover: {
        bg: "purple.700",
        borderColor: "purple.700"
      }
    }
  })
};

// export the component theme
export const radioTheme = defineMultiStyleConfig({
  baseStyle,
  sizes,
  variants,
});