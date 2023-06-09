import { AuthenticationError } from '../../common/errors/errors';
import { BaseGQLService } from '../../common/services/BaseGQLService';
import { UserMapper } from '../mappers/UserMapper';
import { AuthorizationService } from './AuthorizationService';

const USER_QUERY = `
{
  viewer {
    name
    level
    canChangePassword
  }
}
`;

export class UserStateService extends BaseGQLService {
  private readonly authService: AuthorizationService;
  private readonly mapper: UserMapper;

  public constructor() {
    super();

    this.authService = new AuthorizationService();
    this.mapper = new UserMapper();
  }

  async refetchUserData(): Promise<void> {
    const token = this.authService.getToken();
    // Redundancy check for additional logout to solve possible race condition between page load,
    // web-component render and state checkup.
    if (!token) {
      throw new AuthenticationError();
    }

    const user = await this.query(USER_QUERY, {}, (data) => this.mapper.mapGQLModel(data?.viewer));
    this.authService.setupUserAppState(token, user);
  }
}
