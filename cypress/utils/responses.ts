export const generateValidRESTResponse = (data: any) => {
  return {
    data: data,
  };
};

export const generatePresetResponse = (data: any | null): any => {
  return (
    data || {
      forgotPassword: '/forgot-password',
      oidc: {
        buttonLabel: 'Log in with Keycloak',
        endpoint: '/oidc/login',
      },
    }
  );
};

export const generateConfigsResponse = (data: any | null): any => {
  return (
    data || {
      launchDarklyContext: null,
    }
  );
};
