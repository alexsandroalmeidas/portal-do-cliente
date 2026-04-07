import { Injectable } from '@angular/core';
import { ActivationEnd, Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { merge, of } from 'rxjs';
import { distinctUntilChanged, filter, tap } from 'rxjs/operators';
import { SessionStorageService } from 'src/app/shared/services/session-storage.service';
import { RootStoreState } from '..';
import { TitleService } from './../../shared/services/title.service';
import * as featureActions from './settings.actions';
import * as selectors from './settings.selectors';

const INIT = of('petlove-init-effect-trigger');

@Injectable()
export class SettingsStoreEffects {
  constructor(
    private sessionStorageService: SessionStorageService,
    private translateService: TranslateService,
    private titleService: TitleService,
    private router: Router,
    private store$: Store<RootStoreState.AppState>,
    private actions$: Actions,
  ) {}

  persistSettingsEffect$ = createEffect(
    () =>
      this.store$.pipe(
        select(selectors.selectSettings),
        distinctUntilChanged(),
        tap((settings) => {
          this.sessionStorageService.setItem(
            'settings.language',
            settings.language,
          );
        }),
      ),
    { dispatch: false },
  );

  setLanguageEffect$ = createEffect(
    () =>
      this.store$.pipe(
        select(selectors.selectLanguage),
        distinctUntilChanged(),
        tap((language) => this.translateService.use(language)),
      ),
    { dispatch: false },
  );

  setTitleEffect$ = createEffect(
    () =>
      merge(
        this.actions$.pipe(
          ofType<featureActions.ChangeLanguageAction>(
            featureActions.ActionTypes.CHANGE_LANGUAGE,
          ),
        ),
        this.router.events.pipe(
          filter((event) => event instanceof ActivationEnd),
        ),
      ).pipe(
        tap(() => {
          this.titleService.setTitle(
            this.router.routerState.snapshot.root,
            this.translateService,
          );
        }),
      ),
    { dispatch: false },
  );
}
