
import { GenericApiResult } from '@/shared/models/api-result';
import { Action } from '@ngrx/store';
import { Banner, Message, Notification } from './communication.models';

export enum ActionTypes {
  MARK_NOTIFICATION_DISPLAYED = '@app/communication/mark-notification-displayed',
  MARK_NOTIFICATION_DISPLAYED_SUCCESS = '@app/communication/mark-notification-displayed-success',
  MARK_NOTIFICATION_READ = '@app/communication/mark-notification-read',
  MARK_NOTIFICATION_READ_SUCCESS = '@app/communication/mark-notification-read-success',
  MARK_UNREAD_NOTIFICATION = '@app/communication/mark-unread-notification',
  MARK_UNREAD_NOTIFICATION_SUCCESS = '@app/communication/mark-unread-notification-success',
  DELETE_NOTIFICATION = '@app/communication/delete-notification',
  DELETE_NOTIFICATION_SUCCESS = '@app/communication/delete-notification-success',
  NEW_NOTIFICATION_RECEIVED = '@app/communication/new-notification-received',
  REGISTER_MESSAGE = '@app/communication/register-message',
  REGISTER_MESSAGE_SUCCESS = '@app/communication/register-message-success',
  REGISTRATION_MESSAGE_SUCCESS = '@app/communication/registration-message-success',
  NOTIFY_REGISTRATION_MESSAGE = '@app/communication/notify-registration-message',
  NOTIFY_REGISTRATION_MESSAGE_SUCCESS = '@app/communication/notify-registration-message-success',
  NOTIFIED_REGISTRATION_MESSAGE_SUCCESS = '@app/communication/notified-registration-message-success',
  LIST_NOTIFICATIONS = '@app/communication/list-notifications',
  LIST_NOTIFICATIONS_SUCCESS = '@app/communication/list-notifications-success',
  GET_NOTIFICATION = '@app/communication/get-notification',
  GET_NOTIFICATION_SUCCESS = '@app/communication/get-notification-success',
  LIST_MESSAGES_REGISTRATION = '@app/communication/list-messages-registration',
  LIST_MESSAGES_REGISTRATION_SUCCESS = '@app/communication/list-messages-registration-success',
  ASSOCIATE_USER_CUSTOMER = '@app/communication/associate-user-customer',
  ASSOCIATE_USER_CUSTOMER_SUCCESS = '@app/communication/associate-user-customer-success',
  DELETE_MESSAGE_REGISTRATION = '@app/communication/delete-message-registration',
  UPDATE_MESSAGE = '@app/communication/update-message',
  UPDATE_MESSAGE_SUCCESS = '@app/communication/update-message-success',
  DELETE_MESSAGE_REGISTRATION_SUCCESS = '@app/communication/delete-message-registration-success',
  GET_MESSAGE_REGISTRATION = '@app/communication/get-message-registration',
  GET_MESSAGE_REGISTRATION_SUCCESS = '@app/communication/get-message-registration-success',
  UPDATE_BANNER = '@app/communication/update-banner',
  UPDATE_BANNER_SUCCESS = '@app/communication/update-banner-success',
  ADD_BANNER = '@app/communication/add-banner',
  ADD_BANNER_SUCCESS = '@app/communication/add-banner-success',
  ADDED_BANNER_SUCCESS = '@app/communication/added-banner-success',
  DELETE_BANNER_REGISTRATION = '@app/communication/delete-banner-registration',
  DELETE_BANNER_REGISTRATION_SUCCESS = '@app/communication/delete-banner-registration-success',
  LIST_BANNERS_REGISTRATION = '@app/communication/list-banners-registration',
  LIST_BANNERS_REGISTRATION_SUCCESS = '@app/communication/list-banners-registration-success',
  LIST_ACTIVE_BANNERS = '@app/communication/list-active-banners',
  LIST_ACTIVE_BANNERS_SUCCESS = '@app/communication/list-active-banners-success',
  DISABLE_PUSH_NOTIFICATIONS = '@app/auth/disable-push-notifications',
  ENABLE_PUSH_NOTIFICATIONS = '@app/auth/enable-push-notifications',
  SUBSCRIBE_PUSH_NOTIFICATIONS = '@app/auth/subscribe-push-notifications',
  UNSUBSCRIBE_PUSH_NOTIFICATIONS = '@app/auth/unsubscribe-push-notifications',
  GET_BANNER_REGISTRATION = '@app/communication/get-banner-registration',
  GET_BANNER_REGISTRATION_SUCCESS = '@app/communication/get-banner-registration-success',
  GENERIC_ERROR = '[@app/communication/generic-error'
}

