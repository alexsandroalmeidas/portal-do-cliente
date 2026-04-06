import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action, select, Store } from '@ngrx/store';
import { fromEvent, interval, Observable } from 'rxjs';
import { distinctUntilChanged, filter, map, tap, withLatestFrom } from 'rxjs/operators';
import { SessionStorageService } from 'src/app/shared/services/session-storage.service';
import { AuthStoreActions, AuthStoreSelectors, RootStoreState } from './../../root-store';
import { NotificationService } from './../../shared/services/notification.service';
import { CoreStoreActions, CoreStoreSelectors } from './../core-store';

@Injectable()
export class CoreStoreEffects {
  constructor(
    private notificationService: NotificationService,
    private actions$: Actions,
    private store$: Store<RootStoreState.AppState>,
    private sessionStorageService: SessionStorageService,
    private breakpointObserver: BreakpointObserver
  ) { }

  startSmallBreakepoint: Observable<Action> = createEffect(() =>
    this.breakpointObserver
      .observe([
        Breakpoints.XSmall,
        Breakpoints.Small
      ])
      .pipe(
        filter(value => value.matches),
        map(() => new CoreStoreActions.StartSmallBreakpointAction())
      )
  );

  initializeEffect: Observable<Action> = createEffect(() =>
    this.breakpointObserver
      .observe([
        Breakpoints.Medium,
        Breakpoints.Large,
        Breakpoints.XLarge
      ])
      .pipe(
        filter(value => value.matches),
        map(() => new CoreStoreActions.StartMediumBreakpointAction())
      )
  );

  showErrorEffect$ = createEffect(() => this.actions$
    .pipe(
      ofType<CoreStoreActions.ThrowErrorAction>(CoreStoreActions.ActionTypes.THROW_ERROR),
      tap(action => {
        this.notificationService.showError(action.payload.error);
      })
    ),
    { dispatch: false }
  );

  touchStartEffect$ = createEffect(() =>
    fromEvent(document.body, 'touchstart', { passive: true })
      .pipe(
        map(e => {
          const te = e as TouchEvent;
          const startY = te.touches[0].pageY;
          return new CoreStoreActions.TouchStartAction({ startY });
        })
      )
  );

  touchMoveEffect$ = createEffect(() =>
    fromEvent(document.body, 'touchmove', { passive: true })
      .pipe(
        withLatestFrom(this.store$.pipe(select(CoreStoreSelectors.selectTouchStartY))),
        map(([e, startY]) => {
          const te = e as TouchEvent;
          const y = te.touches[0].pageY;

          // Activate custom pull-to-refresh effects when at the top of the container
          // and user is scrolling up.
          if (document.scrollingElement?.scrollTop === 0 && y > startY) {
            return new CoreStoreActions.OverscrollStartAction();
          }

          return new CoreStoreActions.OverscrollEndAction();
        })
      )
  );

  overscrollEndEffect$ = createEffect(() => this.actions$
    .pipe(
      ofType<CoreStoreActions.OverscrollStartAction>(CoreStoreActions.ActionTypes.OVERSCROLL_START),
      map(() => new CoreStoreActions.OverscrollEndAction())
    )
  );

  persistCoreState$ = createEffect(() =>
    this.store$.pipe(
      withLatestFrom(
        this.store$.pipe(select(CoreStoreSelectors.selectCoreState))
      ),
      distinctUntilChanged(),
      tap(([, state]) => {
        this.sessionStorageService.setItem('core.sensitive-data-visibility-mode', state.sensitiveDataVisibilityMode);
      })
    ),
    { dispatch: false }
  );

  clickEventEffect$ = createEffect(() =>
    fromEvent(document.body, 'click')
      .pipe(
        withLatestFrom(
          this.store$.pipe(select(CoreStoreSelectors.selectLastClickTime))
        ),
        map((event) => {
          return new CoreStoreActions.UpdateLastClickTimeAction({ time: Date.now() });
        })
      )
  );

  checkLastClickEffect$ = createEffect(() =>
    interval(1000)
      .pipe(
        withLatestFrom(
          this.store$.pipe(select(CoreStoreSelectors.selectLastClickTime)),
          this.store$.pipe(select(AuthStoreSelectors.selectIsAuthenticated))
        ),
        filter(([_, __, isAuthenticated]) => isAuthenticated),
        tap(([_, lastClickTime, __]) => {
          const now = Date.now();
          const timeLeft = lastClickTime + (10 * 60 * 1000);
          const diff = timeLeft - now;
          const isTimeout = diff < 0;

          if (isTimeout) {
            setTimeout(() => {
              console.log("Your Session Expired due to longer Inactivity, Login Again To Continue");
            }, 10000);

            console.log(`SignOutAction: core.effects.ts:139`);
            this.store$.dispatch(new AuthStoreActions.SignOutAction());
            return;
          }
        })
      ),

    { dispatch: false }
  );
}
