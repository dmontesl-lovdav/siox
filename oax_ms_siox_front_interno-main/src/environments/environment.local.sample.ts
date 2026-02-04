// Copy this file to environment.local.ts and edit locally. This sample is committed for reference.
export const environment = {
  production: false,
  useOauth2: false,
  apiBaseUrl: 'https://siox-nginx.nidium.com.mx/siox',
  oauth2: {
    tokenUrl: '/cri/login/login/oauth2/token',
    // Put local test credentials here or leave defaults.
    clientId: 'YOUR_LOCAL_CLIENT_ID',
    clientSecret: 'YOUR_LOCAL_CLIENT_SECRET',
    grantType: 'client_credentials',
    scope: 'write'
  }
};
