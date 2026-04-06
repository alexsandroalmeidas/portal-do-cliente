import { Actions, ActionTypes } from './settings.actions';
import { initialState, SettingsState } from './settings.state';

export function featureReducer(state = initialState, action: Actions): SettingsState {
  switch (action.type) {
    case ActionTypes.CHANGE_LANGUAGE: {
      return {
        ...state,
        language: action.payload.language
      };
    }
    default: {
      return {
        ...state
      };
    }
  }
}
