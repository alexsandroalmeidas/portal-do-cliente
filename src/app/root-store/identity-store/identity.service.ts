import { ProxyRequest } from '@/shared/models/proxy-request';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, switchMap, take } from 'rxjs';

import { environment as env } from '../../../environments/environment';
import { ApiResponseData } from '../../shared/models/api-response-data';
import { AppRoles } from '../../shared/models/app-roles';
import { AuthService } from '../auth-store/auth.service';
import {
  ChangePasswordResponse,
  ForgotPasswordResponse,
  UserEstablishmentPermission
} from './identity.models';

@Injectable({ providedIn: 'root' })
export class IdentityService {
  private readonly proxyUrl = `${env.proxyBaseUrl}/bff/proxy/identity`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  listUserPermissions(
    userId: string,
    documents: string[]
  ): Observable<ApiResponseData<UserEstablishmentPermission[]>> {
    const proxyRequest: ProxyRequest = {
      method: 'POST',
      path: `user-accounts/${userId}/permissions`,
      body: {
        documents
      }
    };

    return this.http
      .post<ApiResponseData<UserEstablishmentPermission[]>>(`${this.proxyUrl}`, proxyRequest)
      .pipe(take(1));
  }

  recoverPassword(
    email: string,
    deviceType: string,
    device: string
  ): Observable<ApiResponseData<ForgotPasswordResponse>> {
    return this.authService.identitySignin(email, deviceType, device).pipe(
      switchMap((authToken) => {
        const proxyRequest: ProxyRequest = {
          method: 'POST',
          path: `user-accounts/actions/forgot-password`,
          body: { email }
        };

        return this.http
          .post<ApiResponseData<ForgotPasswordResponse>>(`${this.proxyUrl}`, proxyRequest, {
            headers: this.authService.bearerHeaders(authToken.data.accessToken)
          })
          .pipe(take(1));
      })
    );
  }

  getUserRoles(userId: string): Observable<ApiResponseData<AppRoles[]>> {
    const proxyRequest: ProxyRequest = {
      method: 'GET',
      path: `user-accounts/${userId}/roles`
    };

    return this.http
      .post<ApiResponseData<AppRoles[]>>(`${this.proxyUrl}`, proxyRequest)
      .pipe(take(1));
  }

  changePassword(
    email: string,
    currentPassword: string,
    newPassword: string,
    deviceType: string,
    mfaPhoneNumber: string
  ): Observable<ApiResponseData<ChangePasswordResponse>> {
    const proxyRequest: ProxyRequest = {
      method: 'POST',
      path: `user-accounts/actions/change-password`,
      body: {
        email,
        currentPassword: btoa(currentPassword),
        newPassword: btoa(newPassword),
        deviceType,
        mfaPhoneNumber
      }
    };

    return this.http
      .post<ApiResponseData<ChangePasswordResponse>>(`${this.proxyUrl}`, proxyRequest)
      .pipe(take(1));
  }
}
