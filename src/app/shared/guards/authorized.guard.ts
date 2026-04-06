import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { RootStoreState } from './../../root-store';
import { AuthStoreActions, AuthStoreSelectors } from './../../root-store/auth-store';

@Injectable()
export class AuthorizedGuard implements CanActivate, CanActivateChild {


  constructor(private store$: Store<RootStoreState.AppState>) { }

  canActivate(activatedRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.store$.select(AuthStoreSelectors.selectIsAuthenticated)
      .pipe(
        tap(isAuthenticated => {
          if (!isAuthenticated) {
            this.store$.dispatch(new AuthStoreActions.UnauthorizedAction());
            return;
          }
        }),
        map(isAuthenticated => isAuthenticated),
        catchError(() => of(false))
      );
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.canActivate(childRoute, state);
  }
}
