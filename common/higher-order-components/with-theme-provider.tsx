import { ThemeProvider } from '@mui/material/styles';
import { theme } from '../../config/theme/theme';

export const withThemeProvider = (Component: any) => {
  const Wrapper = (props: any) => {
    return (
      <ThemeProvider theme={theme}>
        <Component {...props} />
      </ThemeProvider>
    );
  };
  return Wrapper;
};
