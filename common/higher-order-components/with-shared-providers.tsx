import { GlobalStyles } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { SnackbarProvider } from 'notistack';
import { BrowserRouter } from 'react-router-dom';
import { globalStyle } from '../../config/theme/globalStyle';
import { theme } from '../../config/theme/theme';

const MAX_NUMBER_OF_STACKED_TOAST_MESSAGES = 5;
export const MODAL_CONTAINER_ID = 'cc-modal-container';

export const withSharedProviders = (Component: any) => {
  const Wrapper = (props: any) => {
    return (
      <SnackbarProvider maxSnack={MAX_NUMBER_OF_STACKED_TOAST_MESSAGES}>
        <BrowserRouter>
          <ThemeProvider theme={theme}>
            <GlobalStyles styles={globalStyle} />
            <Component {...props} />
            <div id={MODAL_CONTAINER_ID} />
          </ThemeProvider>
        </BrowserRouter>
      </SnackbarProvider>
    );
  };

  return Wrapper;
};
