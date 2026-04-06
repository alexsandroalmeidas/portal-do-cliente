import {
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { UiService } from '../services/ui-service';

@Injectable()
export class HttpLoadingInterceptor implements HttpInterceptor {
  constructor(private ui: UiService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
    this.ui.spin$.next(true);

    return next.handle(request).pipe(
      tap((evt) => {
        if (evt instanceof HttpResponse) {
          this.ui.spin$.next(false);
        }
      }),
      catchError((err) => {
        this.ui.spin$.next(false);
        return throwError(() => err);
      }),
    );
  }
}
