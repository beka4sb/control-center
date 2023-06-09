import { interceptConfigs, interceptPresets } from '../../utils/interceptors';
import { addLocalStorageItem } from '../../utils/localStorage';
import { generateValidRESTResponse } from '../../utils/responses';

describe('Auth flow login', () => {
  describe('valid authorization', () => {
    it('authorizes correctly', () => {
      interceptPresets();
      cy.intercept(
        'POST',
        '/api/v2/auth',
        generateValidRESTResponse({
          apiKey: 'aaaa',
          user: {
            name: 'Admin',
            role: 'analyst',
            canChangePassword: true,
          },
        })
      );
      interceptConfigs();

      const expectedPath = '/api-redirect';
      const expectedSearchQuery = '?apiKey=aaaa&next=/organization/projects';
      const expectedLocalStorageToken = '"value":"aaaa"';
      const expectedLocalStorageUser = '"value":{"name":"Admin","level":"ANALYST","canChangePassword":true}';

      cy.visit('/login?next=/organization/projects');

      // Input username and password, then submit form
      cy.get('input[type="text"]').type('admin');
      cy.get('input[type="password"]').type('admin');
      cy.get('button[type="submit"]').click();

      // LaunchDarkly pauses this for a while and that pushes the event queue up.
      // It causes a race condition between location change and test that waits on that.
      // Temporary fix until we find a better solution for everything around LD context in test env.
      cy.wait(500);

      cy.location().then((location: Location) => {
        expect(location.pathname).to.equal(expectedPath);
        expect(location.search).to.equal(expectedSearchQuery);

        // contain used explicitly since we have TTL value besides the value item
        expect(localStorage.getItem('token')).to.contain(expectedLocalStorageToken);
        expect(localStorage.getItem('authorizedUser')).to.contain(expectedLocalStorageUser);
      });
    });
  });

  describe('already authorized', () => {
    it('redirects to login after storage cleanup', () => {
      interceptPresets();

      addLocalStorageItem('token', 'aaaa');
      addLocalStorageItem('authorizedUser', { name: 'Admin', level: 'ANALYST', canChangePassword: true });

      cy.visit('/login');

      // LaunchDarkly pauses this for a while and that pushes the event queue up.
      // It causes a race condition between location change and test that waits on that.
      // Temporary fix until we find a better solution for everything around LD context in test env.
      cy.wait(500);

      cy.location().then((location: Location) => {
        expect(location.pathname).to.equal('/login');
        expect(localStorage.getItem('token')).to.equal(null);
        expect(localStorage.getItem('authorizedUser')).to.equal(null);
      });
    });
  });

  describe('form errors', () => {
    it('displays input errors', () => {
      interceptPresets();

      cy.visit('/login');

      // Input username and password, then submit form
      cy.get('input[type="text"]').type('admin').clear();
      cy.get('input[type="password"]').type('admin').clear();

      // Both inputs should have a required message
      cy.get('form').find('.MuiFormHelperText-root.Mui-error').should('have.length', 2);
    });
  });

  describe('feature flagged items', () => {
    it('should display forgot password and SSO', () => {
      interceptPresets();

      cy.visit('/login');

      cy.contains('Forgot password').should('exist');
      cy.contains('Log in with Keycloak').should('exist');
    });

    it("shouldn't display forgot password and SSO", () => {
      interceptPresets({
        forgotPassword: null,
        oidc: null,
      });

      cy.visit('/login');

      cy.contains("Can't remember your password?").should('not.exist');
      cy.contains('Log in with Keycloak').should('not.exist');
    });
  });
});
