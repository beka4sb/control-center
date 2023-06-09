import { t } from 'i18next';
import { BaseController, BaseState } from '../../common/controllers/BaseController';
import { AuthenticationError } from '../../common/errors/errors';
import { RedirectService } from '../../common/services/RedirectService';
import { PATHS } from '../../routing/routes';
import { UserStateService } from '../services/UserStateService';

type Props = {};

interface State extends BaseState {}

export class SessionPickupController extends BaseController<Props, State> {
  private readonly redirectService: RedirectService;

  constructor(props: Props, context: any) {
    super(props, context);

    this.redirectService = RedirectService.getInstance();
  }

  componentDidMount() {
    super.componentDidMount();

    this.setupSession();
  }

  requireAuthorization(): boolean {
    return false;
  }

  async setupSession(): Promise<void> {
    try {
      const token = this.urlHelper.getQueryParam('apiKey', null);

      // If we don't have a token provided, then we redirect to login page
      if (token === null) {
        throw new AuthenticationError({ forceLogout: true });
      }

      this.authService.setToken(token);

      // UserStateService depends on a setup session, so we are handling that in runtime.
      await new UserStateService().refetchUserData();

      let nextLink = this.urlHelper.getQueryParam('next', `/${PATHS.HOME_PAGE}`) as string;
      if (this.redirectService.hasRedirection()) {
        nextLink = this.redirectService.getRedirection();
      }

      window.location.replace(nextLink);
    } catch (e: any) {
      this.handleError(new AuthenticationError({ ...e.options, forceLogout: true }), { authError: t('unsuccessfulSSOLogin') });
    }
  }

  render() {
    return this.renderBase(<></>);
  }
}
