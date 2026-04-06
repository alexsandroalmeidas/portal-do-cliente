import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { environment as env } from '../../../environments/environment';
import { ClientIp } from '../models/client-ip';
import { ProxyRequest } from '../models/proxy-request';

@Injectable({ providedIn: 'root' })
export class ClientIpService {
  private readonly proxyUrl = `${env.proxyBaseUrl}/bff/proxy/communication`;

  constructor(private http: HttpClient) {}

  getClientIp(): Observable<ClientIp> {
    const proxyRequest: ProxyRequest = {
      method: 'GET',
      path: `api/ip-client/get-ip`
    };

    return this.http.post<ClientIp>(`${this.proxyUrl}`, proxyRequest).pipe(take(1));
  }
}
