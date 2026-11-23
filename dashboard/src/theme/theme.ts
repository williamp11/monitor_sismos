import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: { main: '#0F2A4A' },
    secondary: { main: '#F27A1A', contrastText: '#ffffff' },
    background: { default: '#F1F4F8', paper: '#ffffff' },
    text: { primary: '#14213D', secondary: '#5B6B82' },
    success: { main: '#2E8B57' },
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h6: { fontWeight: 700 },
    subtitle1: { fontWeight: 600 },
  },
  components: {
    MuiPaper: { defaultProps: { elevation: 0 } },
    MuiCard: {
      styleOverrides: { root: { border: '1px solid #E2E8F0' } },
    },
  },
});

export function magColor(mag: number | null): string {
  if (mag === null) return '#94A3B8';
  if (mag >= 6) return '#B42318';
  if (mag >= 5) return '#E8590C';
  if (mag >= 4) return '#F59F00';
  return '#FFC078';
}