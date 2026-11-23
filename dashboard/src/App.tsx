import { CssBaseline, ThemeProvider } from '@mui/material';
import DashboardPage from './pages/DashboardPage';
import { theme } from './theme/theme';

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <DashboardPage />
    </ThemeProvider>
  );
}