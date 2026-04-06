import { normalizeAuthToken } from '@/shared/helpers/auth-token.normalizer';
import { ProxyRequest } from '@/shared/models/proxy-request';
import { DOCUMENT } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { map, Observable, of, switchMap, take, tap } from 'rxjs';
import { environment as env } from '../../../environments/environment';
import { ApiResponseData } from './../../shared/models/api-response-data';
import {
  AuthData,
  IdentityToken,
  IdentityTokenInfo,
  SsoCreateTokenResponse,
  UserInfo,
} from './auth.models';

@Injectable()
export class AuthService {
  private readonly proxyUrl = `${env.proxyBaseUrl}/bff/proxy`;

  constructor(
    private http: HttpClient,
    @Inject(DOCUMENT) private document: Document,
    private jwtHelper: JwtHelperService,
  ) {}

  // ======================================================
  // 🔹 PUBLIC METHODS
  // ======================================================

  getAccessToken(
    authorizationCode: string,
    deviceType: string,
    device: string,
  ): Observable<AuthData> {
    return this.createTokenEdenred(authorizationCode).pipe(
      switchMap((ssoToken) => {
        const username = this.extractUsername(ssoToken?.idToken);

        if (!username) {
          return of(
            this.buildFailureAuthData(null as any, ssoToken, authorizationCode),
          );
        }

        return this.identitySignin(username, deviceType, device).pipe(
          switchMap((signinResponse) => {
            const tokenInfo = this.extractIdentityTokenInfo(
              signinResponse.data.accessToken,
            );

            return this.getUser(
              tokenInfo.uid,
              signinResponse.data.accessToken,
              username,
            ).pipe(
              map((tokenInfoResponse) => {
                const data = tokenInfoResponse.data;

                return this.buildSuccessAuthData(
                  {
                    uid: tokenInfo.uid,
                    id: tokenInfo.uid,
                    name: data.name,
                    email: data.email,
                    rowKey: signinResponse.data.rowKey,
                    isFirstAccess: data.isFirstAccess,
                    forgotPassword: data.forgotPassword,
                    showRates: data.showRates,
                    isAd: false,
                  } as UserInfo,
                  signinResponse.data,
                  ssoToken,
                  authorizationCode,
                  false,
                );
              }),
            );
          }),
        );
      }),
    );
  }

  refreshToken(
    authorizationCode: string,
    ssoToken: SsoCreateTokenResponse,
    refreshToken: string,
    userInfo: UserInfo,
  ): Observable<AuthData> {
    console.log('refreshToken chamado');

    return this.requestRefreshIdentityToken(refreshToken).pipe(
      tap((res) => console.log('RESPOSTA API', res)),
      map((authToken) => {
        console.log('ANTES DO BUILD');

        const sucessData = this.buildSuccessAuthData(
          userInfo,
          authToken.data,
          null as any,
          authorizationCode,
          userInfo.isAd,
        );

        console.log('DEPOIS DO BUILD');

        return sucessData;
      }),
    );
  }

  revokeToken(token: string): Observable<void> {
    return this.http
      .post<void>(`${env.proxyBaseUrl}/bff/auth/revoke`, null, {
        headers: this.bearerHeaders(token),
      })
      .pipe(take(1));
  }

  signinAd(
    authorizationCode: string,
    deviceType: string,
    device: string,
  ): Observable<AuthData> {
    const proxyRequest: ProxyRequest = {
      method: 'POST',
      path: `api/users/${authorizationCode}/validate-user-ad`,
    };

    return this.http
      .post<UserInfo>(
        `${env.proxyBaseUrl}/bff/auth/${authorizationCode}/validate-user-ad`,
        proxyRequest,
      )
      .pipe(
        switchMap((userInfo) => {
          return this.identitySigninAd(userInfo.email, deviceType, device).pipe(
            map((signinResponse) => {
              const tokenInfo = this.extractIdentityTokenInfo(
                signinResponse.data.accessToken,
              );

              return this.buildSuccessAuthData(
                {
                  uid: tokenInfo.uid,
                  id: tokenInfo.uid,
                  name: userInfo.name,
                  email: userInfo.email,
                  rowKey: signinResponse.data.rowKey,
                  isFirstAccess: false,
                  forgotPassword: false,
                  showRates: true,
                  allow: userInfo.allow,
                  isAd: true,
                  eId: userInfo.eId,
                } as UserInfo,
                signinResponse.data,
                {
                  accessToken: btoa(crypto.randomUUID()),
                } as SsoCreateTokenResponse,
                authorizationCode,
                true,
              );
            }),
          );
        }),
      );
  }

  // ======================================================
  // 🔹 PRIVATE HELPERS
  // ======================================================

  requestAccountsToken(): Observable<IdentityToken> {
    return this.http
      .post<IdentityToken>(`${env.proxyBaseUrl}/bff/auth/token`, null, {
        headers: this.formHeaders(),
      })
      .pipe(map(normalizeAuthToken), take(1));
  }

