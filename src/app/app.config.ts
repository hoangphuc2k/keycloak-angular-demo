import {
  APP_INITIALIZER,
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { firstValueFrom, of } from 'rxjs';

function initializeKeycloak(keycloak: KeycloakService) {
  return () =>
    firstValueFrom(
      of({
        domain: 'abc.com',
        realm: 'keycloak-angular-sandbox',
        clientId: 'keycloak-angular',
      })
    ).then((config) => {
      return keycloak.init({
        config: {
          realm: config.realm,
          url: 'http://localhost:8080',
          clientId: config.clientId,
        },
        initOptions: {
          onLoad: 'check-sso',
          silentCheckSsoRedirectUri:
            window.location.origin + '/silent-check-sso.html',
        },
      });
    });
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    importProvidersFrom(KeycloakAngularModule),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService],
    },
  ],
};
