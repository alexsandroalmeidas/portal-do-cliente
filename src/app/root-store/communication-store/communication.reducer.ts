import { environment } from '@/environments/environment';
import { Actions, ActionTypes } from './communication.actions';
import { Banner, BannerImageWithFileUrl, Notification } from './communication.models';
import { CommunicationState, initialState } from './communication.state';

export function featureReducer(state = initialState, action: Actions): CommunicationState {
  switch (action.type) {
    case ActionTypes.MARK_NOTIFICATION_DISPLAYED_SUCCESS: {
      const { id } = action.payload;

      const notifications = state.notifications.map((obj) => {
        if (obj.id === id) {
          return { ...obj, displayed: true };
        }

        return obj;
      });

      return {
        ...state,
        notifications: Array.from<Notification>(notifications)
      };
    }
    case ActionTypes.MARK_NOTIFICATION_READ_SUCCESS: {
      const { id } = action.payload;

      const notifications = state.notifications.map((obj) => {
        if (obj.id === id) {
          return { ...obj, read: true };
        }

        return obj;
      });

      return {
        ...state,
        notifications: Array.from<Notification>(notifications)
      };
    }
    case ActionTypes.MARK_UNREAD_NOTIFICATION_SUCCESS: {
      const { id } = action.payload;

      const notifications = state.notifications.map((obj) => {
        if (obj.id === id) {
          return { ...obj, read: false };
        }

        return obj;
      });

      return {
        ...state,
        notifications: Array.from<Notification>(notifications)
      };
    }
    case ActionTypes.DELETE_NOTIFICATION_SUCCESS: {
      const { id } = action.payload;

      const notifications = state.notifications.filter((m) => m.id !== id);

      return {
        ...state,
        notifications,
        notificationDeleted: true
      };
    }
    case ActionTypes.NEW_NOTIFICATION_RECEIVED: {
      const { notification } = action.payload;

      const notifications = [notification, ...state.notifications];

      return {
        ...state,
        notifications
      };
    }
    case ActionTypes.REGISTER_MESSAGE_SUCCESS: {
      const { message: result } = action.payload;

      return {
        ...state,
        messageInclusionRegistration: result
      };
    }
    case ActionTypes.UPDATE_MESSAGE_SUCCESS: {
      const { message } = action.payload;

      return {
        ...state,
        messageUpdateRegistration: message
      };
    }
    case ActionTypes.DELETE_MESSAGE_REGISTRATION_SUCCESS: {
      const { message } = action.payload;

      return {
        ...state,
        messageExclusionRegistration: message
      };
    }
    case ActionTypes.GET_MESSAGE_REGISTRATION_SUCCESS: {
      const { message } = action.payload;

      const links = message?.links.map((x) => {
        return {
          ...x,
          readDescription: x.read ? 'Sim' : 'Não'
        };
      });

      return {
        ...state,
        messageRegistration: {
          ...message,
          links
        }
      };
    }
    case ActionTypes.REGISTRATION_MESSAGE_SUCCESS: {
      return {
        ...state,
        messageInclusionRegistration: undefined,
        messageUpdateRegistration: undefined,
        messageExclusionRegistration: undefined,
        messageNotified: undefined
      };
    }
    case ActionTypes.NOTIFY_REGISTRATION_MESSAGE_SUCCESS: {
      const { message } = action.payload;

      return {
        ...state,
        messageNotified: message
      };
    }
    case ActionTypes.NOTIFIED_REGISTRATION_MESSAGE_SUCCESS: {
      return {
        ...state,
        messageNotified: null as any
      };
    }
    case ActionTypes.LIST_MESSAGES_REGISTRATION_SUCCESS: {
      const { messages } = action.payload;

      const newMensagens = (messages ?? []).map((item) => {
        const statusDescription =
          item.status === 0
            ? 'Em Rascunho'
            : item.status === 1
            ? 'Notificado'
            : item.status === 2 || !!item.excludionDate
            ? 'Excluído'
            : 'N/A';

        return {
          ...item,
          statusDescription: statusDescription
        };
      });

      return {
        ...state,
        messages: newMensagens
      };
    }
    case ActionTypes.LIST_NOTIFICATIONS_SUCCESS: {
      const { notifications } = action.payload;

      return {
        ...state,
        notifications: Array.from<Notification>(notifications ?? []),
        notificationDeleted: false
      };
    }
    case ActionTypes.GET_NOTIFICATION_SUCCESS: {
      const { notification } = action.payload;

      return {
        ...state,
        notification
      };
    }
    case ActionTypes.GET_BANNER_REGISTRATION_SUCCESS: {
      const { response } = action.payload;

      let updatedPortalImage = null;
      let updatedAppImage = null;

      if (response.result) {
        // Adicionando o `fileUrl` ao portalImage
        updatedPortalImage = response.result.portalImage
          ? ({
              ...response.result.portalImage,
              fileUrl: `${environment.proxyBaseUrl}/bff/download/communication/api/banners/download/${response.result.portalImage.fileName}`
            } as BannerImageWithFileUrl)
          : null;

        updatedAppImage = response.result.appImage
          ? ({
              ...response.result.appImage,
              fileUrl: `${environment.proxyBaseUrl}/bff/download/communication/api/banners/download/${response.result.appImage.fileName}`
            } as BannerImageWithFileUrl)
          : null;
      }

      return {
        ...state,
        banner: {
          ...response.result,
          portalImage: updatedPortalImage || null,
          appImage: updatedAppImage || null
        } as Banner
      };
    }

    case ActionTypes.ASSOCIATE_USER_CUSTOMER_SUCCESS: {
      return {
        ...state,
        documentNumber: action.payload.uid
      };
    }

    case ActionTypes.ADD_BANNER_SUCCESS: {
      const { response } = action.payload;

      return {
        ...state,
        bannerInclusionRegistration: response.result
      };
    }
    case ActionTypes.UPDATE_BANNER_SUCCESS: {
      const { response } = action.payload;

      return {
        ...state,
        bannerUpdateRegistration: response.result
      };
    }
    case ActionTypes.DELETE_BANNER_REGISTRATION_SUCCESS: {
      const { response } = action.payload;

      return {
        ...state,
        bannerExclusionRegistration: response.result
      };
    }
    case ActionTypes.ADDED_BANNER_SUCCESS: {
      return {
        ...state,
        bannerInclusionRegistration: null as any,
        bannerUpdateRegistration: null as any,
        bannerExclusionRegistration: null as any
      };
    }
    case ActionTypes.LIST_BANNERS_REGISTRATION_SUCCESS: {
      const { response } = action.payload;

      return {
        ...state,
        banners: response?.result?.filter((m) => m !== null && !m.excluded) ?? []
      };
    }
    case ActionTypes.LIST_ACTIVE_BANNERS_SUCCESS: {
      const { response } = action.payload;

      return {
        ...state,
        activeBanners: response?.result?.filter((m) => m !== null && !m.excluded) ?? []
      };
    }
    case ActionTypes.DISABLE_PUSH_NOTIFICATIONS: {
      const { pushNotificationsSettings } = state;

      return {
        ...state,
        pushNotificationsSettings: {
          ...pushNotificationsSettings,
          enabled: false
        }
      };
    }
    case ActionTypes.ENABLE_PUSH_NOTIFICATIONS: {
      const { pushNotificationsSettings } = state;

      return {
        ...state,
        pushNotificationsSettings: {
          ...pushNotificationsSettings,
          enabled: true
        }
      };
    }
    case ActionTypes.SUBSCRIBE_PUSH_NOTIFICATIONS: {
      const { pushNotificationsSettings } = state;
      const { subscription } = action.payload;

      return {
        ...state,
        pushNotificationsSettings: {
          ...pushNotificationsSettings,
          subscription: subscription
        }
      };
    }
    case ActionTypes.UNSUBSCRIBE_PUSH_NOTIFICATIONS: {
      const { pushNotificationsSettings } = state;

      return {
        ...state,
        pushNotificationsSettings: {
          ...pushNotificationsSettings,
          subscription: null
        }
      };
    }
    default:
      return {
        ...state
      };
  }
}
