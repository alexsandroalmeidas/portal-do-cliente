import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class RefreshTokenLockService {
  private refreshing = false;

  isRefreshing() {
    return this.refreshing;
  }

  start() {
    this.refreshing = true;
  }

  stop() {
    this.refreshing = false;
  }
}
