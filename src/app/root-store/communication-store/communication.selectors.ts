import {
  createFeatureSelector,
  createSelector,
  MemoizedSelector,
} from '@ngrx/store';
import {
  Banner,
  Message,
  Notification,
  PushNotificationsSettings,
} from './communication.models';
import { CommunicationState } from './communication.state';

const selectCommunicationState =
  createFeatureSelector<CommunicationState>('communication');

export const selectMessageRegistration: MemoizedSelector<
  object,
  Message | undefined
> = createSelector(
  selectCommunicationState,
  (state: CommunicationState): Message | undefined => state.messageRegistration
);

export const selectMessageInclusionRegistration: MemoizedSelector<
  object,
  Message | undefined
> = createSelector(
  selectCommunicationState,
  (state: CommunicationState): Message | undefined =>
    state.messageInclusionRegistration
);

export const selectMessageUpdateRegistration: MemoizedSelector<
  object,
  Message | undefined
> = createSelector(
  selectCommunicationState,
  (state: CommunicationState): Message | undefined =>
    state.messageUpdateRegistration
);

export const selectMessageExclusionRegistration: MemoizedSelector<
  object,
  Message | undefined
> = createSelector(
  selectCommunicationState,
  (state: CommunicationState): Message | undefined =>
    state.messageExclusionRegistration
);

export const selectMessageNotified: MemoizedSelector<
  object,
  Message | undefined
> = createSelector(
  selectCommunicationState,
  (state: CommunicationState): Message | undefined => state.messageNotified
);

export const selectMessages: MemoizedSelector<object, Message[]> =
  createSelector(
    selectCommunicationState,
    (state: CommunicationState): Message[] => state.messages
  );

export const selectNotifications: MemoizedSelector<object, Notification[]> =
  createSelector(
    selectCommunicationState,
    (state: CommunicationState): Notification[] => state.notifications
  );

export const selectNotification: MemoizedSelector<object, Notification> =
  createSelector(
    selectCommunicationState,
    (state: CommunicationState): Notification => state.notification
  );

export const selectNotificationDeleted: MemoizedSelector<object, boolean> =
  createSelector(
    selectCommunicationState,
    (state: CommunicationState): boolean => state.notificationDeleted
  );

export const selectBanners: MemoizedSelector<object, Banner[]> = createSelector(
  selectCommunicationState,
  (state: CommunicationState): Banner[] => state.banners
);

export const selectBanner: MemoizedSelector<object, Banner> = createSelector(
  selectCommunicationState,
  (state: CommunicationState): Banner => state.banner
);

export const selectActiveBanners: MemoizedSelector<object, Banner[]> =
  createSelector(
    selectCommunicationState,
    (state: CommunicationState): Banner[] => state.activeBanners
  );

export const selectBannerExclusionRegistration: MemoizedSelector<
  object,
  Banner | undefined
> = createSelector(
  selectCommunicationState,
  (state: CommunicationState): Banner | undefined =>
    state.bannerExclusionRegistration
);

export const selectBannerUpdateRegistration: MemoizedSelector<
  object,
  Banner | undefined
> = createSelector(
  selectCommunicationState,
  (state: CommunicationState): Banner | undefined =>
    state.bannerUpdateRegistration
);

export const selectBannerInclusionRegistration: MemoizedSelector<
  object,
  Banner | undefined
> = createSelector(
  selectCommunicationState,
  (state: CommunicationState): Banner | undefined =>
    state.bannerInclusionRegistration
);

export const selectPushNotificationSettings: MemoizedSelector<
  object,
  PushNotificationsSettings
> = createSelector(
  selectCommunicationState,
  (state: CommunicationState): PushNotificationsSettings =>
    state.pushNotificationsSettings
);
