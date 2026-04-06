// auth.actions.ts
import { Action } from '@ngrx/store';
import { AuthData } from './auth.models';

export enum ActionTypes {
  SIGNIN = '@app/auth/sign-in',
  SIGNIN_SUCCESS = '@app/auth/sign-in-success',
  SIGNIN_FAILURE = '@app/auth/sign-in-failure',

  SIGNOUT = '@app/auth/sign-out',
  SIGNOUT_SUCCESS = '@app/auth/sign-out-success',

  UNAUTHORIZED = '@app/auth/unauthorized',

  INITIALIZE_SESSION = '@app/auth/initialize-session',
  INITIALIZED_SESSION = '@app/auth/initialized-session',

  INITIALIZE_AD_SESSION = '@app/auth/initialize-ad-session',
  INITIALIZED_AD_SESSION = '@app/auth/initialized-ad-session',

  REFRESH_TOKEN = '@app/auth/refresh-token',
  REFRESH_TOKEN_SUCCESS = '@app/auth/refresh-token-success',
  REFRESH_TOKEN_FAILURE = '@app/auth/refresh-token-failure',

  SIGNIN_AD = '@app/auth/sign-in-ad',
  SIGNIN_AD_SUCCESS = '@app/auth/sign-in-ad-success',
  SIGNIN_AD_FAILURE = '@app/auth/sign-in-ad-failure',

  VALIDATE_USER_AD = '@app/auth/validate-user-ad',
  VALIDATE_USER_AD_SUCCESS = '@app/auth/validate-user-ad-success',
  VALIDATE_USER_AD_FAILURE = '@app/auth/validate-user-ad-failure',

  LOGIN_AD = '@app/auth/login-ad',

  REVOKE_TOKEN = '@app/auth/revoke',
  REVOKE_TOKEN_SUCCESS = '@app/auth/revoke-success',
  REVOKE_TOKEN_FAILURE = '@app/auth/revoke-failure',

  CLEAR_AUTH_STATE = '@app/auth/clear-auth-state',
}

/* ==== SIGN IN ==== */

export class SignInAction implements Action {
  readonly type = ActionTypes.SIGNIN;
  constructor(public payload: { user: string; password: string }) {}
}

export class SignInSuccessAction implements Action {
  readonly type = ActionTypes.SIGNIN_SUCCESS;
  constructor(public payload: { user: string; authData: AuthData }) {}
}

export class SignInFailureAction implements Action {
  readonly type = ActionTypes.SIGNIN_FAILURE;
  constructor(public payload: { error: any }) {}
}

/* ==== SIGN OUT ==== */

export class SignOutAction implements Action {
  readonly type = ActionTypes.SIGNOUT;
}

export class SignOutSuccessAction implements Action {
  readonly type = ActionTypes.SIGNOUT_SUCCESS;
}

/* ==== TOKEN ==== */

export class RefreshTokenAction implements Action {
  readonly type = ActionTypes.REFRESH_TOKEN;
  constructor() {}
}

export class RefreshTokenSuccessAction implements Action {
  readonly type = ActionTypes.REFRESH_TOKEN_SUCCESS;
  constructor(public payload: { authData: AuthData }) {}
}

export class RefreshTokenFailureAction implements Action {
  readonly type = ActionTypes.REFRESH_TOKEN_FAILURE;
  constructor(public payload: { error: any }) {}
}

/* ==== AD ==== */

export class ValidateUserAdAction implements Action {
  readonly type = ActionTypes.VALIDATE_USER_AD;
  constructor(public payload: { authorizationCode: string }) {}
}

export class ValidateUserAdSuccessAction implements Action {
  readonly type = ActionTypes.VALIDATE_USER_AD_SUCCESS;
  constructor(
    public payload: {
      authData: AuthData;
      authorizationCode: string;
      rowKeySignin: string;
    },
  ) {}
}

export class ValidateUserAdFailureAction implements Action {
  readonly type = ActionTypes.VALIDATE_USER_AD_FAILURE;
  constructor(public payload: { error: any }) {}
}

export class UnauthorizedAction implements Action {
  readonly type = ActionTypes.UNAUTHORIZED;
}

export class InitializeSessionAction implements Action {
  readonly type = ActionTypes.INITIALIZE_SESSION;
}

export class InitializedSessionAction implements Action {
  readonly type = ActionTypes.INITIALIZED_SESSION;
}

export class InitializeAdSessionAction implements Action {
  readonly type = ActionTypes.INITIALIZE_AD_SESSION;
  constructor(public payload: { authorizationCode: string }) {}
}

export class InitializedAdSessionAction implements Action {
  readonly type = ActionTypes.INITIALIZED_AD_SESSION;
}

export class LoginAdAction implements Action {
  readonly type = ActionTypes.LOGIN_AD;
}

export class RevokeTokenAction implements Action {
  readonly type = ActionTypes.REVOKE_TOKEN;
}

export class RevokeTokenSuccessAction implements Action {
  readonly type = ActionTypes.REVOKE_TOKEN_SUCCESS;
}

export class RevokeTokenFailureAction implements Action {
  readonly type = ActionTypes.REVOKE_TOKEN_FAILURE;
  constructor(public payload: { error: any }) {}
}

export class ClearAuthStateAction implements Action {
  readonly type = ActionTypes.CLEAR_AUTH_STATE;
}

/* ==== UNION ==== */

export type Actions =
  | SignInAction
  | SignInSuccessAction
  | SignInFailureAction
  | SignOutAction
  | SignOutSuccessAction
  | RefreshTokenAction
  | RefreshTokenSuccessAction
  | RefreshTokenFailureAction
  | ValidateUserAdAction
  | ValidateUserAdSuccessAction
  | ValidateUserAdFailureAction
  | InitializeSessionAction
  | InitializedSessionAction
  | InitializeAdSessionAction
  | InitializedAdSessionAction
  | LoginAdAction
  | RevokeTokenAction
  | RevokeTokenSuccessAction
  | RevokeTokenFailureAction
  | UnauthorizedAction
  | ClearAuthStateAction;