export class GenericErrorAction implements Action {
  readonly type = ActionTypes.GENERIC_ERROR;
  constructor(public payload: { error: any }) { }
}


export class MarkNotificationDisplayedAction implements Action {
  readonly type = ActionTypes.MARK_NOTIFICATION_DISPLAYED;
  constructor(public payload: { id: number }) { }
}

export class MarkNotificationDisplayedSuccessAction implements Action {
  readonly type = ActionTypes.MARK_NOTIFICATION_DISPLAYED_SUCCESS;
  constructor(public payload: { id: number }) { }
}

export class MarkNotificationReadAction implements Action {
  readonly type = ActionTypes.MARK_NOTIFICATION_READ;
  constructor(public payload: { id: number }) { }
}

export class MarkNotificationReadSuccessAction implements Action {
  readonly type = ActionTypes.MARK_NOTIFICATION_READ_SUCCESS;
  constructor(public payload: { id: number }) { }
}

export class MarkUnreadNotificationAction implements Action {
  readonly type = ActionTypes.MARK_UNREAD_NOTIFICATION;
  constructor(public payload: { id: number }) { }
}

export class MarkUnreadNotificationSuccessAction implements Action {
  readonly type = ActionTypes.MARK_UNREAD_NOTIFICATION_SUCCESS;
  constructor(public payload: { id: number }) { }
}

export class DeleteNotificationAction implements Action {
  readonly type = ActionTypes.DELETE_NOTIFICATION;
  constructor(
    public payload: {
      id: number;
      documentNumber: string;
    }
  ) { }
}

export class DeleteNotificationSuccessAction implements Action {
  readonly type = ActionTypes.DELETE_NOTIFICATION_SUCCESS;
  constructor(public payload: { id: number }) { }
}

export class NewNotificationReceivedAction implements Action {
  readonly type = ActionTypes.NEW_NOTIFICATION_RECEIVED;
  constructor(public payload: { notification: Notification }) { }
}

export class RegisterMessageAction implements Action {
  readonly type = ActionTypes.REGISTER_MESSAGE;
  constructor(
    public payload: {
      title: string;
      text: string;
      establishments: { email: string; uid: string }[];
      pushNotification: boolean;
      allEstablishments: boolean;
    }
  ) { }
}

export class RegisterMessageSuccessAction implements Action {
  readonly type = ActionTypes.REGISTER_MESSAGE_SUCCESS;
  constructor(public payload: { message: Message }) { }
}

export class RegistrationMessageSuccessAction implements Action {
  readonly type = ActionTypes.REGISTRATION_MESSAGE_SUCCESS;
  constructor() { }
}

export class NotifyRegistrationMessageAction implements Action {
  readonly type = ActionTypes.NOTIFY_REGISTRATION_MESSAGE;
  constructor(public payload: { id: string }) { }
}

export class NotifyRegistrationMessageSuccessAction implements Action {
  readonly type = ActionTypes.NOTIFY_REGISTRATION_MESSAGE_SUCCESS;
  constructor(public payload: { message: Message }) { }
}

export class NotifiedRegistrationMessageSuccessAction implements Action {
  readonly type = ActionTypes.NOTIFIED_REGISTRATION_MESSAGE_SUCCESS;
  constructor() { }
}

export class ListNotificationsAction implements Action {
  readonly type = ActionTypes.LIST_NOTIFICATIONS;
  constructor() { }
}

export class ListNotificationsSuccessAction implements Action {
  readonly type = ActionTypes.LIST_NOTIFICATIONS_SUCCESS;
  constructor(public payload: { notifications: Notification[] }) { }
}

