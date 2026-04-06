import { HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, switchMap, take } from 'rxjs/operators';
import { environment as env } from '../../../environments/environment';
import { ClientIpService } from '../services/client-ip-service';
import { SessionStorageService } from '../services/session-storage.service';

@Injectable()
export class ClientIpInterceptor implements HttpInterceptor {

  constructor(private sessionStorage: SessionStorageService, private clientIpService: ClientIpService) { }

  addXForwardedForHeader(request: HttpRequest<any>): Observable<HttpRequest<any>> {

    const savedIp: string = this.sessionStorage.getItem('auth.client-ip');

    if (!!savedIp) {
      if (env.debug) {
        return of(request.clone({
          setHeaders: {
            'X-Forwarded-For': savedIp
          }
        }));
      }
    }

    return this.clientIpService.getClientIp()
      .pipe(
        take(1),
        switchMap((clientIp) => {

          if (!!clientIp) {
            this.sessionStorage.setItem('auth.client-ip', clientIp.ip);

            if (env.debug) {
              request = request.clone({
                setHeaders: {
                  'X-Forwarded-For': clientIp.ip
                }
              });
            }
          }

          return of(request);
        }),
        catchError(() => of(request))
      );
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {

    const unauthorizedUrlRegexs = [
      /^(https?:\/\/)(.+)\/get-ip$/,
    ];

    if (!/^https?:\/\//.test(request.url) || unauthorizedUrlRegexs.some(reg => reg.test(request.url))) {
      return next.handle(request);
    }

    return this.addXForwardedForHeader(request)
      .pipe(
        switchMap(req => {
          return next.handle(req);
        })
      );
  }
}
