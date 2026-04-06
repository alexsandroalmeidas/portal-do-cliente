import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { AppState } from '../state';
import * as ReceivablesStoreActions from './receivables.actions';

import {
  mockSummary,
  mockDetails,
  mockCalendar,
  mockLastUpdate,
  mockAdjustments,
  mockReceivables,
} from './receivables.mock';
import { Receivable, ReceivableDetail } from './receivables.models';

@Injectable()
export class ReceivablesStoreEffects {
  constructor(
    private store$: Store<AppState>,
    private actions$: Actions,
  ) {}

  isBetweenDates(date: Date, start: Date, end: Date) {
    return date >= new Date(start) && date <= new Date(end);
  }

  filterByDate<T>(
    items: T[],
    getDate: (item: T) => Date,
    start: Date,
    end: Date,
  ) {
    return items.filter((item) =>
      this.isBetweenDates(getDate(item), start, end),
    );
  }

  // =============================
  // RECEIVABLES (LISTA)
  // =============================
  loadPastReceivablesEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReceivablesStoreActions.ActionTypes.SELECT_PAST_RECEIVABLES),
      switchMap((action: any) => {
        const { initialDate, finalDate, uids } = action.payload;

        let filtered = this.filterByDate(
          mockReceivables,
          (d) => d.sortingDate,
          initialDate,
          finalDate,
        );

        if (uids?.length) {
          filtered = filtered.filter((x) => uids.includes(x.establishmentCode));
        }

        return of(filtered).pipe(
          map(
            (result) =>
              new ReceivablesStoreActions.LoadPastReceivablesAction({ result }),
          ),
        );
      }),
    ),
  );

  // =============================
  // SUMMARY
  // =============================
  loadReceivablesSummaryEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReceivablesStoreActions.ActionTypes.SELECT_RECEIVABLES_SUMMARY),
      switchMap((action: any) => {
        const { initialDate, finalDate } = action.payload;

        const filtered = this.filterByDate(
          mockCalendar,
          (d) => d.sortingDate,
          initialDate,
          finalDate,
        );

        const totalAmount = filtered.reduce((sum, d) => sum + d.amount, 0);

        const result = {
          ...mockSummary,
          totalAmount,
          totalCount: filtered.length,
          todayAmount: filtered[0]?.amount || 0,
        };

        return of(result).pipe(
          map(
            (result) =>
              new ReceivablesStoreActions.LoadReceivablesSummaryAction({
                result,
              }),
          ),
        );
      }),
    ),
  );

  // =============================
  // DETAIL
  // =============================
  loadReceivablesDetailEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReceivablesStoreActions.ActionTypes.SELECT_RECEIVABLES_DETAIL),
      switchMap((action: any) => {
        const { initialDate, finalDate } = action.payload;

        const filtered = this.filterByDate(
          mockDetails,
          (d) => new Date(d.saleDate),
          initialDate,
          finalDate,
        );

        return of(filtered).pipe(
          map(
            (result) =>
              new ReceivablesStoreActions.LoadReceivablesDetailAction({
                result,
              }),
          ),
        );
      }),
    ),
  );

  // =============================
  // CALENDAR
  // =============================
  loadReceivablesCalendarEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReceivablesStoreActions.ActionTypes.SELECT_RECEIVABLES_CALENDAR),
      switchMap((action: any) => {
        const { initialDate, finalDate } = action.payload;

        const filtered = this.filterByDate(
          mockCalendar,
          (d) => d.sortingDate,
          initialDate,
          finalDate,
        );

        return of(filtered).pipe(
          map(
            (result) =>
              new ReceivablesStoreActions.LoadReceivablesCalendarAction({
                result,
              }),
          ),
        );
      }),
    ),
  );

  // =============================
  // EXCEL DETAIL
  // =============================
  loadExcelReceivablesDetailEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        ReceivablesStoreActions.ActionTypes.SELECT_RECEIVABLES_DETAIL_EXCEL,
      ),
      switchMap((action: any) => {
        const { initialDate, finalDate } = action.payload;

        const filtered = this.filterByDate(
          mockDetails,
          (d) => new Date(d.saleDate),
          initialDate,
          finalDate,
        );

        return of(filtered).pipe(
          map(
            (result) =>
              new ReceivablesStoreActions.LoadReceivablesDetailExcelAction({
                result,
              }),
          ),
        );
      }),
    ),
  );

  // =============================
  // EXCEL CALENDAR
  // =============================
  loadExcelReceivablesCalendarEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        ReceivablesStoreActions.ActionTypes.SELECT_RECEIVABLES_CALENDAR_EXCEL,
      ),
      switchMap((action: any) => {
        const { initialDate, finalDate } = action.payload;

        const filtered = this.filterByDate(
          mockCalendar,
          (d) => d.sortingDate,
          initialDate,
          finalDate,
        );

        return of(filtered).pipe(
          map(
            (result) =>
              new ReceivablesStoreActions.LoadReceivablesCalendarExcelAction({
                result,
              }),
          ),
        );
      }),
    ),
  );

  // =============================
  // ADJUSTMENTS CALENDAR
  // =============================
  loadAdjustmentsCalendarEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReceivablesStoreActions.ActionTypes.SELECT_ADJUSTMENTS_CALENDAR),
      switchMap((action: any) => {
        const { initialDate, finalDate } = action.payload;

        const filtered = this.filterByDate(
          mockAdjustments,
          (d) => d.releaseDate,
          initialDate,
          finalDate,
        );

        return of(filtered).pipe(
          map(
            (result) =>
              new ReceivablesStoreActions.LoadAdjustmentsCalendarAction({
                result,
              }),
          ),
        );
      }),
    ),
  );

  // =============================
  // ADJUSTMENTS DETAIL
  // =============================
  loadAdjustmentsDetailEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReceivablesStoreActions.ActionTypes.SELECT_ADJUSTMENTS_DETAIL),
      switchMap(() =>
        of(mockAdjustments).pipe(
          map(
            (result) =>
              new ReceivablesStoreActions.LoadAdjustmentsDetailAction({
                result,
              }),
          ),
        ),
      ),
    ),
  );

  // =============================
  // ADJUSTMENTS SUMMARY
  // =============================
  loadAdjustmentsSummaryEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReceivablesStoreActions.ActionTypes.SELECT_ADJUSTMENTS_SUMMARY),
      switchMap(() =>
        of(mockAdjustments).pipe(
          map(
            (result) =>
              new ReceivablesStoreActions.LoadAdjustmentsSummaryAction({
                result,
              }),
          ),
        ),
      ),
    ),
  );

  // =============================
  // LAST UPDATE
  // =============================
  loadLastUpdateDateReceivableEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        ReceivablesStoreActions.ActionTypes.SELECT_LAST_UPDATE_DATE_RECEIVABLES,
      ),
      switchMap(() =>
        of(mockLastUpdate).pipe(
          map(
            (result) =>
              new ReceivablesStoreActions.LoadLastUpdateDateReceivablesAction({
                result,
              }),
          ),
        ),
      ),
    ),
  );
}
