import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';
import { DeviceState } from 'src/app/shared/models/userDevice';
import { AppLayout, CoreState, PageSize, SensitiveDataVisibilityMode, SidebarMode } from './core.state';

export const selectCoreState: MemoizedSelector<object, CoreState> = createFeatureSelector<CoreState>('core');

export const selectAppError: MemoizedSelector<object, string | undefined> = createSelector(
  selectCoreState,
  (state: CoreState): string | undefined => state.error
);

export const selectLayout: MemoizedSelector<object, AppLayout> = createSelector(
  selectCoreState,
  (state: CoreState): AppLayout => state.layout
);

export const selectLayoutPageSize: MemoizedSelector<object, PageSize> = createSelector(
  selectCoreState,
  (state: CoreState): PageSize => state.layout.pageSize
);

export const selectLayoutSidebarMode: MemoizedSelector<object, SidebarMode> = createSelector(
  selectCoreState,
  (state: CoreState): SidebarMode => state.layout.sidebarMode
);

export const selectSensitiveDataVisibilityMode: MemoizedSelector<object, SensitiveDataVisibilityMode> = createSelector(
  selectCoreState,
  (state: CoreState): SensitiveDataVisibilityMode => state.sensitiveDataVisibilityMode
);

export const selectSensitiveDataVisibility: MemoizedSelector<object, boolean> = createSelector(
  selectCoreState,
  (state: CoreState): boolean => state.sensitiveDataVisibilityMode === SensitiveDataVisibilityMode.visible
);

export const selectOverscrolling: MemoizedSelector<object, boolean> = createSelector(
  selectCoreState,
  (state: CoreState): boolean => state.overscrolling
);

export const selectTouchStartY: MemoizedSelector<object, any> = createSelector(
  selectCoreState,
  (state: CoreState): any => state.touchStartY
);

export const selectLastClickTime: MemoizedSelector<object, number> = createSelector(
  selectCoreState,
  (state: CoreState): number => state.lastClickTime
);

export const selectUserDevice: MemoizedSelector<object, DeviceState> = createSelector(
  selectCoreState,
  (state: CoreState): DeviceState => state.userDevice
);

export const selectDeviceType: MemoizedSelector<object, string> = createSelector(
  selectCoreState,
  (state: CoreState): string => {
    const device = state.userDevice;
    return ((device.isMobile || device.isTablet) ? 'mobile' : 'desktop');
  }
);

export const selectDevice: MemoizedSelector<object, string> = createSelector(
  selectCoreState,
  (state: CoreState): string => {
    const device = state.userDevice;
    return ((device.isMobile || device.isTablet) ? device.mobileOS : device.desktopOS) || '';
  }
);

export const selectUuid: MemoizedSelector<object, string> = createSelector(
  selectCoreState,
  (state: CoreState): string => state.uuid
);
