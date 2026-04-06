import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { take } from 'rxjs/operators';
import { environment as env } from '../../../environments/environment';
import { LogPortalResponse } from '../models/log-portal.models';
import { ProxyRequest } from '../models/proxy-request';

@Injectable({ providedIn: 'root' })
export class LoggingService {
  private readonly proxyUrl = `${env.proxyBaseUrl}/bff/proxy`;

  constructor(private http: HttpClient) {}

  postLogging(
    userName: string,
    action: string,
    deviceType: string,
    device: string
  ): Observable<LogPortalResponse> {
    const proxyRequest: ProxyRequest = {
      method: 'POST',
      path: `api/log-portal/tracking`,
      body: {
        userName,
        action,
        deviceType,
        device
      }
    };

    return this.http
      .post<LogPortalResponse>(`${env.proxyBaseUrl}/bff/proxy-log/administration`, proxyRequest)
      .pipe(take(1));
  }

  postCustomersSelected(
    userName: string,
    selectedEstablishments: string[],
    rowKey: string
  ): Observable<string> {
    if (!rowKey || rowKey.trim() === '') {
      return throwError(() => new Error('rowKey é obrigatório.'));
    }

    const proxyRequest: ProxyRequest = {
      method: 'POST',
      path: `api/log-portal/customers-selected/${rowKey}`,
      body: {
        userName,
        selectedEstablishments
      }
    };

    return this.http.post<any>(`${this.proxyUrl}/administration`, proxyRequest).pipe(take(1));
  }
}
