import { ProxyRequest } from '@/shared/models/proxy-request';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';
import { environment as env } from '../../../environments/environment';
import {
  LastUpdateDateSales,
  SalesCalendar,
  SalesDetail,
  SummaryCardSales,
  SummaryLastSales,
  Transaction
} from './sales.models';

@Injectable({ providedIn: 'root' })
export class SalesService {
  private readonly proxyUrl = `${env.proxyBaseUrl}/bff/proxy/sales`;

  constructor(private http: HttpClient) {}

  private formatDate(inputDate?: string, adjustEndOfDay: boolean = false): string {
    const date = inputDate ? new Date(inputDate) : new Date();
    if (adjustEndOfDay) {
      date.setHours(23, 59, 59, 999);
    }
    return date.date().format().toDateString();
  }

  postSales(initialDate: string, finalDate: string, uids: string[]): Observable<Transaction[]> {
    const proxyRequest: ProxyRequest = {
      method: 'POST',
      path: `api/sales`,
      body: {
        uids,
        initialDateS: this.formatDate(initialDate),
        finalDateS: this.formatDate(finalDate, true)
      }
    };

    return this.http.post<Transaction[]>(`${this.proxyUrl}`, proxyRequest).pipe(take(1));
  }

  postSummaryCardSales(
    initialDate: string,
    finalDate: string,
    uids: string[]
  ): Observable<SummaryCardSales> {
    const proxyRequest: ProxyRequest = {
      method: 'POST',
      path: `api/sales/summary-card-sales`,
      body: {
        uids,
        initialDateS: this.formatDate(initialDate),
        finalDateS: this.formatDate(finalDate, true)
      }
    };

    return this.http.post<SummaryCardSales>(`${this.proxyUrl}`, proxyRequest).pipe(take(1));
  }

  postCalendar(
    initialDate: string,
    finalDate: string,
    uids: string[]
  ): Observable<SalesCalendar[]> {
    const proxyRequest: ProxyRequest = {
      method: 'POST',
      path: `api/sales/calendar-sales`,
      body: {
        uids,
        initialDateS: this.formatDate(initialDate),
        finalDateS: this.formatDate(finalDate, true)
      }
    };

    return this.http.post<SalesCalendar[]>(`${this.proxyUrl}`, proxyRequest).pipe(take(1));
  }

  postDetail(initialDate: string, finalDate: string, uids: string[]): Observable<SalesDetail[]> {
    const proxyRequest: ProxyRequest = {
      method: 'POST',
      path: `api/sales/detail-sales`,
      body: {
        uids,
        initialDateS: this.formatDate(initialDate),
        finalDateS: this.formatDate(finalDate, true)
      }
    };

    return this.http.post<SalesDetail[]>(`${this.proxyUrl}`, proxyRequest).pipe(take(1));
  }

  postSummaryLastSales(
    initialDate: string,
    finalDate: string,
    uids: string[]
  ): Observable<SummaryLastSales[]> {
    const proxyRequest: ProxyRequest = {
      method: 'POST',
      path: `api/sales/summary-last-sales`,
      body: {
        uids,
        initialDateS: this.formatDate(initialDate),
        finalDateS: this.formatDate(finalDate, true)
      }
    };

    return this.http.post<SummaryLastSales[]>(`${this.proxyUrl}`, proxyRequest).pipe(take(1));
  }

  postExcelDetail(
    initialDate: string,
    finalDate: string,
    uids: string[],
    dates?: Date[]
  ): Observable<Blob> {
    const proxyRequest: ProxyRequest = {
      method: 'POST',
      path: `api/sales/download/excel/detail`,
      body: {
        uids,
        initialDateS: this.formatDate(initialDate),
        finalDateS: this.formatDate(finalDate, true),
        dates: dates ?? null
      }
    };

    return this.http
      .post(`${this.proxyUrl}`, proxyRequest, {
        reportProgress: true,
        responseType: 'blob'
      })
      .pipe(take(1));
  }

  postExcelCalendar(
    initialDate: string,
    finalDate: string,
    uids: string[],
    dates: Date[]
  ): Observable<Blob> {
    const proxyRequest: ProxyRequest = {
      method: 'POST',
      path: `api/sales/download/excel/calendar`,
      body: {
        uids,
        initialDateS: this.formatDate(initialDate),
        finalDateS: this.formatDate(finalDate, true),
        dates: dates ?? null
      }
    };

    return this.http
      .post(`${this.proxyUrl}`, proxyRequest, {
        reportProgress: true,
        responseType: 'blob'
      })
      .pipe(take(1));
  }

  getLastUpdateDate(): Observable<LastUpdateDateSales> {
    const proxyRequest: ProxyRequest = {
      method: 'GET',
      path: `api/sales/last-update-date`
    };

    return this.http.post<LastUpdateDateSales>(`${this.proxyUrl}`, proxyRequest).pipe(take(1));
  }
}
