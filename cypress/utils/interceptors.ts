import { generateConfigsResponse, generatePresetResponse } from './responses';

export const interceptPresets = (data: any = null) => {
  cy.intercept('GET', '/api/internal/presets', generatePresetResponse(data));
};

export const interceptConfigs = (data: any = null) => {
  cy.intercept('GET', '/api/internal/configs', generateConfigsResponse(data));
};
