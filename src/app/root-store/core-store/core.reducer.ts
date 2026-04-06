import { Actions, ActionTypes } from './core.actions';
import {
  CoreState,
  initialState,
  PageSize,
  SensitiveDataVisibilityMode,
  SidebarMode
} from './core.state';

export function featureReducer(state = initialState, action: Actions): CoreState {
  switch (action.type) {
    case ActionTypes.THROW_ERROR: {
      return {
        ...state,
        error: action.payload.error
      };
    }
    case ActionTypes.START_SMALL_BREAKPOINT: {
      const { layout } = state;

      return {
        ...state,
        layout: {
          ...layout,
          pageSize: PageSize.small,
          sidebarMode: SidebarMode.closed
        }
      };
    }
    case ActionTypes.START_MEDIUM_BREAKPOINT: {
      const { layout } = state;

      return {
        ...state,
        layout: {
          ...layout,
          pageSize: PageSize.medium,
          sidebarMode: SidebarMode.opened
        }
      };
    }
    case ActionTypes.LAYOUT_CLOSE_SIDEBAR: {
      const { layout } = state;

      return {
        ...state,
        layout: {
          ...layout,
          sidebarMode: SidebarMode.opened
        }
      };
    }
    case ActionTypes.LAYOUT_TOGGLE_SIDEBAR: {
      const { layout } = state;

      let { sidebarMode } = layout;

      const map = new Map([
        [SidebarMode.opened, SidebarMode.closed],
        [SidebarMode.closed, SidebarMode.opened]
      ]);

      return {
        ...state,
        layout: {
          ...layout,
          sidebarMode: map.get(sidebarMode) || SidebarMode.opened
        }
      };
    }
    case ActionTypes.TOGGLE_SENSITIVE_DATA_VISIBILITY_MODE: {
      const { sensitiveDataVisibilityMode } = state;

      const map = new Map([
        [SensitiveDataVisibilityMode.visible, SensitiveDataVisibilityMode.hidden],
        [SensitiveDataVisibilityMode.hidden, SensitiveDataVisibilityMode.visible]
      ]);

      const newState = map.get(sensitiveDataVisibilityMode);

      return {
        ...state,
        sensitiveDataVisibilityMode: newState ?? SensitiveDataVisibilityMode.hidden
      };
    }
    case ActionTypes.SET_SENSITIVE_DATA_VISIBILITY_MODE: {
      const {
        payload: { visibilityMode }
      } = action;

      return {
        ...state,
        sensitiveDataVisibilityMode: visibilityMode
      };
    }
    case ActionTypes.TOUCH_START: {
      const { startY } = action.payload;
      return {
        ...state,
        touchStartY: startY
      };
    }
    case ActionTypes.OVERSCROLL_START: {
      return {
        ...state,
        overscrolling: true
      };
    }
    case ActionTypes.OVERSCROLL_END: {
      return {
        ...state,
        overscrolling: false
      };
    }
    case ActionTypes.UPDATE_LAST_CLICK_TIME: {
      const {
        payload: { time }
      } = action;
      return {
        ...state,
        lastClickTime: time
      };
    }
    case ActionTypes.UPDATE_LAST_CLICK_TIME: {
      const {
        payload: { time }
      } = action;
      return {
        ...state,
        lastClickTime: time
      };
    }
    case ActionTypes.SET_UUID: {
      const {
        payload: { uuid }
      } = action;
      return {
        ...state,
        uuid
      };
    }

    case ActionTypes.RESET_CORE_STATE:
    default: {
      return {
        ...state
      };
    }
  }
}
