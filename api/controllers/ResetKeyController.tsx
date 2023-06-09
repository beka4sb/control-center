import { MainLayoutController, MainLayoutControllerState } from '../../common/controllers/MainLayoutController';

type Props = {};

interface State extends MainLayoutControllerState {}

export class ResetKeyController extends MainLayoutController<Props, State> {
  constructor(props: Props, context: any) {
    super(props, context);
  }

  // When we reset the API key we need to stay on the page so that users can make a copy of it.
  // When the page is loaded, a query is done by MainLayoutController to refresh the user data,
  // which fails because the local and remote API keys do not match anymore: this particular case
  // needs to be allowed, logout will be forced upon the next query.
  requireAuthorization(): boolean {
    return false;
  }

  render() {
    return super.render();
  }
}
