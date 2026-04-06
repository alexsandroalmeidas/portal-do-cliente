import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  catchError,
  distinctUntilChanged,
  map,
  of,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs';

import { select, Store } from '@ngrx/store';
import { ApiResponseData } from 'src/app/shared/models/api-response-data';
import { SessionStorageService } from 'src/app/shared/services/session-storage.service';
import { IdentityStoreSelectors } from '.';
import { AuthStoreSelectors, CoreStoreSelectors, RootStoreState } from '..';
import { MfaStoreSelectors } from '../mfa-store';
import * as IdentityStoreActions from './identity.actions';
import {
  ChangePasswordResponse,
  ForgotPasswordResponse,
  UserEstablishmentPermission,
} from './identity.models';
import { IdentityService } from './identity.service';
import { AppRoles } from '@/shared/models/app-roles';

@Injectable()
export class IdentityStoreEffects {
  constructor(
    private identityService: IdentityService,
    private sessionStorageService: SessionStorageService,
    private store$: Store<RootStoreState.AppState>,
    private actions$: Actions,
  ) {}

  getUserRolesEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType<IdentityStoreActions.GetUserRolesAction>(
        IdentityStoreActions.ActionTypes.GET_USER_ROLES,
      ),
      switchMap((action) => {
        // 🔥 MOCK
        const mockRoles: AppRoles[] = ['Administrador'];

        return of(mockRoles).pipe(
          // delay(300), // opcional pra simular API
          map((roles) => {
            return new IdentityStoreActions.GetUserRolesSuccessAction({
              roles,
            });
          }),
          catchError((error: any) =>
            of(new IdentityStoreActions.GetUserRolesFailureAction({ error })),
          ),
        );
      }),
    ),
  );

  passwordRecoverEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType<IdentityStoreActions.PasswordRecoverAction>(
        IdentityStoreActions.ActionTypes.PASSWORD_RECOVER,
      ),
      withLatestFrom(
        this.store$.pipe(select(CoreStoreSelectors.selectDeviceType)),
        this.store$.pipe(select(CoreStoreSelectors.selectDevice)),
      ),
      switchMap(([action, deviceType, device]) => {
        return this.identityService
          .recoverPassword(action.payload.email, deviceType, device)
          .pipe(
            map(
              (response: ApiResponseData<ForgotPasswordResponse>) =>
                new IdentityStoreActions.PasswordRecoverSuccessAction({
                  response: response.data,
                }),
            ),
            catchError((error: any) => {
              return of(
                new IdentityStoreActions.PasswordRecoverFailureAction({
                  error,
                }),
              );
            }),
          );
      }),
    ),
  );

  listUserPermissionsEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType<IdentityStoreActions.ListUserPermissionsAction>(
        IdentityStoreActions.ActionTypes.LIST_USER_PERMISSIONS,
      ),
      withLatestFrom(
        this.store$.pipe(select(AuthStoreSelectors.selectAuthData)),
      ),
      switchMap(([action, authData]) => {
        // 🔥 MOCK AQUI
        const mockPermissions: UserEstablishmentPermission[] = [
          {
            userId: authData?.user?.id || 'mock-user',
            description: 'antecipacaoautomatica',
            allowed: true,
          },
          {
            userId: authData?.user?.id || 'mock-user',
            description: 'antecipacaopontual',
            allowed: true,
          },
          {
            userId: authData?.user?.id || 'mock-user',
            description: 'consentimento',
            allowed: true,
          },
          {
            userId: authData?.user?.id || 'mock-user',
            description: 'comunicacao',
            allowed: true,
          },
          {
            userId: authData?.user?.id || 'mock-user',
            description: 'mfa',
            allowed: true,
          },
          {
            userId: authData?.user?.id || 'mock-user',
            description: 'taxas',
            allowed: true,
          },
          {
            userId: authData?.user?.id || 'mock-user',
            description: 'banners',
            allowed: true,
          },
          {
            userId: authData?.user?.id || 'mock-user',
            description: 'visualizarvendas',
            allowed: true,
          },
          {
            userId: authData?.user?.id || 'mock-user',
            description: 'visualizarrecebimentos',
            allowed: true,
          },
          {
            userId: authData?.user?.id || 'mock-user',
            description: 'visualizarextratos',
            allowed: true,
          },
          {
            userId: authData?.user?.id || 'mock-user',
            description: 'visualizarrelatorios',
            allowed: true,
          },
        ];

        // simula delay de API
        return of(mockPermissions).pipe(
          // delay(300), // opcional
          map((permissions) => {
            this.sessionStorageService.setItem(
              'identity.user-permissions',
              permissions,
            );

            return new IdentityStoreActions.ListUserPermissionsSuccessAction({
              permissions,
            });
          }),
          catchError((error: any) =>
            of(
              new IdentityStoreActions.ListUserPermissionsFailureAction({
                error,
              }),
            ),
          ),
        );
      }),
    ),
  );

  persistAuthEffect$ = createEffect(
    () =>
      this.store$.pipe(
        withLatestFrom(
          this.store$.pipe(select(IdentityStoreSelectors.selectIdentityState)),
        ),
        distinctUntilChanged(),
        tap(([, accounts]) => {
          this.sessionStorageService.setItem(
            'identity.user-roles',
            accounts.userRoles,
          );
          this.sessionStorageService.setItem(
            'identity.user-permissions',
            accounts.userPermissions,
          );
        }),
      ),
    { dispatch: false },
  );

  changePasswordRecoverEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType<IdentityStoreActions.ChangePasswordAction>(
        IdentityStoreActions.ActionTypes.CHANGE_PASSWORD,
      ),
      withLatestFrom(
        this.store$.pipe(select(AuthStoreSelectors.selectUserEmail)),
        this.store$.pipe(select(CoreStoreSelectors.selectDeviceType)),
        this.store$.pipe(select(MfaStoreSelectors.selectPhoneNumber)),
      ),
      switchMap(([action, userEmail, deviceType, mfaPhoneNumber]) => {
        return this.identityService
          .changePassword(
            userEmail,
            action.payload.currentPassword,
            action.payload.newPassword,
            deviceType,
            mfaPhoneNumber,
          )
          .pipe(
            map(
              (response: ApiResponseData<ChangePasswordResponse>) =>
                new IdentityStoreActions.ChangePasswordSuccessAction({
                  response: response.data,
                }),
            ),
            catchError((error: any) => {
              return of(
                new IdentityStoreActions.ChangePasswordFailureAction({ error }),
              );
            }),
          );
      }),
    ),
  );
}