export class GetNotificationAction implements Action {
  readonly type = ActionTypes.GET_NOTIFICATION;
  constructor(public payload: { id: number }) { }
}

export class GetNotificationSuccessAction implements Action {
  readonly type = ActionTypes.GET_NOTIFICATION_SUCCESS;
  constructor(public payload: { notification: Notification }) { }
}

export class ListMessagesRegistrationAction implements Action {
  readonly type = ActionTypes.LIST_MESSAGES_REGISTRATION;
  constructor() { }
}

export class ListMessagesRegistrationSuccessAction implements Action {
  readonly type = ActionTypes.LIST_MESSAGES_REGISTRATION_SUCCESS;
  constructor(public payload: { messages: Message[] }) { }
}

export class AssociateUserCustomerAction implements Action {
  readonly type = ActionTypes.ASSOCIATE_USER_CUSTOMER;
  constructor() { }
}

export class AssociateUserCustomerSuccessAction implements Action {
  readonly type = ActionTypes.ASSOCIATE_USER_CUSTOMER_SUCCESS;
  constructor(public payload: { uid: string }) { }
}

export class UpdateMessageAction implements Action {
  readonly type = ActionTypes.UPDATE_MESSAGE;
  constructor(
    public payload: {
      id: number;
      title: string;
      text: string;
      establishments: { email: string; uid: string }[];
      pushNotification: boolean;
      allEstablishments: boolean;
    }
  ) { }
}

export class UpdateMessageSuccessAction implements Action {
  readonly type = ActionTypes.UPDATE_MESSAGE_SUCCESS;
  constructor(public payload: { message: Message }) { }
}

export class DeleteMessageRegistrationAction implements Action {
  readonly type = ActionTypes.DELETE_MESSAGE_REGISTRATION;
  constructor(public payload: { id: string }) { }
}

export class DeleteMessageRegistrationSuccessAction implements Action {
  readonly type = ActionTypes.DELETE_MESSAGE_REGISTRATION_SUCCESS;
  constructor(public payload: { message: Message }) { }
}

export class GetMessageRegistrationAction implements Action {
  readonly type = ActionTypes.GET_MESSAGE_REGISTRATION;
  constructor(public payload: { id: number }) { }
}

export class GetMessageRegistrationSuccessAction implements Action {
  readonly type = ActionTypes.GET_MESSAGE_REGISTRATION_SUCCESS;
  constructor(public payload: { message: Message }) { }
}

export class UpdateBannerAction implements Action {
  readonly type = ActionTypes.UPDATE_BANNER;
  constructor(
    public payload: {
      id: number;
      url?: string;
      initialDate: string;
      finalDate?: string;
      backgroundColor: string;
      portalFileType: string;
      portalFileName: string;
      appFileType: string;
      appFileName: string;
      portalFile?: File;
      appFile?: File;
    }
  ) { }
}

export class UpdateBannerSuccessAction implements Action {
  readonly type = ActionTypes.UPDATE_BANNER_SUCCESS;
  constructor(public payload: { response: GenericApiResult<Banner> }) { }
}

export class GetBannerRegistrationAction implements Action {
  readonly type = ActionTypes.GET_BANNER_REGISTRATION;
  constructor(public payload: { id: number }) { }
}

export class GetBannerRegistrationSuccessAction implements Action {
  readonly type = ActionTypes.GET_BANNER_REGISTRATION_SUCCESS;
  constructor(public payload: { response: GenericApiResult<Banner> }) { }
}

export class AddBannerAction implements Action {
  readonly type = ActionTypes.ADD_BANNER;
  constructor(
    public payload: {
      url?: string;
      initialDate: string;
      finalDate?: string;
      backgroundColor: string;
      portalFileType: string;
      portalFileName: string;
      appFileType: string;
      appFileName: string;
      portalFile?: File;
      appFile?: File;
    }
  ) { }
}

export class AddBannerSuccessAction implements Action {
  readonly type = ActionTypes.ADD_BANNER_SUCCESS;
  constructor(public payload: { response: GenericApiResult<Banner> }) { }
}

