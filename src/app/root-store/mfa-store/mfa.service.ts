import { ApiResult, GenericApiResult } from '@/shared/models/api-result';
import { ProxyRequest } from '@/shared/models/proxy-request';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as forge from 'node-forge';
import { from, lastValueFrom, Observable, throwError } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { environment as env } from '../../../environments/environment';
import {
  ResendPinEmailResponse,
  ResendPinSmsResponse,
  SendPinEmailResponse,
  SendPinSmsResponse,
  VerificationCompletedResponse,
  VerifyPinEmailResponse,
  VerifyPinSmsResponse,
  VerifyShowMfaResponse
} from './mfa.models';

export function encryptEmail(email: string, publicKey: string): string {
  const rsa = forge.pki.publicKeyFromPem(
    `-----BEGIN PUBLIC KEY-----\n${publicKey}\n-----END PUBLIC KEY-----`
  );
  const encrypted = rsa.encrypt(email, 'RSA-OAEP', {
    md: forge.md.sha256.create()
  });
  return forge.util.encode64(encrypted);
}

@Injectable()
export class MfaService {
  private readonly proxyUrl = `${env.proxyBaseUrl}/bff/proxy/mfa`;

  constructor(private http: HttpClient) {}

  private publicKey: string | null = null;
  emailRequired = 'E-mail é obrigatório.';
  phoneNumberRequired = 'Número de telefone é obrigatório.';
  pinIdRequired = 'PinId é obrigatório.';
  pinCodeRequired = 'PinCode é obrigatório.';

  async loadPublicKey(): Promise<void> {
    if (!this.publicKey) {
      const key = await lastValueFrom(
        this.http.get('assets/publicKey.txt', { responseType: 'text' })
      );
      this.publicKey = key.trim();
    }
  }

  getPublicKey(): string {
    if (!this.publicKey) throw new Error('Chave pública ainda não foi carregada.');
    return this.publicKey;
  }

  postSendPinSms(
    userName: string,
    phoneNumber: string
  ): Observable<GenericApiResult<SendPinSmsResponse>> {
    if (!userName || userName.trim() === '') {
      console.log(this.emailRequired);
      return throwError(() => new Error(this.emailRequired));
    }

    if (!phoneNumber || phoneNumber.trim() === '') {
      console.log(this.phoneNumberRequired);
      return throwError(() => new Error(this.phoneNumberRequired));
    }

    return from(this.loadPublicKey()).pipe(
      switchMap(() => {
        const encryptedEmail = encryptEmail(userName, this.getPublicKey());

        const phoneNumberHasDDI = phoneNumber.slice(0, 2) === '55';

        const proxyRequest: ProxyRequest = {
          method: 'POST',
          path: `api/mfa/send-pin-sms`,
          body: {
            userName: encryptedEmail,
            phoneNumber: phoneNumberHasDDI ? phoneNumber : `55${phoneNumber}`
          }
        };

        return this.http
          .post<GenericApiResult<SendPinSmsResponse>>(`${this.proxyUrl}`, proxyRequest)
          .pipe(take(1));
      })
    );
  }

  postSendPinEmail(email: string): Observable<GenericApiResult<SendPinEmailResponse>> {
    if (!email || email.trim() === '') {
      console.log(this.emailRequired);
      return throwError(() => new Error(this.emailRequired));
    }

    return from(this.loadPublicKey()).pipe(
      switchMap(() => {
        const proxyRequest: ProxyRequest = {
          method: 'POST',
          path: `api/mfa/send-pin-email`,
          body: {
            email: encryptEmail(email, this.getPublicKey())
          }
        };

        return this.http
          .post<GenericApiResult<SendPinEmailResponse>>(`${this.proxyUrl}`, proxyRequest)
          .pipe(take(1));
      })
    );
  }

  postResendPinSms(
    userName: string,
    pinId: string
  ): Observable<GenericApiResult<ResendPinSmsResponse>> {
    if (!userName || userName.trim() === '') {
      console.log(this.emailRequired);
      return throwError(() => new Error(this.emailRequired));
    }

    if (!pinId || pinId.trim() === '') {
      console.log(this.pinIdRequired);
      return throwError(() => new Error(this.pinIdRequired));
    }

    return from(this.loadPublicKey()).pipe(
      switchMap(() => {
        const proxyRequest: ProxyRequest = {
          method: 'POST',
          path: `api/mfa/resend-pin-sms`,
          body: {
            userName: encryptEmail(userName, this.getPublicKey()),
            pinId
          }
        };

        return this.http
          .post<GenericApiResult<ResendPinSmsResponse>>(`${this.proxyUrl}`, proxyRequest)
          .pipe(take(1));
      })
    );
  }

