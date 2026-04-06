import { Actions, ActionTypes } from './auth.actions';
import { AuthData, UserInfo } from './auth.models';
import { AuthState, initialState } from './auth.state';

export function featureReducer(
  state = initialState,
  action: Actions,
): AuthState {
  switch (action.type) {
    case ActionTypes.SIGNIN_SUCCESS: {
      const { payload } = action;
      const { user, authData } = payload;

      return {
        ...state,
        isAuthenticated: true,
        isRefreshing: false,
        user,
        authData,
      };
    }
    case ActionTypes.REFRESH_TOKEN: {
      return {
        ...state,
        isAuthenticated: true,
        isRefreshing: true,
      };
    }
    case ActionTypes.SIGNIN_FAILURE:
    case ActionTypes.REFRESH_TOKEN_FAILURE: {
      return {
        ...state,
        isRefreshing: false,
      };
    }
    case ActionTypes.REFRESH_TOKEN_SUCCESS: {
      const { payload } = action;
      const { authData } = payload;

      return {
        ...state,
        isAuthenticated: true,
        isRefreshing: false,
        // authData,
      };
    }
    case ActionTypes.VALIDATE_USER_AD: {
      const { payload } = action;

      return {
        ...state,
        isAuthenticated: true,
        isRefreshing: false,
        // authorizationCode: payload.authorizationCode,
      };
    }
    case ActionTypes.VALIDATE_USER_AD_SUCCESS: {
      const { payload } = action;
      const { authData } = payload;

      return {
        ...state,
        isAuthenticated: true,
        isRefreshing: false,
        // authorizationCode: payload.authorizationCode,
        // authData,
        // rowKeySignin: payload.rowKeySignin,
      };
    }
    case ActionTypes.INITIALIZED_SESSION: {
      return {
        ...state,
        sessionInitialized: true,
        // redirectUrl: undefined,
        isRefreshing: false,
      };
    }

    case ActionTypes.CLEAR_AUTH_STATE:
    case ActionTypes.SIGNOUT_SUCCESS: {
      const url = new URL(window.location.href);

      return {
        ...state,
        isAuthenticated: false,
        isRefreshing: false,
        sessionInitialized: false,
        user: '',
        authData: undefined,
        // authorizationCode: undefined,
        // redirectUrl: `${url.pathname}`,
        // rowKeySignin: '',
      };
    }

    default: {
      return {
        ...state,
      };
    }
  }
}
