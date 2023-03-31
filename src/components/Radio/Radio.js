import { radioAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';
import "./Radio.css";


const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(radioAnatomy.keys);

// define the base component styles
const baseStyle = definePartsStyle({
  // define the part you're going to style
  control: {
    
    _checked: {
        bg: "#5E7564",
        borderColor: "#5E7564",

        _hover: {
            bg: "#5E7564",
            borderColor: "#5E7564",
        },
    },

    _hover: {
        borderColor: "#fff",
  }
},

  label: {
    fontFamily: "customFont",
    color: "#eaeaea",

    _hover: {
        color: "#fff",
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