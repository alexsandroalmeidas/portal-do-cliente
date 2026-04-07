import { inject } from '@angular/core';
import { Router, Routes } from '@angular/router';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { CoreStoreSelectors } from './root-store';
import { AppState } from './root-store/state';

const checkIfIsNotMobile = () => {
  const store = inject(Store<AppState>);
  const router = inject(Router);

  return store.select(CoreStoreSelectors.selectLayoutPageSize).pipe(
    map((pageSize) => {
      const isMobile =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent,
        );

      if (isMobile) {
        router.navigate(['/summary/mobile']);
      }

      return !isMobile;
    }),
  );
};

const checkIfIsMobile = () => {
  const store = inject(Store<AppState>);
  const router = inject(Router);

  return store.select(CoreStoreSelectors.selectLayoutPageSize).pipe(
    map((pageSize) => {
      const isMobile =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent,
        );

      if (!isMobile) {
        router.navigate(['/summary']);
      }

      return isMobile;
    }),
  );
};

export const APP_ROUTES: Routes = [
  // 🔥 REDIRECT INICIAL (ESSENCIAL)
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },

  // 🔓 PUBLICO
  {
    path: '',
    // canActivate: [() => checkIfIsNotMobile()],
    loadChildren: () =>
      import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },

  // 🔐 PRIVADO
  {
    path: '',
    canActivate: [() => checkIfIsNotMobile()],
    loadChildren: () =>
      import('./features/main/main.routes').then((m) => m.MAIN_ROUTES),
  },
  {
    path: '',
    canActivate: [() => checkIfIsMobile()],
    loadChildren: () =>
      import('./features/mobile/mobile.routes').then((m) => m.MOBILE_ROUTES),
  },

  { path: '**', redirectTo: 'login' },
];
