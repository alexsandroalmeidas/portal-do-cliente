import { Action } from '@ngrx/store';
import { GenericApiResult } from 'src/app/shared/models/api-result';
import { AddPhoneNumberResponse } from '../administration-store/administration.models';

export enum ActionTypes {
  SEND_PIN_SMS = '@app/mfa/send-pin-sms',
  SEND_PIN_SMS_SUCCESS = '@app/mfa/send-pin-sms-success',
  SEND_PIN_SMS_FAILURE = '@app/mfa/send-pin-sms-failue',
  RESEND_PIN_SMS = '@app/mfa/resend-pin-sms',
  RESEND_PIN_SMS_SUCCESS = '@app/mfa/send-pin-sms-success',
  RESEND_PIN_SMS_FAILURE = '@app/mfa/send-pin-sms-failure',
  VERIFY_PIN_SMS = '@app/mfa/verify-pin-sms',
  SET_VERIFY_PIN_SMS = '@app/mfa/set-verify-pin-sms',
  VERIFY_PIN_SMS_SUCCESS = '@app/mfa/verify-pin-sms-success',
  VERIFY_PIN_SMS_FAILURE = '@app/mfa/verify-pin-sms-failure',
  SEND_PIN_EMAIL = '@app/mfa/send-pin-email',
  SEND_PIN_EMAIL_SUCCESS = '@app/mfa/send-pin-email-success',
  SEND_PIN_EMAIL_FAILURE = '@app/mfa/send-pin-email-failure',
  VERIFY_PIN_EMAIL = '@app/mfa/verify-pin-email',
  VERIFY_PIN_EMAIL_SUCCESS = '@app/mfa/verify-pin-email-success',
  VERIFY_PIN_EMAIL_FAILURE = '@app/mfa/verify-pin-email-failure',
  SET_VERIFY_PIN_EMAIL = '@app/mfa/set-verify-pin-email',
  RESEND_PIN_EMAIL = '@app/mfa/resend-pin-email',
  RESEND_PIN_EMAIL_SUCCESS = '@app/mfa/resend-pin-email-success',
  RESEND_PIN_EMAIL_FAILURE = '@app/mfa/resend-pin-email-failure',
  VERIFICATION_COMPLETED = '@app/mfa/verification-completed',
  VERIFICATION_COMPLETED_SUCCESS = '@app/mfa/verification-completed-success',
  VERIFICATION_COMPLETED_FAILURE = '@app/mfa/verification-completed-failure',
  SET_NO_ERROR_PIN_SMS = '@app/mfa/set-no-error-pin-sms',
  SET_NO_ERROR_PIN_EMAIL = '@app/mfa/set-no-error-pin-email',
  SET_NO_ERROR_VERIFICATION_COMPLETED = '@app/mfa/set-no-error-verification-completed',
  VERIFY_SHOW_MFA = '@app/mfa/verify-show-mfa',
  VERIFY_SHOW_MFA_SUCCESS = '@app/mfa/verify-show-mfa-success',
  VERIFY_SHOW_MFA_FAILURE = '@app/mfa/verify-show-mfa-failure',
  VERIFIED_MFA = '@app/mfa/verified-mfa',
  VERIFIED_MFA_SUCCESS = '@app/mfa/verified-mfa-success',
  VERIFIED_MFA_FAILURE = '@app/mfa/verified-mfa-failure',
  RESET_MFA_STATE = '@app/identity/reset-mfa-state'
}

export class SendPinSmsAction implements Action {
  readonly type = ActionTypes.SEND_PIN_SMS;
  constructor(public payload: { phoneNumber: string }) {}
}

export class SendPinSmsSuccessAction implements Action {
  readonly type = ActionTypes.SEND_PIN_SMS_SUCCESS;
  constructor(public payload: { pinIdSms: string }) {}
}

export class SendPinSmsFailureAction implements Action {
  readonly type = ActionTypes.SEND_PIN_SMS_FAILURE;
  constructor(public payload: { error: any }) {}
}

export class ResendPinSmsAction implements Action {
  readonly type = ActionTypes.RESEND_PIN_SMS;
}

export class ResendPinSmsSuccessAction implements Action {
  readonly type = ActionTypes.RESEND_PIN_SMS_SUCCESS;
  constructor(public payload: { pinIdSms: string }) {}
}

export class ResendPinSmsFailureAction implements Action {
  readonly type = ActionTypes.RESEND_PIN_SMS_FAILURE;
  constructor(public payload: { error: any }) {}
}

export class VerifyPinSmsAction implements Action {
  readonly type = ActionTypes.VERIFY_PIN_SMS;
  constructor(public payload: { pinCode: string }) {}
}

export class VerifyPinFailureAction implements Action {
  readonly type = ActionTypes.VERIFY_PIN_SMS_FAILURE;
  constructor(public payload: { error: any }) {}
}

export class SetVerifyPinSmsAction implements Action {
  readonly type = ActionTypes.SET_VERIFY_PIN_SMS;
  constructor(public payload: { verifiedPinSms: boolean }) {}
}

export class VerifyPinSmsSuccessAction implements Action {
  readonly type = ActionTypes.VERIFY_PIN_SMS_SUCCESS;
  constructor(public payload: { verifiedPinSms: boolean }) {}
}

export class VerifyPinSmsFailureAction implements Action {
  readonly type = ActionTypes.VERIFY_PIN_SMS_FAILURE;
  constructor(public payload: { error: any }) {}
}