export class AddedBannerSuccessAction implements Action {
  readonly type = ActionTypes.ADDED_BANNER_SUCCESS;
  constructor() { }
}

export class DeleteBannerRegistrationAction implements Action {
  readonly type = ActionTypes.DELETE_BANNER_REGISTRATION;
  constructor(public payload: { id: string }) { }
}

export class DeleteBannerRegistrationSuccessAction implements Action {
  readonly type = ActionTypes.DELETE_BANNER_REGISTRATION_SUCCESS;
  constructor(public payload: { response: GenericApiResult<Banner> }) { }
}

export class ListBannersRegistrationAction implements Action {
  readonly type = ActionTypes.LIST_BANNERS_REGISTRATION;
  constructor() { }
}

export class ListBannersRegistrationSuccessAction implements Action {
  readonly type = ActionTypes.LIST_BANNERS_REGISTRATION_SUCCESS;
  constructor(public payload: { response: GenericApiResult<Banner[]> }) { }
}

export class ListActiveBannersAction implements Action {
  readonly type = ActionTypes.LIST_ACTIVE_BANNERS;
  constructor(public payload: {}) { }
}

export class ListActiveBannersSuccessAction implements Action {
  readonly type = ActionTypes.LIST_ACTIVE_BANNERS_SUCCESS;
  constructor(public payload: { response: GenericApiResult<Banner[]> }) { }
}

export class DisablePushNotificationsAction implements Action {
  readonly type = ActionTypes.DISABLE_PUSH_NOTIFICATIONS;
}

export class EnablePushNotificationsAction implements Action {
  readonly type = ActionTypes.ENABLE_PUSH_NOTIFICATIONS;
}

export class SubscribePushNotificationsAction implements Action {
  readonly type = ActionTypes.SUBSCRIBE_PUSH_NOTIFICATIONS;
  constructor(public payload: { subscription: PushSubscription }) { }
}

export class UnsubscribePushNotificationsAction implements Action {
  readonly type = ActionTypes.UNSUBSCRIBE_PUSH_NOTIFICATIONS;
}

export type Actions =
  | MarkNotificationDisplayedAction
  | MarkNotificationDisplayedSuccessAction
  | MarkNotificationReadAction
  | MarkNotificationReadSuccessAction
  | MarkUnreadNotificationAction
  | MarkUnreadNotificationSuccessAction
  | DeleteNotificationAction
  | DeleteNotificationSuccessAction
  | NewNotificationReceivedAction
  | RegisterMessageAction
  | RegisterMessageSuccessAction
  | RegistrationMessageSuccessAction
  | NotifyRegistrationMessageAction
  | NotifyRegistrationMessageSuccessAction
  | NotifiedRegistrationMessageSuccessAction
  | ListNotificationsAction
  | ListNotificationsSuccessAction
  | ListMessagesRegistrationAction
  | ListMessagesRegistrationSuccessAction
  | AssociateUserCustomerAction
  | AssociateUserCustomerSuccessAction
  | UpdateMessageAction
  | UpdateMessageSuccessAction
  | DeleteMessageRegistrationAction
  | DeleteMessageRegistrationSuccessAction
  | GetMessageRegistrationAction
  | GetMessageRegistrationSuccessAction
  | UpdateBannerAction
  | UpdateBannerSuccessAction
  | GetBannerRegistrationAction
  | GetBannerRegistrationSuccessAction
  | AddBannerAction
  | AddBannerSuccessAction
  | AddedBannerSuccessAction
  | DeleteBannerRegistrationAction
  | DeleteBannerRegistrationSuccessAction
  | ListBannersRegistrationAction
  | ListBannersRegistrationSuccessAction
  | ListActiveBannersAction
  | ListActiveBannersSuccessAction
  | GetNotificationAction
  | GetNotificationSuccessAction
  | DisablePushNotificationsAction
  | EnablePushNotificationsAction
  | SubscribePushNotificationsAction
  | UnsubscribePushNotificationsAction;
