import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, Observable, take, timeout } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TokenRefreshCoordinator {
  private refreshInProgress = false;

  private refreshTokenSubject = new BehaviorSubject<string | null>(null);

  isRefreshing(): boolean {
    return this.refreshInProgress;
  }

  startRefresh() {
    this.refreshInProgress = true;
    this.refreshTokenSubject.next(null);
  }

  finishRefresh(newToken: string) {
    this.refreshInProgress = false;
    this.refreshTokenSubject.next(newToken);
  }

  waitForRefresh(): Observable<string> {
    return this.refreshTokenSubject.pipe(
      filter((token): token is string => token !== null),
      take(1),
      timeout(10000)
    );
  }
}
