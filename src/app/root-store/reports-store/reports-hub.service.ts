import { environment as env } from '@/environments/environment';
import { Injectable, OnDestroy } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { first, lastValueFrom, map, Observable, Subject } from 'rxjs';

import { AuthStoreSelectors } from '../auth-store';
import { AppState } from '../state';
import { SignalRService } from './../../shared/services/signalr.service';
import { ReportRequest } from './reports.models';

@Injectable({ providedIn: 'root' })
export class ReportsHubService extends SignalRService implements OnDestroy {
  protected hubUrl = `${env.reportsSignalRUrl}/hubs/reports`;

  private $unsub = new Subject<void>();

  constructor(private store$: Store<AppState>) {
    super();
  }

  /**
   * Token JWT usado pelo SignalR (APIM)
   */
  protected async getAuthorizationHeaderValue(): Promise<string> {
    const accessToken$ = this.store$.pipe(
      select(AuthStoreSelectors.selectAuthData),
      first((authData) => !!authData?.authToken),
      map((authData) => authData!.authToken!.accessToken)
    );

    return lastValueFrom(accessToken$);
  }

  /**
   * Escuta o evento 'UpdateRequest'
   */
  listenToReportUpdates(): Observable<ReportRequest> {
    return this.listen('UpdateRequest', (data) => data as ReportRequest);
  }

  /**
   * Cleanup
   */
  ngOnDestroy(): void {
    this.$unsub.next();
    this.$unsub.complete();
    this.disconnect();
  }
}
