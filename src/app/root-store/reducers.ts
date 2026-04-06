import { Action, ActionReducer, MetaReducer, UPDATE } from '@ngrx/store';
import { environment as env } from '../../environments/environment';
import { LocalStorageService } from '../shared/services/local-storage.service';
import { SessionStorageService } from '../shared/services/session-storage.service';
import { AppState } from './state';

export function debug(reducer: ActionReducer<AppState>): ActionReducer<AppState> {
  return (state, action) => {
    const newState = reducer(state, action);

    console.log(`[DEBUG] action: ${action.type}`, {
      payload: (action as any).payload,
      oldState: state,
      newState
    });

    return newState;
  };
}

export function initStateFromSessionStorage(reducer: ActionReducer<AppState>): ActionReducer<AppState> {
  return (state, action) => {
    let newState = reducer(state, action);

    if ([`${UPDATE}`].includes(action.type)) {
      const {
        administration,
        auth,
        core,
        settings
      } = SessionStorageService.loadInitialState();

      const {
        communication,
      } = LocalStorageService.loadInitialState();

      newState = {
        ...newState,
        administration: {
          ...newState.administration,
          ...administration
        },
        auth: {
          ...newState.auth,
          ...auth
        },
        core: {
          ...newState.core,
          ...core
        },
        settings: {
          ...newState.settings,
          ...settings
        },
        communication: {
          ...newState.communication,
          ...communication
        }
      };
    }

    return newState;
  };
}

export const metaReducers: MetaReducer<any, Action>[] = [
  initStateFromSessionStorage
];

if (!env.production) {
  metaReducers.unshift(debug);
}
