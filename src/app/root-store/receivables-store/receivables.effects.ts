import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { AppState } from '../state';
import * as ReceivablesStoreActions from './receivables.actions';

// 🔥 IMPORT DO MOCK DE UID
import { mockEstablishments } from '../administration-store/administration.mock';

import {
  mockDetails,
  mockCalendar,
  mockLastUpdate,
  mockAdjustments,
  mockReceivables,
  buildReceivablesCalendar,
  buildReceivablesSummaryFromCalendar,
} from './receivables.mock';
import { Receivable, ReceivableDetail } from './receivables.models';

@Injectable()
export class ReceivablesStoreEffects {
  constructor(
    private store$: Store<AppState>,
    private actions$: Actions,
  ) {}

  /* =========================
     HELPERS
  ========================= */

  isBetweenDates(date: Date, start: Date, end: Date): boolean {
    const d = new Date(date);

    const startDate = new Date(start);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(end);
    endDate.setHours(23, 59, 59, 999);

    return d >= startDate && d <= endDate;
  }

  // 🔥 RESOLVE UID → DOCUMENT NUMBER
  private resolveDocumentNumbers(uids?: string[]): string[] {
    if (!uids || uids.length === 0) return [];

    return mockEstablishments
      .filter((e) => uids.includes(e.uid))
      .map((e) => e.documentNumber);
  }

  // 🔥 FILTRO FINAL UNIFICADO
  private applyFilters<T>(
    items: T[],
    getDate: (item: T) => Date,
    start: Date,
    end: Date,
    documentNumber?: string,
    uids?: string[],
  ): T[] {
    const docsFromUid = this.resolveDocumentNumbers(uids);

    const finalDocs = [
      ...(documentNumber ? [String(documentNumber)] : []),
      ...docsFromUid,
    ];

    return items.filter((item: any) => {
      const matchDate = this.isBetweenDates(getDate(item), start, end);

      const matchDocument =
        finalDocs.length === 0 ||
        finalDocs.includes(String(item.documentNumber));

      return matchDate && matchDocument;
    });
  }

  // =============================
  // RECEIVABLES (LISTA)
  // =============================
  loadPastReceivablesEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReceivablesStoreActions.ActionTypes.SELECT_PAST_RECEIVABLES),
      switchMap((action: any) => {
        const { initialDate, finalDate, documentNumber, uids } = action.payload;

        let filtered = this.applyFilters(
          mockReceivables,
          (d) => d.sortingDate,
          initialDate,
          finalDate,
          documentNumber,
          uids,
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
        const { initialDate, finalDate, documentNumber, uids } = action.payload;

        const filteredReceivables = this.applyFilters(
          mockReceivables,
          (d) => d.paymentDate,
          initialDate,
          finalDate,
          documentNumber,
          uids,
        );

        const filteredAdjustments = this.applyFilters(
          mockAdjustments,
          (d) => d.releaseDate,
          initialDate,
          finalDate,
          documentNumber,
          uids,
        );

        // 🔥 BASE CORRETA
        const calendar = buildReceivablesCalendar(
          filteredReceivables,
          filteredAdjustments,
        );

        // 🔥 SUMMARY BASEADO NO CALENDAR
        const result = buildReceivablesSummaryFromCalendar(calendar);

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
        const { initialDate, finalDate, documentNumber, uids } = action.payload;

        const filtered = this.applyFilters(
          mockDetails,
          (d) => new Date(d.paymentDate),
          initialDate,
          finalDate,
          documentNumber,
          uids,
        );

        debugger;

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
        const { initialDate, finalDate, documentNumber, uids } = action.payload;

        debugger;
        const filteredReceivables = this.applyFilters(
          mockReceivables,
          (d) => d.paymentDate,
          initialDate,
          finalDate,
          documentNumber,
          uids,
        );

        const filteredAdjustments = this.applyFilters(
          mockAdjustments,
          (d) => d.releaseDate,
          initialDate,
          finalDate,
          documentNumber,
          uids,
        );

        const result = buildReceivablesCalendar(
          filteredReceivables,
          filteredAdjustments,
        );

        return of(result).pipe(
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
        const { initialDate, finalDate, documentNumber, uids } = action.payload;

        const filtered = this.applyFilters(
          mockDetails,
          (d) => new Date(d.paymentDate),
          initialDate,
          finalDate,
          documentNumber,
          uids,
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
        const { initialDate, finalDate, documentNumber, uids } = action.payload;

        const filtered = this.applyFilters(
          mockCalendar,
          (d) => d.sortingDate,
          initialDate,
          finalDate,
          documentNumber,
          uids,
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
        const { initialDate, finalDate, documentNumber, uids } = action.payload;

        const filtered = this.applyFilters(
          mockAdjustments,
          (d) => d.releaseDate,
          initialDate,
          finalDate,
          documentNumber,
          uids,
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
