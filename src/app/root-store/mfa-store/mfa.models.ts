export interface SendPinSmsResponse {
  userName: string;
  phoneNumber: string;
  pinId: string;
}

export interface ResendPinSmsResponse {
  userName: string;
  phoneNumber: string;
  pinId: string;
}

export interface VerifyPinSmsResponse {
  userName: string;
  pinId: string;
  verified: boolean;
}

export interface SendPinEmailResponse {
  userName: string;
  pinId: string;
}

export interface ResendPinEmailResponse {
  userName: string;
  phoneNumber: string;
  pinId: string;
}

export interface VerifyPinEmailResponse {
  userName: string;
  pinId: string;
  verified: boolean;
}

export interface VerifyShowMfaResponse {
  showMfa: boolean;
}

export interface VerificationCompletedResponse {
  userName: string;
  phoneNumber: string;
  pinId: string;
}
