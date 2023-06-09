import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://127.0.0.1:3000',
    defaultCommandTimeout: 10000,
    screenshotOnRunFailure: false,
    video: false,
    watchForFileChanges: false,
    requestTimeout: 10000,
  },
  reporter: '../../../../node_modules/cypress-multi-reporters',
  reporterOptions: {
    configFile: 'cypress/cypress-reporter.config.json',
  },
});
