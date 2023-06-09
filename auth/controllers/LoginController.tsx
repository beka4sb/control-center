import { Box, Button, Divider, Grid, Link, Stack, Typography } from '@mui/material';
import { t } from 'i18next';
import SbtLogoType from '../../assets/images/sbt-logotype.svg';
import SSOIcon from '../../assets/images/sso-icon.svg';
import { Loader } from '../../common/components/Loader';
import { BaseController, BaseState } from '../../common/controllers/BaseController';
import { AuthenticationError } from '../../common/errors/errors';
import { RedirectService } from '../../common/services/RedirectService';
import { Notification } from '../../common/utils/flash/Notification';
import { updateLaunchDarklyContext } from '../../config/launch-darkly/FeatureFlagsController';
import { LaunchDarklyConfigService } from '../../config/launch-darkly/LaunchDarklyConfigService';
import { PATHS } from '../../routing/routes';
import { LoginForm } from '../components/LoginForm';
import { ForgotPassword, OIDCConfig, PresetService } from '../services/PresetService';

type Props = {};

interface State extends BaseState {
  loading: boolean;
}

export class LoginController extends BaseController<Props, State> {
  private readonly redirectService: RedirectService;
  private readonly presetService: PresetService;
  private readonly launchDarklyConfigService: LaunchDarklyConfigService;

  private readonly errors: any = {};

  private forgotPassword: ForgotPassword | null;
  private oidcConfig: OIDCConfig | null;
  private ready = false;

  constructor(props: Props, context: any) {
    super(props, context);

    this.redirectService = RedirectService.getInstance();
    this.presetService = PresetService.getInstance();
    this.launchDarklyConfigService = LaunchDarklyConfigService.getInstance();

    this.forgotPassword = null;
    this.oidcConfig = null;

    // Backend app redirects to login with param `?next=` to indicate redirection.
    // We have internal redirection system, but have to cover the existing one and
    // we will prioritize having `next` over any internal redirection.
    const nextLink = this.urlHelper.getQueryParam('next');
    if (nextLink !== null) {
      this.redirectService.saveRedirection(nextLink);
    }

    if (this.authService.isLoggedIn()) {
      if (nextLink !== null) {
        // We landed on the login page because the backend redirected us.
        // The browser has cached auth data.
        // Force a logout to re-align frontend and backend sessions.
        this.handleError(new AuthenticationError({ forceLogout: true }));
        return;
      }
      // We landed on the login page because we manually navigated to it.
      // The browser has cached auth data.
      // Redirect to the home page.
      window.location.replace(`/${PATHS.HOME_PAGE}`);
      return;
    }

    this.ready = true;
  }

  getBaseState(): State {
    return { ...super.getBaseState(), loading: true };
  }

  componentDidMount() {
    super.componentDidMount();

    this.fetchPresets();
  }

  componentWillUnmount() {
    super.componentWillUnmount();

    this.presetService.cancelAllRequests();
    this.launchDarklyConfigService.cancelAllRequests();
  }

  requireAuthorization(): boolean {
    return false;
  }

  canShowMessages(): boolean {
    return this.ready && !this.state.loading;
  }

  async fetchPresets(): Promise<void> {
    try {
      const { forgotPassword, oidc } = await this.presetService.fetchPresets();
      this.forgotPassword = forgotPassword;
      this.oidcConfig = oidc;
    } catch (e: any) {
      this.handleError(e, { fallback: t('failedToFetchPresets') });
    } finally {
      this.setState({ loading: false });
    }
  }

  async handleFormSubmit(loginCredentials: any) {
    try {
      await this.authService.login(loginCredentials.username, loginCredentials.password);

      await this.launchDarklyConfigService.getContext();
      await updateLaunchDarklyContext();

      this.showMessage(t('loggedIn'), Notification.SUCCESS, true);

      // We have to do a page reload redirect since we want to establish cookie session
      // with the backend app. This can be replaced with this.redirect(nextLink) after we
      // move from the intermediary phase where we handle cookie sessions.
      this.urlHelper.apiRedirect(this.getNextLink());
    } catch (e: any) {
      this.handleError(e);
    }
  }

  getNextLink(): string {
    if (this.redirectService.hasRedirection()) {
      return this.redirectService.getRedirection();
    }
    return `/${PATHS.HOME_PAGE}`;
  }

  render() {
    if (this.state.loading) {
      // Do not use `renderBase` during the loading phase to avoid consuming existing flashes
      return <Loader open={true} />;
    }

    const { endpoint: openIdLink = '', buttonLabel: openIdButtonLabel = '' } = this.oidcConfig || {};

    return this.renderBase(
      <Grid container justifyContent="center" alignItems="center" sx={{ height: '100vh', backgroundColor: 'backdrops.light' }}>
        <Grid item xs={10} sm={8} md={6} lg={5}>
          <Stack spacing={2}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <SbtLogoType />
            </Box>

            <Typography variant="h4" sx={{ color: 'light.text.primary' }}>
              {t('signIn')}
            </Typography>

            <Typography variant="body1" sx={{ color: 'light.text.secondary' }}>
              {t('pleaseSignIntoYourAccount')}
            </Typography>

            <LoginForm errors={this.errors} onSubmit={(data) => this.handleFormSubmit(data)} />

            {this.forgotPassword && (
              <Typography variant="body1">
                <Link href={this.forgotPassword.link} underline="hover">
                  {t('forgotPassword')}
                </Link>
              </Typography>
            )}

            {this.oidcConfig !== null && (
              <>
                <Divider textAlign="center">
                  <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                    {t('or')}
                  </Typography>
                </Divider>

                <Button type="button" variant="text" href={openIdLink} fullWidth startIcon={<SSOIcon />}>
                  {openIdButtonLabel}
                </Button>
              </>
            )}
          </Stack>
        </Grid>
      </Grid>
    );
  }
}
