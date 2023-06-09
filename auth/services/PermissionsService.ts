import { AuthorizationService } from './AuthorizationService';

export class PermissionsService {
  private readonly authorizationService: AuthorizationService;

  constructor() {
    this.authorizationService = new AuthorizationService();
  }

  async canCreateProject(): Promise<boolean> {
    const user = this.authorizationService.getAuthorizedUser();

    return !!user?.isAnalyst();
  }

  async canDownloadTracers(): Promise<boolean> {
    const user = this.authorizationService.getAuthorizedUser();

    return !!user?.isAnalyst();
  }

  async canInviteCoworker(): Promise<boolean> {
    const user = this.authorizationService.getAuthorizedUser();

    return !!user?.isAnalyst();
  }

  cancelAllRequests() {
    // Handle future async requests cancellations
  }
}
