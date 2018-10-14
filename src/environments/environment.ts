// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiEndpoint: 'http://localhost:7072/api',
  tenant: 'bcserverlessdemo.onmicrosoft.com',
  clientID: 'baf03ca9-a5d0-4862-9302-503603cea2af',
  signUpSignInPolicy: 'B2C_1_SISU2',
  b2cScopes: ['baf03ca9-a5d0-4862-9302-503603cea2af']
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
