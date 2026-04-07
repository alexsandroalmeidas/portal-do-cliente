import { TokenRefreshCoordinator } from '@/shared/helpers/token-refresh-coordinator';
import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { EMPTY, map, of, switchMap, tap } from 'rxjs';
import {
  catchError,
  distinctUntilChanged,
  filter,
  withLatestFrom,
} from 'rxjs/operators';
import { NotificationService } from 'src/app/shared/services/notification.service';
import {
  environment as env,
  environment,
} from '../../../environments/environment';
import { IdentityStoreActions } from '../identity-store';
import { MfaStoreActions, MfaStoreSelectors } from '../mfa-store';
import { RootStoreState } from './../../root-store';
import { AdministrationStoreActions } from './../../root-store/administration-store';
import {
  CoreStoreActions,
  CoreStoreSelectors,
} from './../../root-store/core-store';
import { SessionStorageService } from './../../shared/services/session-storage.service';
import { AuthStoreActions, AuthStoreSelectors } from './../auth-store';
import { AuthService } from './auth.service';
import { AuthData } from './auth.models';

@Injectable()
export class AuthStoreEffects {
  constructor(
    private authService: AuthService,
    private sessionStorageService: SessionStorageService,
    private router: Router,
    private actions$: Actions,
    private store$: Store<RootStoreState.AppState>,
    private ngxService: NgxUiLoaderService,
    private notificationService: NotificationService,
    private refreshCoordinator: TokenRefreshCoordinator,
  ) {}

  signInEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType<AuthStoreActions.SignInAction>(
        AuthStoreActions.ActionTypes.SIGNIN,
      ),
      switchMap(({ payload }) => {
        const authData = {
          user: {
            email: payload.user,
            name: payload.user,
            id: 'petlove001',
            eId: 'ADF34349-CD07-4B9B-BC52-5483F719C067',
          },
          isAd: false,
          authToken: {
            accessToken: 'mock-token',
            refreshToken: 'mock-refresh',
          },
          status: '',
          authorizationCode: '',
        } as AuthData;

        return of(
          new AuthStoreActions.SignInSuccessAction({
            user: payload.user,
            authData,
          }),
        );
      }),
    ),
  );

  signInSuccessEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType<AuthStoreActions.SignInSuccessAction>(
        AuthStoreActions.ActionTypes.SIGNIN_SUCCESS,
      ),
      tap(({ payload }) => {
        if (!payload.user) {
          this.store$.dispatch(new AuthStoreActions.SignOutAction());
          return;
        }

        this.sessionStorageService.setItem('auth.user', payload.user);

        // this.sessionStorageService.setItem(
        //   'auth.authorization-code',
        //   payload.authorizationCode,
        // );

        // this.sessionStorageService.setItem(
        //   'auth.row-key-signin',
        //   payload.rowKeySignin,
        // );

        this.store$.dispatch(
          new CoreStoreActions.UpdateLastClickTimeAction({
            time: Date.now(),
          }),
        );
      }),
      map(({ payload }) => new AuthStoreActions.InitializeSessionAction()),
    ),
  );

  signOutEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType<AuthStoreActions.SignOutAction>(
        AuthStoreActions.ActionTypes.SIGNOUT,
      ),
      withLatestFrom(
        this.store$.pipe(select(AuthStoreSelectors.selectUserEmail)),
        this.store$.pipe(select(AuthStoreSelectors.selectAuthData)),
      ),
      map(([, email, authData]) => {
        // if (email && !authData?.isAd) {
        //   this.store$.dispatch(
        //     new AdministrationStoreActions.UserLogAction({
        //       userName: email,
        //       action: 'signout',
        //     }),
        //   );
        // }

        this.store$.dispatch(new AuthStoreActions.RevokeTokenAction());
        this.ngxService.startLoader('master');

        return new AuthStoreActions.SignOutSuccessAction();
      }),
    ),
  );

  revokeTokenEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType<AuthStoreActions.RevokeTokenAction>(
        AuthStoreActions.ActionTypes.REVOKE_TOKEN,
      ),
      withLatestFrom(
        this.store$.pipe(select(AuthStoreSelectors.selectAuthData)),
      ),
      switchMap(([, auth]) =>
        this.authService.revokeToken(auth?.authToken?.accessToken ?? '').pipe(
          map(() => new AuthStoreActions.RevokeTokenSuccessAction()),
          catchError((error) =>
            of(new AuthStoreActions.RevokeTokenFailureAction({ error })),
          ),
        ),
      ),
    ),
  );

  signOutSuccessEffect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType<AuthStoreActions.SignOutSuccessAction>(
          AuthStoreActions.ActionTypes.SIGNOUT_SUCCESS,
        ),
        tap(() => {
          // ======================================================
          // 1️⃣ LIMPAR SESSION STORAGE
          // ======================================================
          this.sessionStorageService.clearAuthSession();

          // ======================================================
          // 2️⃣ LIMPAR STORES
          // ======================================================
          this.store$.dispatch(new AuthStoreActions.ClearAuthStateAction());
          this.store$.dispatch(new CoreStoreActions.ResetCoreStateAction());
          this.store$.dispatch(
            new AdministrationStoreActions.ResetAdministrationStateAction(),
          );
          this.store$.dispatch(
            new IdentityStoreActions.ResetIdentityStateAction(),
          );
          this.store$.dispatch(new MfaStoreActions.ResetMfaStateAction());

          // ======================================================
          // 3️⃣ REDIRECIONAMENTO FINAL
          // ======================================================
          this.router.navigateByUrl('/login').catch((err) => console.log(err));
        }),
      ),
    { dispatch: false },
  );

  unauthorizedEffect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType<AuthStoreActions.UnauthorizedAction>(
          AuthStoreActions.ActionTypes.UNAUTHORIZED,
        ),
        tap(() => {
          this.sessionStorageService.removeItem('auth.authorization-code');
          this.sessionStorageService.removeItem('auth.row-key-signin');
          this.sessionStorageService.removeItem('mfa.verifiy-show-mfa');
          this.sessionStorageService.removeItem('identity.user-permissions');
          this.sessionStorageService.removeItem(
            'administration.economic-group-phone',
          );
          this.router.navigateByUrl('/login').catch((err) => console.log(err));
        }),
      ),
    { dispatch: false },
  );

  persistAuthEffect$ = createEffect(
    () =>
      this.store$.pipe(
        withLatestFrom(
          this.store$.pipe(select(AuthStoreSelectors.selectAuthState)),
          this.store$.pipe(select(AuthStoreSelectors.selectAuthData)),
          this.store$.pipe(select(AuthStoreSelectors.selectIsRefreshing)),
          this.store$.pipe(select(CoreStoreSelectors.selectCoreState)),
          this.store$.pipe(select(MfaStoreSelectors.selectMfaState)),
          this.store$.pipe(select(AuthStoreSelectors.selectUserEmail)),
        ),
        distinctUntilChanged(),
        tap(
          ([
            action,
            authState,
            authData,
            refreshing,
            core,
            mfaState,
            userEmail,
          ]) => {
            this.sessionStorageService.setItem(
              'auth.is-refreshing',
              refreshing,
            );
            this.sessionStorageService.setItem(
              'auth.last-click-time',
              core.lastClickTime,
            );
            // this.sessionStorageService.setItem(
            //   'auth.redirect-url',
            //   authState.redirectUrl,
            // );
            this.sessionStorageService.setItem(
              'auth.is-authenticated',
              authState.isAuthenticated,
            );
            this.sessionStorageService.setItem('auth.auth-data', authData);
            this.sessionStorageService.setItem('auth.email', userEmail);
            this.sessionStorageService.setItem(
              'mfa.verifiy-show-mfa',
              mfaState.verifiyShowMfa,
            );
          },
        ),
      ),
    { dispatch: false },
  );

  refreshTokenEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthStoreActions.ActionTypes.REFRESH_TOKEN),
      withLatestFrom(
        this.store$.pipe(select(AuthStoreSelectors.selectAuthData)),
      ),
      switchMap(([_, auth]) => {
        return this.authService
          .refreshToken(
            auth?.authorizationCode ?? '',
            auth?.ssoToken ?? (null as any),
            auth?.authToken.refreshToken ?? '',
            auth?.user ?? (null as any),
          )
          .pipe(
            tap((authData) => {
              const newToken = authData.authToken.accessToken;
              this.refreshCoordinator.finishRefresh(newToken);
            }),
            map(
              (authData) =>
                new AuthStoreActions.RefreshTokenSuccessAction({ authData }),
            ),
            // catchError((error) => of(new AuthStoreActions.RefreshTokenFailureAction({ error })))
            catchError((error) => {
              this.refreshCoordinator.finishRefresh('');

              this.store$.dispatch(new AuthStoreActions.SignOutAction());

              return EMPTY;
            }),
          );
      }),
    ),
  );

  refreshUnlock$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          AuthStoreActions.ActionTypes.REFRESH_TOKEN_SUCCESS,
          AuthStoreActions.ActionTypes.REFRESH_TOKEN_FAILURE,
        ),
        tap(() => this.refreshCoordinator.finishRefresh('')),
      ),
    { dispatch: false },
  );

  initializeSessionEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType<AuthStoreActions.InitializeSessionAction>(
        AuthStoreActions.ActionTypes.INITIALIZE_SESSION,
      ),
      withLatestFrom(
        this.store$.pipe(select(AuthStoreSelectors.selectAuthData)),
        this.store$.pipe(select(AuthStoreSelectors.selectUserEmail)),
      ),
      map(([action, authData, userEmail]) => {
        // if (
        //   window.location.pathname !== '/passwordrecovery' &&
        //   window.location.pathname !== '/signinAD' &&
        //   !authData?.user
        // ) {
        //   console.log(`SignOutAction: auth.effects.ts:343`);
        //   return new AuthStoreActions.SignOutAction();
        // }

        // Apenas registra os eventos aqui para poder coletar qdo trocar de rota
        if (!authData?.isAd) {
          const events = this.router.events.pipe(
            filter((event) => event instanceof NavigationEnd),
          );
          events.subscribe((route: any) => {
            // this.store$.dispatch(
            //   new AdministrationStoreActions.UserLogAction({
            //     userName: userEmail,
            //     action: route.urlAfterRedirects,
            //   }),
            // );
          });
        }

        this.store$.dispatch(
          new CoreStoreActions.UpdateLastClickTimeAction({ time: Date.now() }),
        );

        return new AuthStoreActions.InitializedSessionAction();
      }),
    ),
  );

  initializedSessionEffect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType<AuthStoreActions.InitializedSessionAction>(
          AuthStoreActions.ActionTypes.INITIALIZED_SESSION,
        ),
        withLatestFrom(
          this.store$.pipe(select(AuthStoreSelectors.selectAuthData)),
          this.store$.pipe(select(AuthStoreSelectors.selectRedirectUrl)),
          this.store$.pipe(select(AuthStoreSelectors.selectUserEmail)),
        ),
        tap(([, authData, redirectUrl, userEmail]) => {
          const userName = userEmail;
          const userId = authData?.user?.id || '';
          const eId = authData?.user?.eId || '';

          (window as any).email = userName;

          document.body.setAttribute(
            'timestamp',
            `${new Date().format('YYYYMMDDHHmmss')}`,
          );

          if (!!userId) {
            this.store$.dispatch(
              new IdentityStoreActions.GetUserRolesAction({ userId }),
            );

            if (environment.production) {
              this.store$.dispatch(new MfaStoreActions.VerifyShowMfaAction());
            }

            this.store$.dispatch(
              new AdministrationStoreActions.GetEconomicGroupAction({ eId }),
            );
          }

          const params: { [key: string]: string } = {};
          const url = new URL(window.location.href);

          url.searchParams.forEach((val, key) => {
            params[key] = val;
          });

          const redirectTo = redirectUrl ?? url.pathname;

          if (!!redirectTo && redirectTo !== '/' && !authData?.isAd) {
            // this.store$.dispatch(
            //   new AdministrationStoreActions.UserLogAction({
            //     userName,
            //     action: redirectTo,
            //   }),
            // );
          }

          // this.router
          //   .navigate([redirectTo], { queryParams: params })
          //   .catch((err) => console.log(err));

          this.router
            .navigateByUrl('/summary')
            .catch((err) => console.log(err));
        }),
      ),
    { dispatch: false },
  );

  initializeAdSessionEffect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType<AuthStoreActions.InitializeAdSessionAction>(
          AuthStoreActions.ActionTypes.INITIALIZE_AD_SESSION,
        ),
        withLatestFrom(
          this.store$.pipe(select(AuthStoreSelectors.selectAuthData)),
        ),
        map(([action]) => {
          this.store$.dispatch(
            new AuthStoreActions.ValidateUserAdAction({
              authorizationCode: action.payload.authorizationCode,
            }),
          );

          this.store$.dispatch(
            new CoreStoreActions.UpdateLastClickTimeAction({
              time: Date.now(),
            }),
          );
        }),
      ),
    { dispatch: false },
  );

  initializedAdSessionEffect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType<AuthStoreActions.InitializedAdSessionAction>(
          AuthStoreActions.ActionTypes.INITIALIZED_AD_SESSION,
        ),
        withLatestFrom(
          this.store$.pipe(select(AuthStoreSelectors.selectAuthData)),
          this.store$.pipe(select(AuthStoreSelectors.selectUserEmail)),
        ),
        tap(([, authData, userEmail]) => {
          if (!(authData?.user?.allow ?? false)) {
            this.notificationService.showWarning(
              'Contate o Administrador!',
              'Usuário não possui permissão para acessar o sistema.',
            );
            console.log(`SignOutAction: auth.effects.ts:366`);
            return;
          }

          const userId = authData?.user?.id || '';
          const eId = userId;

          (window as any).email = userEmail;

          document.body.setAttribute(
            'timestamp',
            `${new Date().format('YYYYMMDDHHmmss')}`,
          );

          if (!!userId) {
            this.store$.dispatch(
              new IdentityStoreActions.GetUserRolesAction({ userId }),
            );

            if (environment.production) {
              this.store$.dispatch(new MfaStoreActions.VerifyShowMfaAction());
            }

            this.store$.dispatch(
              new AdministrationStoreActions.GetEconomicGroupAction({ eId }),
            );
          }

          this.router
            .navigateByUrl('/summary')
            .catch((err) => console.log(err));
        }),
      ),
    { dispatch: false },
  );

  validateUserAdEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType<AuthStoreActions.ValidateUserAdAction>(
        AuthStoreActions.ActionTypes.VALIDATE_USER_AD,
      ),
      withLatestFrom(
        this.store$.pipe(select(AuthStoreSelectors.selectAuthorizationCode)),
        this.store$.pipe(select(CoreStoreSelectors.selectDeviceType)),
        this.store$.pipe(select(CoreStoreSelectors.selectDevice)),
      ),
      switchMap(([{ payload }, aCode, deviceType, device]) =>
        this.authService.signinAd(aCode ?? '', deviceType, device).pipe(
          map((authData) => {
            return authData.status === 'succeeded'
              ? new AuthStoreActions.ValidateUserAdSuccessAction({
                  authData,
                  authorizationCode: payload.authorizationCode,
                  rowKeySignin: authData.user?.rowKey ?? '',
                })
              : new AuthStoreActions.SignInFailureAction({
                  error: 'Falha na autenticação do usuário',
                });
          }),
          catchError((error) =>
            of(new AuthStoreActions.SignInFailureAction({ error })),
          ),
        ),
      ),
    ),
  );

  validateUserAdSuccessEffect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType<AuthStoreActions.ValidateUserAdSuccessAction>(
          AuthStoreActions.ActionTypes.VALIDATE_USER_AD_SUCCESS,
        ),
        tap((action) => {
          this.sessionStorageService.setItem(
            'auth.authorization-code',
            `AD-${action.payload.authorizationCode}`,
          );

          this.store$.dispatch(
            new CoreStoreActions.UpdateLastClickTimeAction({
              time: Date.now(),
            }),
          );

          this.store$.dispatch(
            new AuthStoreActions.InitializedAdSessionAction(),
          );
        }),
      ),
    { dispatch: false },
  );

  loginAdEffect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType<AuthStoreActions.LoginAdAction>(
          AuthStoreActions.ActionTypes.LOGIN_AD,
        ),
        tap((_) => {
          window.location.href = `${env.proxyBaseUrl}/api/auth/login?loginOk=true`;
        }),
      ),
    { dispatch: false },
  );
}
