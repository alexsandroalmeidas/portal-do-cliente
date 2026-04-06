import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { AppState } from './../../root-store/state';
import * as SalesStoreActions from './sales.actions';

import {
  mockDetails,
  mockLastUpdate,
  mockLastSales,
  buildCalendar,
} from './sales.mock';

import { SalesCalendar, SalesDetail, SummaryLastSales } from './sales.models';

// 🔥 IMPORT DO MOCK DE UID
import { mockEstablishments } from '../administration-store/administration.mock';

@Injectable({
  providedIn: 'root',
})
export class SalesStoreEffects {
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

  /* =========================
     SUMMARY
  ========================= */

  loadSalesSummaryEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SalesStoreActions.ActionTypes.SELECT_SUMMARY_CARD_SALES),
      switchMap((action: any) => {
        const { initialDate, finalDate, uids, documentNumber } = action.payload;

        const filtered = this.applyFilters(
          mockDetails,
          (d) => new Date(d.saleDate),
          initialDate,
          finalDate,
          documentNumber,
          uids,
        );

        // 🔥 AGRUPAMENTOS
        const debit = filtered.filter((d) => d.isDebit);
        const credit = filtered.filter((d) => d.isCredit);
        const pix = filtered.filter((d) => d.isPix);
        const voucher = filtered.filter((d) => d.isVoucher);

        // 🔥 SOMAS
        const totalAmount = filtered.reduce((s, d) => s + d.saleAmount, 0);
        const debitAmount = debit.reduce((s, d) => s + d.saleAmount, 0);
        const creditAmount = credit.reduce((s, d) => s + d.saleAmount, 0);
        const pixAmount = pix.reduce((s, d) => s + d.saleAmount, 0);
        const voucherAmount = voucher.reduce((s, d) => s + d.saleAmount, 0);

        // 🔥 COUNTS
        const totalCount = filtered.length;
        const debitCount = debit.length;
        const creditCount = credit.length;
        const pixCount = pix.length;
        const voucherCount = voucher.length;

        const percent = (v: number, t: number) =>
          t ? ((v / t) * 100).toFixed(2) : '0';

        const result = {
          totalAmount,
          totalCount,

          debitAmount,
          debitAmountPercent: percent(debitAmount, totalAmount),
          debitCount,
          debitPercent: percent(debitCount, totalCount),

          creditAmount,
          creditAmountPercent: percent(creditAmount, totalAmount),
          creditCount,
          creditPercent: percent(creditCount, totalCount),

          voucherAmount,
          voucherAmountPercent: percent(voucherAmount, totalAmount),
          voucherCount,
          voucherCountPercent: percent(voucherCount, totalCount),

          pixAmount,
          pixAmountPercent: percent(pixAmount, totalAmount),
          pixCount,
          pixCountPercent: percent(pixCount, totalCount),

          approvedCount: totalCount,
          approvedAmount: totalAmount,
        };

        return of(result).pipe(
          map(
            (result) =>
              new SalesStoreActions.LoadSalesSummaryAction({ result }),
          ),
        );
      }),
    ),
  );

  /* =========================
     DETAILS
  ========================= */

  loadSalesDetailEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SalesStoreActions.ActionTypes.SELECT_SALES_DETAIL),
      switchMap((action: any) => {
        const { initialDate, finalDate, documentNumber, uids } = action.payload;

        const filtered = this.applyFilters(
          mockDetails,
          (d) => new Date(d.saleDate),
          initialDate,
          finalDate,
          documentNumber,
          uids,
        );

        return of(filtered).pipe(
          map(
            (result) => new SalesStoreActions.LoadSalesDetailAction({ result }),
          ),
        );
      }),
    ),
  );

  /* =========================
     CALENDAR
  ========================= */

  loadSalesCalendarEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SalesStoreActions.ActionTypes.SELECT_SALES_CALENDAR),
      switchMap((action: any) => {
        const { initialDate, finalDate, documentNumber, uids } = action.payload;

        // 🔥 1. filtra detalhes
        const filteredDetails = this.applyFilters(
          mockDetails,
          (d) => new Date(d.saleDate),
          initialDate,
          finalDate,
          documentNumber,
          uids,
        );

        // 🔥 2. monta calendário baseado nos dados filtrados
        const calendar = buildCalendar(filteredDetails);

        return of(calendar).pipe(
          map(
            (result) =>
              new SalesStoreActions.LoadSalesCalendarAction({ result }),
          ),
        );
      }),
    ),
  );

  /* =========================
     EXCEL - DETAILS
  ========================= */

  loadExcelSalesDetailEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SalesStoreActions.ActionTypes.SELECT_SALES_DETAIL_EXCEL),
      switchMap((action: any) => {
        const { initialDate, finalDate } = action.payload;

        const filtered = this.applyFilters(
          mockDetails,
          (d) => new Date(d.saleDate),
          initialDate,
          finalDate,
        );

        return of(filtered).pipe(
          map(
            (result) =>
              new SalesStoreActions.LoadSalesDetailExcelAction({ result }),
          ),
        );
      }),
    ),
  );

  /* =========================
     EXCEL - CALENDAR
  ========================= */

  loadExcelSalesCalendarEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SalesStoreActions.ActionTypes.SELECT_SALES_CALENDAR_EXCEL),
      switchMap((action: any) => {
        const { initialDate, finalDate } = action.payload;

        const filteredDetails = this.applyFilters(
          mockDetails,
          (d) => new Date(d.saleDate),
          initialDate,
          finalDate,
        );

        const calendar = buildCalendar(filteredDetails);

        return of(calendar).pipe(
          map(
            (result) =>
              new SalesStoreActions.LoadSalesCalendarExcelAction({
                result,
              }),
          ),
        );
      }),
    ),
  );

  /* =========================
     LAST UPDATE
  ========================= */

  loadLastUpdateDateSalesEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SalesStoreActions.ActionTypes.SELECT_LAST_UPDATE_DATE_SALES),
      switchMap(() =>
        of(mockLastUpdate).pipe(
          map(
            (result) =>
              new SalesStoreActions.LoadLastUpdateDateSalesAction({
                result,
              }),
          ),
        ),
      ),
    ),
  );

  /* =========================
     LAST SALES
  ========================= */

  loadLastSalesSummaryEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SalesStoreActions.ActionTypes.SELECT_LAST_SALES_SUMMARY),
      switchMap((action: any) => {
        const { initialDate, finalDate, documentNumber, uids } = action.payload;

        const filtered = this.applyFilters(
          mockLastSales,
          (d: SummaryLastSales) => d.saleDate,
          initialDate,
          finalDate,
          documentNumber,
          uids,
        );

        return of(filtered).pipe(
          map(
            (result) =>
              new SalesStoreActions.LoadLastSalesSummaryAction({
                result,
              }),
          ),
        );
      }),
    ),
  );
}
