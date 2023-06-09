import { BaseRESTService } from '../../common/services/BaseRESTService';

export type OIDCConfig = {
  endpoint: string;
  buttonLabel: string;
};

export type ForgotPassword = {
  link: string;
};

type PresetConfig = {
  forgotPassword: ForgotPassword | null;
  oidc: OIDCConfig | null;
};

// TODO: add link to documentation on how to add additional feature flags
export class PresetService extends BaseRESTService {
  private static instance: PresetService | null = null;
  private config: PresetConfig | null = null;

  static getInstance(): PresetService {
    if (PresetService.instance === null) {
      PresetService.instance = new PresetService();
    }
    return PresetService.instance;
  }

  async fetchPresets(): Promise<PresetConfig> {
    if (this.config !== null) {
      return this.config;
    }
    const response = await this.get('/api/internal/presets');
    this.config = <PresetConfig>response.data;
    return this.config;
  }
}
