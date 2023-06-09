import { BaseRESTService } from '../../common/services/BaseRESTService';
import { BaseService } from '../../common/services/BaseService';
import { UserMapper } from '../mappers/UserMapper';
import { User } from '../models/User';
import { UserLevel } from '../models/UserLevel';

const AUTHORIZED_USER_CACHE_KEY = 'authorizedUser';

export class AuthorizationService extends BaseRESTService {
  private static authorizedUser: User | null = null;
  private readonly mapper: UserMapper;

  public constructor() {
    super();

    if (AuthorizationService.authorizedUser === null) {
      const userData = this.cacheService.getItem(AUTHORIZED_USER_CACHE_KEY);

      if (userData !== null) {
        AuthorizationService.authorizedUser = new User(userData.name, userData.level || this.getBaseUserLevel(), userData.canChangePassword);
      }
    }

    this.mapper = new UserMapper();
  }

  async login(username: string, password: string): Promise<void> {
    const response = await this.post('/api/v2/auth', {
      username,
      password,
    });

    const { apiKey, user: userData } = response.data.data;
    this.setupUserAppState(apiKey, this.mapper.mapRESTModel(userData));
  }

  setupUserAppState(token: string, user: User) {
    AuthorizationService.authorizedUser = user;

    this.cacheService.setItem(AUTHORIZED_USER_CACHE_KEY, AuthorizationService.authorizedUser.toRawJson(), BaseService.DEFAULT_TTL);

    this.setToken(token);
  }

  logout() {
    AuthorizationService.authorizedUser = null;
    this.cacheService.clearItem(AUTHORIZED_USER_CACHE_KEY);
    this.clearToken();
  }

  isLoggedIn(): boolean {
    return AuthorizationService.authorizedUser !== null;
  }

  getAuthorizedUser() {
    return AuthorizationService.authorizedUser;
  }

  getBaseUserLevel() {
    return UserLevel.TESTER;
  }

  isAllowed(allowedRoles?: UserLevel[]): boolean {
    return allowedRoles ? allowedRoles.includes(this.getAuthorizedUser()?.getLevel() || this.getBaseUserLevel()) : true;
  }
}
