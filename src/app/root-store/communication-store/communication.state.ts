import {
  Banner,
  Message,
  Notification,
  PushNotificationsSettings
} from './communication.models';

export interface CommunicationState {
  messageRegistration?: Message;
  messageExclusionRegistration?: Message;
  messageInclusionRegistration?: Message;
  messageUpdateRegistration?: Message;
  messageNotified?: Message;
  messages: Message[];
  notifications: Notification[];
  notification: Notification;
  notificationDeleted: boolean;
  documentNumber: string;
  banners: Banner[];
  banner: Banner;
  activeBanners: Banner[];
  bannerExclusionRegistration?: Banner;
  bannerUpdateRegistration?: Banner;
  bannerInclusionRegistration?: Banner;
  pushNotificationsSettings: PushNotificationsSettings;
}

export const initialState: CommunicationState = {
  messageRegistration: null as any,
  messageExclusionRegistration: null as any,
  messageInclusionRegistration: null as any,
  messageUpdateRegistration: null as any,
  messageNotified: null as any,
  messages: [],
  notifications: [],
  notification: null as any,
  notificationDeleted: false,
  documentNumber: null as any,
  banners: [],
  banner: null as any,
  activeBanners: [],
  bannerExclusionRegistration: null as any,
  bannerUpdateRegistration: null as any,
  bannerInclusionRegistration: null as any,
  pushNotificationsSettings: {
    enabled: true,
    subscription: null,
  },
};
