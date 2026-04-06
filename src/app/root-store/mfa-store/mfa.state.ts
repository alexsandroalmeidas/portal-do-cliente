export interface MfaState {
  isLoading?: boolean;
  error?: any;
  pinSmsError?: any;
  pinEmailError?: any;
  verificationCompletedError?: any;
  pinIdSms: string;
  pinIdEmail: string;
  phoneNumber: string;
  verifiedPinSms: boolean;
  verifiedPinEmail: boolean;
  verificationCompleted: boolean;
  verifiyShowMfa: boolean;
}

export const initialState: MfaState = {
  isLoading: false,
  error: null,
  pinIdSms: null as any,
  pinIdEmail: null as any,
  phoneNumber: null as any,
  verifiedPinSms: null as any,
  verifiedPinEmail: null as any,
  verificationCompleted: null as any,
  pinSmsError: null as any,
  pinEmailError: null as any,
  verificationCompletedError: null as any,
  verifiyShowMfa: null as any
};
