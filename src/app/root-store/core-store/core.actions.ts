import { Action } from '@ngrx/store';
import { SensitiveDataVisibilityMode } from './core.state';

export enum ActionTypes {
  THROW_ERROR = '@app/error',
  START_SMALL_BREAKPOINT = '@app/layout/start-small-breakpoint',
  START_MEDIUM_BREAKPOINT = '@app/layout/start-medium-breakpoint',
  LAYOUT_CLOSE_SIDEBAR = '@app/layout/close-sidebar',
  LAYOUT_TOGGLE_SIDEBAR = '@app/layout/toggle-sidebar',
  TOGGLE_SENSITIVE_DATA_VISIBILITY_MODE = '@app/core/toggle-sensitive-data-visibility',
  SET_SENSITIVE_DATA_VISIBILITY_MODE = '@app/core/set-sensitive-data-visibility',
  TOUCH_START = '@app/core/touch-start',
  OVERSCROLL_START = '@app/core/overscroll-start',
  OVERSCROLL_END = '@app/core/overscroll-end',
  UPDATE_LAST_CLICK_TIME = '@app/core/update-last-action',
  SET_UUID = '@app/core/set-uuid',
  RESET_CORE_STATE = '@app/core/reset-core-state'
}

export class ThrowErrorAction implements Action {
  readonly type = ActionTypes.THROW_ERROR;
  constructor(public payload: { error: any }) {}
}

export class TouchStartAction implements Action {
  readonly type = ActionTypes.TOUCH_START;
  constructor(public payload: { startY: any }) {}
}

export class OverscrollStartAction implements Action {
  readonly type = ActionTypes.OVERSCROLL_START;
}

export class OverscrollEndAction implements Action {
  readonly type = ActionTypes.OVERSCROLL_END;
}

export class StartSmallBreakpointAction implements Action {
  readonly type = ActionTypes.START_SMALL_BREAKPOINT;
}

export class StartMediumBreakpointAction implements Action {
  readonly type = ActionTypes.START_MEDIUM_BREAKPOINT;
}

export class LayoutCloseSidebarAction implements Action {
  readonly type = ActionTypes.LAYOUT_CLOSE_SIDEBAR;
}

export class LayoutToggleSidebarAction implements Action {
  readonly type = ActionTypes.LAYOUT_TOGGLE_SIDEBAR;
}

export class ToggleSensitiveDataVisibilityModeAction implements Action {
  readonly type = ActionTypes.TOGGLE_SENSITIVE_DATA_VISIBILITY_MODE;
}

export class SetSensitiveDataVisibilityModeAction implements Action {
  readonly type = ActionTypes.SET_SENSITIVE_DATA_VISIBILITY_MODE;
  constructor(public payload: { visibilityMode: SensitiveDataVisibilityMode }) {}
}

export class UpdateLastClickTimeAction implements Action {
  readonly type = ActionTypes.UPDATE_LAST_CLICK_TIME;
  constructor(public payload: { time: number }) {}
}

export class SetUuidAction implements Action {
  readonly type = ActionTypes.SET_UUID;
  constructor(public payload: { uuid: string }) {}
}

export class ResetCoreStateAction implements Action {
  readonly type = ActionTypes.RESET_CORE_STATE;
}

export type Actions =
  | ThrowErrorAction
  | StartSmallBreakpointAction
  | StartMediumBreakpointAction
  | LayoutCloseSidebarAction
  | LayoutToggleSidebarAction
  | ToggleSensitiveDataVisibilityModeAction
  | SetSensitiveDataVisibilityModeAction
  | TouchStartAction
  | OverscrollStartAction
  | OverscrollEndAction
  | UpdateLastClickTimeAction
  | SetUuidAction
  | ResetCoreStateAction;
