import { DeviceState, userDevice } from 'src/app/shared/models/userDevice';

export interface AppLayout {
  pageSize: PageSize;
  sidebarMode: SidebarMode;
}

export enum PageSize {
  small,
  medium,
  large
}

export enum SidebarMode {
  opened,
  closed
}

export enum SensitiveDataVisibilityMode {
  visible,
  hidden
}

export interface CoreState {
  error?: string;
  layout: AppLayout;
  sensitiveDataVisibilityMode: SensitiveDataVisibilityMode;
  touchStartY?: any;
  overscrolling: boolean;
  lastClickTime: number;
  userDevice: DeviceState;
  deviceType: string;
  uuid: string;
  imei: string;
}

export const initialState: CoreState = {
  layout: {
    pageSize: PageSize.medium,
    sidebarMode: SidebarMode.opened
  },
  sensitiveDataVisibilityMode: SensitiveDataVisibilityMode.hidden,
  overscrolling: false,
  lastClickTime: Date.now(),
  userDevice: userDevice(),
  deviceType: null as any,
  uuid: null as any,
  imei: null as any
};
