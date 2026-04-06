import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { take } from 'rxjs';
import { environment as env } from '../../../environments/environment';
import { ProxyRequest } from '../models/proxy-request';

@Injectable({ providedIn: 'root' })
export class PushService {
  private readonly proxyUrl = `${env.proxyBaseUrl}/bff/proxy/communication`;

  constructor(private http: HttpClient) {}

  subscribe(email: string, subscription: PushSubscription) {
    const proxyRequest: ProxyRequest = {
      method: 'POST',
      path: `api/push/subscriptions`,
      body: { email, subscription }
    };

    return this.http.post<void>(`${this.proxyUrl}`, proxyRequest).pipe(take(1));
  }

  unsubscribe(endpoint: string) {
    const proxyRequest: ProxyRequest = {
      method: 'DELETE',
      path: `api/push/subscriptions/${encodeURIComponent(endpoint)}`
    };

    return this.http.post<void>(`${this.proxyUrl}`, proxyRequest).pipe(take(1));
  }
}