  private requestRefreshIdentityToken(
    refreshToken: string,
  ): Observable<ApiResponseData<IdentityToken>> {
    console.log('CHAMANDO REFRESH HTTP');

    const proxyRequest: ProxyRequest = {
      method: 'POST',
      path: 'user-accounts/actions/refresh',
      body: {
        refreshToken,
      },
    };

    return this.http
      .post<ApiResponseData<IdentityToken>>(
        `${this.proxyUrl}/identity`,
        proxyRequest,
        {
          headers: new HttpHeaders({
            'X-Skip-Auth-Interceptor': 'true',
          }),
        },
      )
      .pipe(take(1));
  }

  private createTokenEdenred(
    authorizationCode: string,
  ): Observable<SsoCreateTokenResponse> {
    const request: ProxyRequest = {
      method: 'POST',
      path: 'api/sso/create-token',
      body: {
        authorizationCode,
        urlSignin: this.document.location.origin,
      },
    };

    return this.http.post<SsoCreateTokenResponse>(
      `${env.proxyBaseUrl}/bff/auth/edenred-token`,
      request,
    );
  }

  private refreshTokenEdenred(
    bearer: string,
    refreshToken: string,
  ): Observable<SsoCreateTokenResponse> {
    const proxyRequest: ProxyRequest = {
      method: 'POST',
      path: 'api/sso/refresh-token',
      body: { refreshToken },
    };

    return this.http
      .post<SsoCreateTokenResponse>(
        `${this.proxyUrl}/administration`,
        proxyRequest,
        {
          headers: this.bearerHeaders(bearer),
        },
      )
      .pipe(take(1));
  }

  identitySignin(
    username: string,
    deviceType: string,
    device: string,
  ): Observable<ApiResponseData<IdentityToken>> {
    const proxyRequest: ProxyRequest = {
      method: 'POST',
      path: 'user-accounts/actions/signin',
      body: {
        authority: 'user.username',
        reference: username.toLowerCase(),
        deviceType,
        device,
      },
    };

    return this.http.post<ApiResponseData<IdentityToken>>(
      `${env.proxyBaseUrl}/bff/auth/signin`,
      proxyRequest,
    );
  }

  identitySigninAd(
    username: string,
    deviceType: string,
    device: string,
  ): Observable<ApiResponseData<IdentityToken>> {
    const proxyRequest: ProxyRequest = {
      method: 'POST',
      path: 'user-accounts/actions/signin-ad',
      body: {
        authority: 'user.username',
        reference: username.toLowerCase(),
        deviceType,
        device,
      },
    };

    return this.http.post<ApiResponseData<IdentityToken>>(
      `${env.proxyBaseUrl}/bff/auth/signin-ad`,
      proxyRequest,
    );
  }

  private searchUser(username: string): Observable<ApiResponseData<UserInfo>> {
    const proxyRequest: ProxyRequest = {
      method: 'POST',
      path: 'user-accounts/actions/search-portal',
      body: {
        authority: 'user.username',
        reference: username.toLowerCase(),
      },
    };

    return this.http
      .post<
        ApiResponseData<UserInfo>
      >(`${this.proxyUrl}/identity`, proxyRequest)
      .pipe(take(1));
  }

  private getUser(
    userId: string,
    token: string,
    username: string,
  ): Observable<ApiResponseData<IdentityTokenInfo>> {
    const proxyRequest: ProxyRequest = {
      method: 'POST',
      path: `user-accounts/actions/${userId}`,
      body: {
        authority: 'user.username',
        reference: username.toLowerCase(),
      },
    };

    return this.http
      .post<ApiResponseData<IdentityTokenInfo>>(
        `${this.proxyUrl}/identity`,
        proxyRequest,
        {
          headers: this.bearerHeaders(token),
        },
      )
      .pipe((map(normalizeAuthToken), take(1)));
  }

  private extractUsername(idToken?: string): string | null {
    if (!idToken) return null;
    const decoded = this.jwtHelper.decodeToken(idToken);
    return decoded?.username ?? null;
  }

  private extractIdentityTokenInfo(idToken?: string): IdentityTokenInfo {
    if (!idToken) return null as any;
    const decoded = this.jwtHelper.decodeToken(idToken);

    return {
      uid: decoded?.uid ?? '',
    } as IdentityTokenInfo;
  }

  private buildSuccessAuthData(
    user: UserInfo,
    authToken: IdentityToken,
    ssoToken: SsoCreateTokenResponse,
    authorizationCode: string,
    isAd: boolean,
  ): AuthData {
    if (!!ssoToken && !!ssoToken.eId) {
      user.eId = ssoToken.eId;
    }

    const normalizedToken = normalizeAuthToken(authToken);
    return {
      status: 'succeeded',
      user,
      authToken: normalizedToken,
      ssoToken,
      authorizationCode,
      isAd,
    };
  }

  private buildFailureAuthData(
    authToken: IdentityToken,
    ssoToken: SsoCreateTokenResponse,
    authorizationCode: string,
  ): AuthData {
    const normalizedToken = normalizeAuthToken(authToken);

    return {
      status: 'failed',
      authToken: normalizedToken,
      ssoToken,
      authorizationCode,
      isAd: false,
    };
  }

  bearerHeaders(token: string): HttpHeaders {
    const tokenInfo = this.extractIdentityTokenInfo(token);

    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'X-UID': '', //tokenInfo.uid
    });
  }

  private formHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });
  }
}
