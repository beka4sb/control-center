import { Component } from 'react';
import { Navigate } from 'react-router-dom';
import { LaunchDarklyConfigService } from '../../config/launch-darkly/LaunchDarklyConfigService';
import { PATHS } from '../../routing/routes';
import { AuthorizationService } from '../services/AuthorizationService';

type Props = {};

interface State {}

export class LogoutController extends Component<Props, State> {
  private readonly authService: AuthorizationService;
  private readonly launchDarklyConfigService: LaunchDarklyConfigService;

  constructor(props: Props, context: any) {
    super(props, context);

    this.authService = new AuthorizationService();
    this.launchDarklyConfigService = LaunchDarklyConfigService.getInstance();

    this.authService.logout();
    this.launchDarklyConfigService.clearContext();
  }

  componentWillUnmount() {
    this.authService.cancelAllRequests();
    this.launchDarklyConfigService.cancelAllRequests();
  }

  render() {
    return <Navigate to={`/${PATHS.LOGIN_PAGE}`} replace={true} />;
  }
}
