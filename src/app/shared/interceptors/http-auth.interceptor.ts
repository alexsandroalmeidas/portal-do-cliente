import {
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Store } from '@ngrx/store';
import { Observable, of, throwError } from 'rxjs';
import { catchError, switchMap, take } from 'rxjs/operators';
import { RootStoreState } from './../../root-store';
import {
  AuthStoreActions,
  AuthStoreSelectors,
} from './../../root-store/auth-store';
import { IdentityTokenInfo } from 'src/app/root-store/auth-store/auth.models';

@Injectable()
export class HttpAuthInterceptor implements HttpInterceptor {
  constructor(
    private store$: Store<RootStoreState.AppState>,
    private jwtHelper: JwtHelperService,
  ) {}

  private extractIdentityTokenInfo(idToken?: string): IdentityTokenInfo {
    if (!idToken) return null as any;
    const decoded = this.jwtHelper.decodeToken(idToken);

    return {
      uid: decoded?.uid ?? '',
    } as IdentityTokenInfo;
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
    // ======================================================
    // 1️⃣ SE JÁ TEM AUTH HEADER → RESPEITA E NÃO INTERCEPTA
    // ======================================================
    if (request.headers.has('Authorization')) {
      return next.handle(request);
    }

    // ======================================================
    // 2️⃣ ROTAS QUE NUNCA DEVEM SER INTERCEPTADAS
    // ======================================================
    if (this.isBootstrapRequest(request)) {
      return next.handle(request);
    }

    return next.handle(request);

    // ======================================================
    // 3️⃣ INJETAR TOKEN DO STORE (fluxo normal)
    // ======================================================
    return this.store$.select(AuthStoreSelectors.selectAuthData).pipe(
      take(1),
      switchMap((authData) => {
        const token = authData?.authToken?.accessToken;
        if (!token) {
          return next.handle(request);
        }

        const tokenInfo = this.extractIdentityTokenInfo(token);

        const authorizedRequest = request.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
            'Ocp-Apim-Trace': 'true',
            'X-UID': tokenInfo.uid,
          },
        });

        return next.handle(authorizedRequest);
      }),
      catchError((error) => {
        if (error?.status === 401) {
          this.store$.dispatch(new AuthStoreActions.UnauthorizedAction());
          return of(error);
        }
        return throwError(() => error);
      }),
    );
  }

  private isBootstrapRequest(request: HttpRequest<any>): boolean {
    return [
      '/bff/auth/token',
      '/bff/auth/refresh-token',
      '/connect/token',
    ].some((url) => request.url.includes(url));
  }

  private isPublicRequest(request: HttpRequest<any>): boolean {
    return [/\/user-accounts\/actions\/search$/, /\/user-accounts\/.+$/].some(
      (reg) => reg.test(request.url),
    );
  }
}
