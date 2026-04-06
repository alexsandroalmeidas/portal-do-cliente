import {
  createFeatureSelector,
  createSelector,
  MemoizedSelector,
} from '@ngrx/store';
import { AuthData, AuthDataRefreshing } from './auth.models';
import { AuthState } from './auth.state';

export const selectAuthState: MemoizedSelector<object, AuthState> =
  createFeatureSelector<AuthState>('auth');

export const selectIsAuthenticated: MemoizedSelector<object, boolean> =
  createSelector(
    selectAuthState,
    (state: AuthState): boolean => state.isAuthenticated,
  );

export const selectSessionInitialized: MemoizedSelector<object, boolean> =
  createSelector(
    selectAuthState,
    (state: AuthState): boolean => state.sessionInitialized,
  );

export const selectRedirectUrl: MemoizedSelector<object, string | undefined> =
  createSelector(
    selectAuthState,
    (state: AuthState): string | undefined => '', //state.redirectUrl,
  );

export const selectAuthData: MemoizedSelector<object, AuthData | undefined> =
  createSelector(
    selectAuthState,
    (state: AuthState): AuthData | undefined => state.authData,
  );

export const selectAuthorizationCode: MemoizedSelector<
  object,
  string | undefined
> = createSelector(
  selectAuthState,
  (state: AuthState): string | undefined => '', //state.authorizationCode,
);

export const selectIsRefreshing: MemoizedSelector<object, boolean> =
  createSelector(
    selectAuthState,
    (state: AuthState): boolean => state.isRefreshing,
  );

export const selectAuthDataRefreshing: MemoizedSelector<
  object,
  AuthDataRefreshing
> = createSelector(
  selectAuthData,
  selectIsRefreshing,
  (authData: AuthData | undefined, refreshing: boolean): AuthDataRefreshing => {
    return { authData, isRefreshing: refreshing };
  },
);

export const selectRowKeySignin: MemoizedSelector<object, string | null> =
  createSelector(
    selectAuthState,
    (state: AuthState): string | null => null, // state.rowKeySignin,
  );

export const selectUserEmail: MemoizedSelector<object, string> = createSelector(
  selectAuthState,
  selectAuthData,
  (authState: AuthState, authData: AuthData | undefined): string => {
    return (authData?.user?.email ?? authState.user)?.toLocaleLowerCase() ?? '';
  },
);