  postResendPinEmail(
    email: string,
    pinId: string
  ): Observable<GenericApiResult<ResendPinEmailResponse>> {
    if (!email || email.trim() === '') {
      console.log(this.emailRequired);
      return throwError(() => new Error(this.emailRequired));
    }

    if (!pinId || pinId.trim() === '') {
      console.log(this.pinIdRequired);
      return throwError(() => new Error(this.pinIdRequired));
    }

    return from(this.loadPublicKey()).pipe(
      switchMap(() => {
        const proxyRequest: ProxyRequest = {
          method: 'POST',
          path: `api/mfa/resend-pin-email`,
          body: {
            userName: encryptEmail(email, this.getPublicKey()),
            pinId
          }
        };

        return this.http
          .post<GenericApiResult<ResendPinEmailResponse>>(`${this.proxyUrl}`, proxyRequest)
          .pipe(take(1));
      })
    );
  }

  postVerifyPinSms(
    userName: string,
    pinId: string,
    pinCode: string
  ): Observable<GenericApiResult<VerifyPinSmsResponse>> {
    if (!userName || userName.trim() === '') {
      console.log(this.emailRequired);
      return throwError(() => new Error(this.emailRequired));
    }

    if (!pinId || pinId.trim() === '') {
      console.log(this.pinIdRequired);
      return throwError(() => new Error(this.pinIdRequired));
    }

    if (!pinCode || pinCode.trim() === '') {
      console.log(this.pinCodeRequired);
      return throwError(() => new Error(this.pinCodeRequired));
    }

    return from(this.loadPublicKey()).pipe(
      switchMap(() => {
        const proxyRequest: ProxyRequest = {
          method: 'POST',
          path: `api/mfa/verify-pin-sms`,
          body: {
            userName: encryptEmail(userName, this.getPublicKey()),
            pinId,
            pinCode
          }
        };

        return this.http
          .post<GenericApiResult<VerifyPinSmsResponse>>(`${this.proxyUrl}`, proxyRequest)
          .pipe(take(1));
      })
    );
  }

  postVerifyPinEmail(
    email: string,
    pinId: string,
    pinCode: string
  ): Observable<GenericApiResult<VerifyPinEmailResponse>> {
    if (!email || email.trim() === '') {
      console.log(this.emailRequired);
      return throwError(() => new Error(this.emailRequired));
    }

    if (!pinId || pinId.trim() === '') {
      console.log(this.pinIdRequired);
      return throwError(() => new Error(this.pinIdRequired));
    }

    if (!pinCode || pinCode.trim() === '') {
      console.log(this.pinCodeRequired);
      return throwError(() => new Error(this.pinCodeRequired));
    }

    return from(this.loadPublicKey()).pipe(
      switchMap(() => {
        const proxyRequest: ProxyRequest = {
          method: 'POST',
          path: `api/mfa/verify-pin-email`,
          body: {
            email: encryptEmail(email, this.getPublicKey()),
            pinId,
            pinCode
          }
        };

        return this.http
          .post<GenericApiResult<VerifyPinEmailResponse>>(`${this.proxyUrl}`, proxyRequest)
          .pipe(take(1));
      })
    );
  }

  postVerificationCompleted(
    email: string
  ): Observable<GenericApiResult<VerificationCompletedResponse>> {
    if (!email || email.trim() === '') {
      console.log(this.emailRequired);
      return throwError(() => new Error(this.emailRequired));
    }

    return from(this.loadPublicKey()).pipe(
      switchMap(() => {
        const proxyRequest: ProxyRequest = {
          method: 'POST',
          path: `api/mfa/verification-completed`,
          body: {
            email: encryptEmail(email, this.getPublicKey())
          }
        };

        return this.http
          .post<GenericApiResult<VerificationCompletedResponse>>(`${this.proxyUrl}`, proxyRequest)
          .pipe(take(1));
      })
    );
  }

  verifyShowMfa(email: string): Observable<GenericApiResult<VerifyShowMfaResponse>> {
    if (!email || email.trim() === '') {
      console.log(this.emailRequired);
      return throwError(() => new Error(this.emailRequired));
    }

    return from(this.loadPublicKey()).pipe(
      switchMap(() => {
        const proxyRequest: ProxyRequest = {
          method: 'POST',
          path: `api/mfa/verify-show-mfa`,
          body: {
            email: encryptEmail(email, this.getPublicKey())
          }
        };

        return this.http
          .post<GenericApiResult<VerifyShowMfaResponse>>(`${this.proxyUrl}`, proxyRequest)
          .pipe(take(1));
      })
    );
  }

  verifiedMfa(email: string): Observable<ApiResult> {
    if (!email || email.trim() === '') {
      console.log(this.emailRequired);
      return throwError(() => new Error(this.emailRequired));
    }

    return from(this.loadPublicKey()).pipe(
      switchMap(() => {
        const proxyRequest: ProxyRequest = {
          method: 'POST',
          path: `api/mfa/verified-mfa`,
          body: {
            email: encryptEmail(email, this.getPublicKey())
          }
        };

        return this.http.post<ApiResult>(`${this.proxyUrl}`, proxyRequest).pipe(take(1));
      })
    );
  }
}
