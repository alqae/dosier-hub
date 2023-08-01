
import { extendTheme } from '@mui/joy/styles'

const primary = {
  50: '#fff7ed',
  100: '#ffedd5',
  200: '#fed7aa',
  300: '#fdba74',
  400: '#fb923c',
  500: '#f97316',
  600: '#ea580c',
  700: '#c2410c',
  800: '#9a3412',
  900: '#7c2d12'
}

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
    JoyModal: {
      styleOverrides: {
        backdrop: {
          backdropFilter: 'none',
        },
      }
    },
    JoyInput: {
      defaultProps: {
        size: 'lg'
      }
    },
    JoyAutocomplete: {
      defaultProps: {
        size: 'lg'
      }
    },
    JoySelect: {
      defaultProps: {
        size: 'lg'
      }
    },
    JoyTable: {
      styleOverrides: {
        root: {
          '--TableCell-height': '40px',
          '--TableHeader-height': 'calc(1 * var(--TableCell-height))',
        }
      }
    }
  },
  colorSchemes: {
    light: {
      palette: {
        primary
      }
    },
    dark: {
      palette: {
        primary 
      }
    },
  }
})
  
export default theme
