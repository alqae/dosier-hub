
import { extendTheme } from '@mui/joy/styles'


// declare module '@mui/joy/styles' {
//   // No custom tokens found, you can skip the theme augmentation.
// }

const theme = extendTheme({
  cssVarPrefix: 'ds',
  components: {
    JoySheet: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: theme.palette.background.body,
        }),
      }
    },
  },
  colorSchemes: {
    dark: {
      palette: {
        primary: {
          50: "#fff7ed",
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#f97316",
          600: "#ea580c",
          700: "#c2410c",
          800: "#9a3412",
          900: "#7c2d12"
        }
      }
    },
  }
})
  
export default theme
