import { Injectable } from '@angular/core';

const APP_PREFIX = 'petlove-';

@Injectable()
export class SessionStorageService {
  constructor() {}

  static loadInitialState() {
    return Object.keys(sessionStorage)
      .filter((key) => key.includes(APP_PREFIX))
      .reduce((state: any, storageKey) => {
        const stateKeys = storageKey
          .replace(APP_PREFIX, '')
          .toLowerCase()
          .split('.')
          .map((key) =>
            key
              .split('-')
              .map((token, index) =>
                index === 0
                  ? token
                  : token.charAt(0).toUpperCase() + token.slice(1),
              )
              .join(''),
          );

        let currentStateRef = state;

        stateKeys.forEach((key, index) => {
          if (index === stateKeys.length - 1) {
            const storageItem = sessionStorage.getItem(storageKey);

            if (!!storageItem && storageItem !== 'undefined') {
              currentStateRef[key] = JSON.parse(storageItem);
              return;
            }
          }

          currentStateRef[key] = currentStateRef[key] || {};
          currentStateRef = currentStateRef[key];
        });

        return state;
      }, {});
  }

  setItem(key: string, value: any) {
    sessionStorage.setItem(
      `${APP_PREFIX}${key.toLowerCase()}`,
      JSON.stringify(value),
    );
  }

  getItem(key: string) {
    const value = sessionStorage.getItem(`${APP_PREFIX}${key.toLowerCase()}`);

    if (!!value) {
      return JSON.parse(value);
    }

    return '';
  }

  getItemAs<T>(key: string) {
    return this.getItem(key) as T;
  }

  removeItem(key: string) {
    sessionStorage.removeItem(`${APP_PREFIX}${key.toLowerCase()}`);
  }

  clearAuthSession(): void {
    [
      'auth.is-authenticated',
      'auth.auth-data',
      'auth.authorization-code',
      'auth.user-roles',
      'auth.is-refreshing',
      'auth.row-key-signin',
      'auth.email',
      'mfa.verifiy-show-mfa',
      'administration.selected-establishments',
      'administration.economic-group-phone',
      'identity.user-permissions',
    ].forEach((key) => this.removeItem(key));
  }
}
