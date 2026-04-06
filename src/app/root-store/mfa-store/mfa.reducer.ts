import { Actions, ActionTypes } from './mfa.actions';
import { initialState, MfaState } from './mfa.state';

export function featureReducer(state = initialState, action: Actions): MfaState {
  switch (action.type) {
    case ActionTypes.SEND_PIN_SMS: {
      let { phoneNumber } = action.payload;

      return {
        ...state,
        phoneNumber
      };
    }
    case ActionTypes.SEND_PIN_EMAIL:
    case ActionTypes.VERIFY_PIN_EMAIL:
    case ActionTypes.VERIFY_SHOW_MFA:
    case ActionTypes.RESEND_PIN_EMAIL:
    case ActionTypes.RESEND_PIN_SMS:
    case ActionTypes.VERIFY_PIN_SMS: {
      return {
        ...state,
        verifiyShowMfa: false
      };
    }
    case ActionTypes.SEND_PIN_SMS_SUCCESS: {
      let { pinIdSms } = action.payload;

      return {
        ...state,
        pinIdSms
      };
    }
    case ActionTypes.VERIFIED_MFA: {
      return {
        ...state,
        verifiyShowMfa: false
      };
    }
    case ActionTypes.VERIFY_SHOW_MFA_SUCCESS: {
      let { response } = action.payload;

      return {
        ...state,
        verifiyShowMfa: response
      };
    }
    case ActionTypes.SEND_PIN_SMS_FAILURE: {
      let { error } = action.payload;

      return {
        ...state,
        pinSmsError: error
      };
    }
    case ActionTypes.SEND_PIN_EMAIL_SUCCESS: {
      let { pinIdEmail } = action.payload;

      return {
        ...state,
        pinIdEmail
      };
    }
    case ActionTypes.SEND_PIN_EMAIL_FAILURE: {
      let { error } = action.payload;

      return {
        ...state,
        pinEmailError: error
      };
    }
    case ActionTypes.RESEND_PIN_SMS_SUCCESS: {
      let { pinIdSms } = action.payload;

      return {
        ...state,
        pinIdSms
      };
    }
    case ActionTypes.RESEND_PIN_SMS_FAILURE: {
      let { error } = action.payload;

      return {
        ...state,
        pinSmsError: error
      };
    }
    case ActionTypes.RESEND_PIN_EMAIL_SUCCESS: {
      let { pinIdEmail } = action.payload;

      return {
        ...state,
        pinIdEmail
      };
    }
    case ActionTypes.RESEND_PIN_EMAIL_FAILURE: {
      let { error } = action.payload;

      return {
        ...state,
        pinEmailError: error
      };
    }
    case ActionTypes.VERIFY_PIN_SMS_SUCCESS: {
      let { verifiedPinSms } = action.payload;

      return {
        ...state,
        verifiedPinSms
      };
    }
    case ActionTypes.VERIFY_PIN_SMS_FAILURE: {
      let { error } = action.payload;

      return {
        ...state,
        pinSmsError: error
      };
    }
    case ActionTypes.SET_VERIFY_PIN_SMS: {
      let { verifiedPinSms } = action.payload;

      return {
        ...state,
        verifiedPinSms
      };
    }
    case ActionTypes.SET_VERIFY_PIN_EMAIL: {
      let { verifiedPinEmail } = action.payload;

      return {
        ...state,
        verifiedPinEmail
      };
    }
    case ActionTypes.VERIFY_PIN_EMAIL_SUCCESS: {
      let { verifiedPinEmail } = action.payload;

      return {
        ...state,
        verifiedPinEmail
      };
    }
    case ActionTypes.VERIFICATION_COMPLETED_SUCCESS: {
      let { response } = action.payload;

      const isSuccessful = response.result?.isSuccessful ?? false;

      return {
        ...state,
        verificationCompleted: isSuccessful,
        verificationCompletedError: isSuccessful ? null : response.result?.failureMessage
      };
    }
    case ActionTypes.VERIFICATION_COMPLETED_FAILURE: {
      let { error } = action.payload;

      return {
        ...state,
        verificationCompleted: false,
        verificationCompletedError: error
      };
    }
    case ActionTypes.SET_NO_ERROR_PIN_SMS: {
      return {
        ...state,
        pinSmsError: null
      };
    }
    case ActionTypes.SET_NO_ERROR_PIN_EMAIL: {
      return {
        ...state,
        pinEmailError: null
      };
    }
    case ActionTypes.SET_NO_ERROR_VERIFICATION_COMPLETED: {
      return {
        ...state,
        verificationCompletedError: null
      };
    }

    case ActionTypes.RESET_MFA_STATE:
    default:
      return {
        ...state
      };
  }
}
