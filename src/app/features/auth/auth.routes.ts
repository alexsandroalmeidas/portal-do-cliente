import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';

export const AUTH_ROUTES: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  //   {
  //     path: 'passwordrecovery',
  //     loadComponent: () =>
  //       import('./password-recovery/password-recovery.component')
  //         .then(m => m.PasswordRecoveryComponent),
  //   }
];
