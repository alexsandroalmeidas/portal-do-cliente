import { SignalRService } from '@/shared/services/signalr.service';
import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { first, lastValueFrom, map, Observable } from 'rxjs';
import { environment as env } from '../../../environments/environment';
import { AuthStoreSelectors } from '../auth-store';
import { AppState } from '../state';
import { Notification } from './communication.models';

@Injectable({ providedIn: 'root' })
export class CommunicationHubService extends SignalRService {
  protected hubUrl = `${env.proxyBaseUrl}/bff/signalr/communication`;

  constructor(private store$: Store<AppState>) {
    super();
  }

  protected async getAuthorizationHeaderValue(): Promise<string> {
    const token$ = this.store$.pipe(
      select(AuthStoreSelectors.selectAuthData),
      first((auth) => !!auth),
      map((auth) => auth!.authToken!.access_token)
    );

    return lastValueFrom(token$);
  }

  listenToSendNotifications(): Observable<Notification> {
    return this.listen('SendNotification', (x) => x);
  }
}

// @Injectable({ providedIn: 'root' })
// export class CommunicationHubService extends SignalRService {

//   protected hubUrl = `${env.communicationBaseUrl}/hubs/notifications`;
//   private $unsub = new Subject<void>(); // Controla a destruição de assinaturas
//   private token = '';
//   constructor(private store$: Store<AppState>) {
//     super();
//   }

//   protected async getAuthorizationHeaderValue(): Promise<string> {

//     const accessToken$ = this.store$.pipe(
//       select(AuthStoreSelectors.selectAuthData),
//       first((authData) => !!authData),
//       map((authData) => {
//         return `${authData?.authToken?.access_token}`;
//       })
//     );

//     return lastValueFrom(accessToken$);
//   }

//   /**
//   * Escuta o evento 'SendNotification' no hub
//   */
//   listenToSendNotifications(): Observable<Notification> {
//     return this.listen('SendNotification', (data) => data);
//   }

//   /**
//   * Executa ações de limpeza, como cancelamento de assinaturas
//   */
//   ngOnDestroy(): void {
//     this.$unsub.next();
//     this.$unsub.complete();
//     this.disconnect(); // Desconecta do hub
//   }
// }
