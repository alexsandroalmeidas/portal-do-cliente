import { AuthData } from './auth.models';

export interface AuthState {
  isAuthenticated: boolean;
  isRefreshing: boolean;
  sessionInitialized: boolean;
  user: string;
  authData?: AuthData;
  // authorizationCode?: string;
  // redirectUrl?: string;
  // rowKeySignin: string | null;
}

export const initialState: AuthState = {
  isAuthenticated: false,
  isRefreshing: false,
  sessionInitialized: false,
  user: '',
  // rowKeySignin: null,
};