export class SendPinEmailAction implements Action {
  readonly type = ActionTypes.SEND_PIN_EMAIL;
}

export class SendPinEmailSuccessAction implements Action {
  readonly type = ActionTypes.SEND_PIN_EMAIL_SUCCESS;
  constructor(public payload: { pinIdEmail: string }) {}
}

export class SendPinEmailFailureAction implements Action {
  readonly type = ActionTypes.SEND_PIN_EMAIL_FAILURE;
  constructor(public payload: { error: any }) {}
}

export class VerifyPinEmailAction implements Action {
  readonly type = ActionTypes.VERIFY_PIN_EMAIL;
  constructor(public payload: { pinCode: string }) {}
}

export class VerifyPinEmailSuccessAction implements Action {
  readonly type = ActionTypes.VERIFY_PIN_EMAIL_SUCCESS;
  constructor(public payload: { verifiedPinEmail: boolean }) {}
}

export class VerifyPinEmailFailureAction implements Action {
  readonly type = ActionTypes.VERIFY_PIN_EMAIL_FAILURE;
  constructor(public payload: { error: any }) {}
}

export class SetVerifyPinEmailAction implements Action {
  readonly type = ActionTypes.SET_VERIFY_PIN_EMAIL;
  constructor(public payload: { verifiedPinEmail: boolean }) {}
}

export class ResendPinEmailAction implements Action {
  readonly type = ActionTypes.RESEND_PIN_EMAIL;
}

export class ResendPinEmailSuccessAction implements Action {
  readonly type = ActionTypes.RESEND_PIN_EMAIL_SUCCESS;
  constructor(public payload: { pinIdEmail: string }) {}
}

export class ResendPinEmailFailureAction implements Action {
  readonly type = ActionTypes.RESEND_PIN_EMAIL_FAILURE;
  constructor(public payload: { error: any }) {}
}

export class VerificationCompletedAction implements Action {
  readonly type = ActionTypes.VERIFICATION_COMPLETED;
}

export class VerificationCompletedSuccessAction implements Action {
  readonly type = ActionTypes.VERIFICATION_COMPLETED_SUCCESS;
  constructor(
    public payload: { response: GenericApiResult<AddPhoneNumberResponse>; email: string }
  ) {}
}

export class VerificationCompletedFailureAction implements Action {
  readonly type = ActionTypes.VERIFICATION_COMPLETED_FAILURE;
  constructor(public payload: { error: any }) {}
}

export class SetNoErrorPinSmsAction implements Action {
  readonly type = ActionTypes.SET_NO_ERROR_PIN_SMS;
}

export class SetNoErrorPinEmailAction implements Action {
  readonly type = ActionTypes.SET_NO_ERROR_PIN_EMAIL;
}

export class SetNoErrorVerificationCompletedAction implements Action {
  readonly type = ActionTypes.SET_NO_ERROR_VERIFICATION_COMPLETED;
}

export class VerifyShowMfaAction implements Action {
  readonly type = ActionTypes.VERIFY_SHOW_MFA;
}

export class VerifyShowMfaSuccessAction implements Action {
  readonly type = ActionTypes.VERIFY_SHOW_MFA_SUCCESS;
  constructor(public payload: { response: boolean }) {}
}

export class VerifyShowMfaFailureAction implements Action {
  readonly type = ActionTypes.VERIFY_SHOW_MFA_FAILURE;
  constructor(public payload: { error: any }) {}
}

export class VerifiedMfaAction implements Action {
  readonly type = ActionTypes.VERIFIED_MFA;
}

export class VerifiedMfaSuccessAction implements Action {
  readonly type = ActionTypes.VERIFIED_MFA_SUCCESS;
}

export class VerifiedMfaFailureAction implements Action {
  readonly type = ActionTypes.VERIFIED_MFA_FAILURE;
  constructor(public payload: { error: any }) {}
}

export class ResetMfaStateAction implements Action {
  readonly type = ActionTypes.RESET_MFA_STATE;
}

export type Actions =
  | SendPinSmsAction
  | SendPinSmsSuccessAction
  | SendPinSmsFailureAction
  | ResendPinSmsAction
  | ResendPinSmsSuccessAction
  | ResendPinSmsFailureAction
  | VerifyPinSmsAction
  | VerifyPinFailureAction
  | SetVerifyPinSmsAction
  | VerifyPinSmsSuccessAction
  | VerifyPinSmsFailureAction
  | SendPinEmailAction
  | SendPinEmailSuccessAction
  | SendPinEmailFailureAction
  | VerifyPinEmailAction
  | VerifyPinEmailSuccessAction
  | VerifyPinEmailFailureAction
  | SetVerifyPinEmailAction
  | ResendPinEmailAction
  | ResendPinEmailSuccessAction
  | ResendPinEmailFailureAction
  | VerificationCompletedAction
  | VerificationCompletedSuccessAction
  | VerificationCompletedFailureAction
  | SetNoErrorPinSmsAction
  | SetNoErrorPinEmailAction
  | SetNoErrorVerificationCompletedAction
  | VerifyShowMfaAction
  | VerifyShowMfaSuccessAction
  | VerifyShowMfaFailureAction
  | VerifiedMfaAction
  | VerifiedMfaSuccessAction
  | VerifiedMfaFailureAction
  | ResetMfaStateAction;
