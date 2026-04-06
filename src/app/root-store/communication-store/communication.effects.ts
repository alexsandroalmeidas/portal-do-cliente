import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import {
  delay,
  distinctUntilChanged,
  map,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs/operators';
import { of } from 'rxjs';

import { AuthStoreSelectors } from '../auth-store';
import { CoreStoreActions } from '../core-store';
import { AppState } from '../state';
import { AdministrationStoreSelectors } from '../administration-store';
import { LocalStorageService } from '../../shared/services/local-storage.service';

import * as featureActions from './communication.actions';
import * as featureSelectors from './communication.selectors';

import {
  mockBanners,
  mockMessages,
  mockNotifications,
} from './communication.mock';

@Injectable()
export class CommunicationStoreEffects {
  constructor(
    private actions$: Actions,
    private store$: Store<AppState>,
    private localStorageService: LocalStorageService,
  ) {}

  // ========================= NOTIFICATIONS =========================

  listNotificationsEffect$ = createEffect(
    () => () =>
      this.actions$.pipe(
        ofType<featureActions.ListNotificationsAction>(
          featureActions.ActionTypes.LIST_NOTIFICATIONS,
        ),
        switchMap(() =>
          of(mockNotifications).pipe(
            delay(500),
            map(
              (notifications) =>
                new featureActions.ListNotificationsSuccessAction({
                  notifications,
                }),
            ),
          ),
        ),
      ),
  );

  getNotificationEffect$ = createEffect(
    () => () =>
      this.actions$.pipe(
        ofType<featureActions.GetNotificationAction>(
          featureActions.ActionTypes.GET_NOTIFICATION,
        ),
        switchMap((action) => {
          const notification =
            mockNotifications.find((x) => x.id === action.payload.id) ??
            mockNotifications[0];

          return of(notification).pipe(
            delay(300),
            map(
              (notification) =>
                new featureActions.GetNotificationSuccessAction({
                  notification,
                }),
            ),
          );
        }),
      ),
  );

  markNotificationReadEffect$ = createEffect(
    () => () =>
      this.actions$.pipe(
        ofType<featureActions.MarkNotificationReadAction>(
          featureActions.ActionTypes.MARK_NOTIFICATION_READ,
        ),
        switchMap((action) =>
          of(action.payload.id).pipe(
            delay(200),
            map(
              (id) =>
                new featureActions.MarkNotificationReadSuccessAction({ id }),
            ),
          ),
        ),
      ),
  );

  markNotificationDisplayedEffect$ = createEffect(
    () => () =>
      this.actions$.pipe(
        ofType<featureActions.MarkNotificationDisplayedAction>(
          featureActions.ActionTypes.MARK_NOTIFICATION_DISPLAYED,
        ),
        switchMap((action) =>
          of(action.payload.id).pipe(
            delay(200),
            map(
              (id) =>
                new featureActions.MarkNotificationDisplayedSuccessAction({
                  id,
                }),
            ),
          ),
        ),
      ),
  );

  markUnreadNotificationEffect$ = createEffect(
    () => () =>
      this.actions$.pipe(
        ofType<featureActions.MarkUnreadNotificationAction>(
          featureActions.ActionTypes.MARK_UNREAD_NOTIFICATION,
        ),
        switchMap((action) =>
          of(action.payload.id).pipe(
            delay(200),
            map(
              (id) =>
                new featureActions.MarkUnreadNotificationSuccessAction({ id }),
            ),
          ),
        ),
      ),
  );

  deleteNotificationEffect$ = createEffect(
    () => () =>
      this.actions$.pipe(
        ofType<featureActions.DeleteNotificationAction>(
          featureActions.ActionTypes.DELETE_NOTIFICATION,
        ),
        switchMap((action) =>
          of(action.payload.id).pipe(
            delay(200),
            map(
              (id) =>
                new featureActions.DeleteNotificationSuccessAction({ id }),
            ),
          ),
        ),
      ),
  );

  // ========================= MESSAGES =========================

  listMessagesRegistrationEffect$ = createEffect(
    () => () =>
      this.actions$.pipe(
        ofType<featureActions.ListMessagesRegistrationAction>(
          featureActions.ActionTypes.LIST_MESSAGES_REGISTRATION,
        ),
        switchMap(() =>
          of(mockMessages).pipe(
            delay(500),
            map(
              (messages) =>
                new featureActions.ListMessagesRegistrationSuccessAction({
                  messages,
                }),
            ),
          ),
        ),
      ),
  );

  getMessageRegistrationEffect$ = createEffect(
    () => () =>
      this.actions$.pipe(
        ofType<featureActions.GetMessageRegistrationAction>(
          featureActions.ActionTypes.GET_MESSAGE_REGISTRATION,
        ),
        switchMap((action) => {
          const message =
            mockMessages.find((x) => x.id === action.payload.id) ??
            mockMessages[0];

          return of(message).pipe(
            delay(300),
            map(
              (message) =>
                new featureActions.GetMessageRegistrationSuccessAction({
                  message,
                }),
            ),
          );
        }),
      ),
  );

  registerMessageEffect$ = createEffect(
    () => () =>
      this.actions$.pipe(
        ofType<featureActions.RegisterMessageAction>(
          featureActions.ActionTypes.REGISTER_MESSAGE,
        ),
        switchMap((action) => {
          const message = {
            ...mockMessages[0],
            title: action.payload.title,
            text: action.payload.text,
          };

          return of(message).pipe(
            delay(500),
            map(
              (message) =>
                new featureActions.RegisterMessageSuccessAction({ message }),
            ),
          );
        }),
      ),
  );

  updateMessageEffect$ = createEffect(
    () => () =>
      this.actions$.pipe(
        ofType<featureActions.UpdateMessageAction>(
          featureActions.ActionTypes.UPDATE_MESSAGE,
        ),
        switchMap((action) => {
          const message = {
            ...mockMessages[0],
            id: action.payload.id,
            title: action.payload.title,
            text: action.payload.text,
          };

          return of(message).pipe(
            delay(500),
            map(
              (message) =>
                new featureActions.UpdateMessageSuccessAction({ message }),
            ),
          );
        }),
      ),
  );

  notifyRegistrationMessageEffect$ = createEffect(
    () => () =>
      this.actions$.pipe(
        ofType<featureActions.NotifyRegistrationMessageAction>(
          featureActions.ActionTypes.NOTIFY_REGISTRATION_MESSAGE,
        ),
        switchMap(() =>
          of(mockMessages[0]).pipe(
            delay(300),
            map(
              (message) =>
                new featureActions.NotifyRegistrationMessageSuccessAction({
                  message,
                }),
            ),
          ),
        ),
      ),
  );

  deleteMessageRegistrationEffect$ = createEffect(
    () => () =>
      this.actions$.pipe(
        ofType<featureActions.DeleteMessageRegistrationAction>(
          featureActions.ActionTypes.DELETE_MESSAGE_REGISTRATION,
        ),
        switchMap(() =>
          of(mockMessages[0]).pipe(
            delay(300),
            map(
              (message) =>
                new featureActions.DeleteMessageRegistrationSuccessAction({
                  message,
                }),
            ),
          ),
        ),
      ),
  );

  // ========================= BANNERS =========================

  listBannersRegistrationEffect$ = createEffect(
    () => () =>
      this.actions$.pipe(
        ofType<featureActions.ListBannersRegistrationAction>(
          featureActions.ActionTypes.LIST_BANNERS_REGISTRATION,
        ),
        switchMap(() => {
          const response = {
            success: true,
            errors: [],
            data: mockBanners,
          };

          return of(response).pipe(
            delay(500),
            map(
              (response) =>
                new featureActions.ListBannersRegistrationSuccessAction({
                  response,
                }),
            ),
          );
        }),
      ),
  );

  getBannerRegistrationEffect$ = createEffect(
    () => () =>
      this.actions$.pipe(
        ofType<featureActions.GetBannerRegistrationAction>(
          featureActions.ActionTypes.GET_BANNER_REGISTRATION,
        ),
        switchMap((action) => {
          const banner =
            mockBanners.find((x) => x.id === action.payload.id) ??
            mockBanners[0];

          const response = {
            success: true,
            errors: [],
            data: banner,
          };

          return of(response).pipe(
            delay(300),
            map(
              (response) =>
                new featureActions.GetBannerRegistrationSuccessAction({
                  response,
                }),
            ),
          );
        }),
      ),
  );

  listaActiveBannersEffect$ = createEffect(
    () => () =>
      this.actions$.pipe(
        ofType<featureActions.ListActiveBannersAction>(
          featureActions.ActionTypes.LIST_ACTIVE_BANNERS,
        ),
        switchMap(() => {
          const response = {
            success: true,
            errors: [],
            data: mockBanners,
          };

          return of(response).pipe(
            delay(500),
            map(
              (response) =>
                new featureActions.ListActiveBannersSuccessAction({ response }),
            ),
          );
        }),
      ),
  );

  // ========================= LOCAL STORAGE =========================

  persistCommunicationEffect$ = createEffect(
    () =>
      this.store$.pipe(
        select(featureSelectors.selectPushNotificationSettings),
        distinctUntilChanged(),
        tap(({ enabled }) => {
          this.localStorageService.setItem(
            'communication.push-notifications-settings.enabled',
            enabled,
          );
        }),
      ),
    { dispatch: false },
  );
}
