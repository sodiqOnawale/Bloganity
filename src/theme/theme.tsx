import { useTheme as useCustomTheme } from '../context/ThemeContext';
import { ThemeProvider, CssBaseline, createTheme } from '@mui/material';

export const MaterialThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme } = useCustomTheme();
    
  const muiTheme = createTheme({
    palette: {
      mode: theme,
      ...(theme === 'light' 
        ? {
          primary: {
            main: '#0D1B2A',
            light: '#1B3A4B',
            dark: '#051118',
            contrastText: '#FFFFFF',
          },
          secondary: {
            main: '#E07A5F',
            light: '#F2A990',
            dark: '#C55D42',
            contrastText: '#FFFFFF',
          },
          background: {
            default: '#FDFBF7',
            paper: '#FFFFFF',
          },
          text: {
            primary: '#1A1A2E',
            secondary: '#4A4A68',
          },
          divider: 'rgba(13, 27, 42, 0.12)',
        }
        : {
          primary: {
            main: '#81B29A',
            light: '#A8D4BE',
            dark: '#5A8F72',
            contrastText: '#0D1B2A',
          },
          secondary: {
            main: '#E07A5F',
            light: '#F2A990',
            dark: '#C55D42',
            contrastText: '#0D1B2A',
          },
          background: {
            default: '#0D1B2A',
            paper: '#1B2838',
          },
          text: {
            primary: '#F4F3EE',
            secondary: '#B8C0CC',
          },
          divider: 'rgba(244, 243, 238, 0.12)',
        }
      ),
    },
    typography: {
      fontFamily: '"DM Sans", "Segoe UI", sans-serif',
      h1: {
        fontFamily: '"Playfair Display", Georgia, serif',
        fontWeight: 700,
        letterSpacing: '-0.02em',
      },
      h2: {
        fontFamily: '"Playfair Display", Georgia, serif',
        fontWeight: 700,
        letterSpacing: '-0.01em',
      },
      h3: {
        fontFamily: '"Playfair Display", Georgia, serif',
        fontWeight: 600,
      },
      h4: {
        fontFamily: '"Playfair Display", Georgia, serif',
        fontWeight: 600,
      },
      h5: {
        fontFamily: '"DM Sans", sans-serif',
        fontWeight: 600,
      },
      h6: {
        fontFamily: '"DM Sans", sans-serif',
        fontWeight: 600,
      },
      body1: {
        fontSize: '1rem',
        lineHeight: 1.7,
        letterSpacing: '0.01em',
      },
      body2: {
        fontSize: '0.875rem',
        lineHeight: 1.6,
      },
      button: {
        fontWeight: 600,
        letterSpacing: '0.02em',
      },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: 8,
            padding: '10px 24px',
            fontWeight: 600,
            boxShadow: 'none',
            '&:hover': {
              boxShadow: 'none',
            },
          },
          contained: {
            '&:hover': {
              transform: 'translateY(-1px)',
              transition: 'transform 0.2s ease',
            },
          },
          outlined: {
            borderWidth: '2px',
            '&:hover': {
              borderWidth: '2px',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            boxShadow: theme === 'light' 
              ? '0 4px 20px rgba(13, 27, 42, 0.08)' 
              : '0 4px 20px rgba(0, 0, 0, 0.3)',
            border: theme === 'light' 
              ? '1px solid rgba(13, 27, 42, 0.06)' 
              : '1px solid rgba(255, 255, 255, 0.06)',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: theme === 'light'
                ? '0 12px 40px rgba(13, 27, 42, 0.12)'
                : '0 12px 40px rgba(0, 0, 0, 0.4)',
            },
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 10,
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: theme === 'light' ? '#0D1B2A' : '#81B29A',
              },
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            fontWeight: 500,
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            boxShadow: 'none',
            borderBottom: theme === 'light' 
              ? '1px solid rgba(13, 27, 42, 0.08)' 
              : '1px solid rgba(255, 255, 255, 0.08)',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
    },
  });
  
  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};