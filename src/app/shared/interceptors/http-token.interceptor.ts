import {
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { TokenRefreshCoordinator } from '../helpers/token-refresh-coordinator';
import { RootStoreState } from './../../root-store';
import {
  AuthStoreActions,
  AuthStoreSelectors,
} from './../../root-store/auth-store';
import {
  IdentityToken,
  IdentityTokenInfo,
} from 'src/app/root-store/auth-store/auth.models';

@Injectable()
export class HttpTokenInterceptor implements HttpInterceptor {
  constructor(
    private store$: Store<RootStoreState.AppState>,
    private coordinator: TokenRefreshCoordinator,
    private jwtHelper: JwtHelperService,
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
    // 🚫 NÃO interceptar a chamada de refresh token

    if (req.headers.has('X-Skip-Auth-Interceptor')) {
      return next.handle(req);
    }

    return next.handle(req);

    return this.store$.select(AuthStoreSelectors.selectAuthDataRefreshing).pipe(
      take(1),
      switchMap((state) => {
        const token = state?.authData?.authToken?.accessToken;

        if (!token) {
          return next.handle(req);
        }

        const remaining = this.getRemainingSeconds(
          state?.authData?.authToken ?? (null as any),
        );

        if (remaining > 180) {
          return next.handle(this.addToken(req, token));
        }

        // TOKEN EXPIRANDO

        if (!this.coordinator.isRefreshing()) {
          this.coordinator.startRefresh();

          this.store$.dispatch(new AuthStoreActions.RefreshTokenAction());

          // ⚠️ deixa a request seguir normalmente
          return next.handle(req);
        }

        // refresh já em andamento → entra na fila

        return this.coordinator
          .waitForRefresh()
          .pipe(
            switchMap((newToken: string) =>
              next.handle(this.addToken(req, newToken)),
            ),
          );
      }),
    );
  }

  private extractIdentityTokenInfo(idToken?: string): IdentityTokenInfo {
    if (!idToken) return null as any;
    const decoded = this.jwtHelper.decodeToken(idToken);

    return {
      uid: decoded?.uid ?? '',
    } as IdentityTokenInfo;
  }

  private addToken(request: HttpRequest<any>, token: string) {
    const tokenInfo = this.extractIdentityTokenInfo(token);

    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
        'X-UID': '', //tokenInfo.uid,
      },
    });
  }

  private getRemainingSeconds(token: IdentityToken): number {
    if (!token?.expiresIn) {
      return 0;
    }

    const remainingMs = token.expiresIn - Date.now();

    return Math.floor(remainingMs / 1000);
  }
}
