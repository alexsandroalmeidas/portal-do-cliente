import { ProxyRequest } from '@/shared/models/proxy-request';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { environment as env } from '../../../environments/environment';
import {
  Adjustment,
  LastUpdateDateReceivables,
  Receivable,
  ReceivableCalendar,
  ReceivableDetail,
  SummaryCardReceivables
} from './receivables.models';

@Injectable({ providedIn: 'root' })
export class ReceivablesService {
  private readonly proxyUrl = `${env.proxyBaseUrl}/bff/proxy/receivables`;

  constructor(private http: HttpClient) {}

  private formatDate(inputDate?: string, adjustEndOfDay: boolean = false): string {
    const date = inputDate ? new Date(inputDate) : new Date();
    if (adjustEndOfDay) {
      date.setHours(23, 59, 59, 999);
    }
    return date.date().format().toDateString();
  }

  postReceivables(
    initialDate: string,
    finalDate: string,
    uids: string[]
  ): Observable<Receivable[]> {
    const proxyRequest: ProxyRequest = {
      method: 'POST',
      path: `api/receivables`,
      body: {
        uids,
        initialDateS: this.formatDate(initialDate),
        finalDateS: this.formatDate(finalDate, true)
      }
    };

    return this.http.post<Receivable[]>(`${this.proxyUrl}`, proxyRequest).pipe(take(1));
  }

  postSummaryCardReceivables(
    initialDate: string,
    finalDate: string,
    uids: string[]
  ): Observable<SummaryCardReceivables> {
    const proxyRequest: ProxyRequest = {
      method: 'POST',
      path: `api/receivables/summary-card-receivables`,
      body: {
        uids,
        initialDateS: this.formatDate(initialDate),
        finalDateS: this.formatDate(finalDate, true)
      }
    };

    return this.http.post<SummaryCardReceivables>(`${this.proxyUrl}`, proxyRequest).pipe(take(1));
  }

  postCalendar(
    initialDate: string,
    finalDate: string,
    uids: string[]
  ): Observable<ReceivableCalendar[]> {
    const proxyRequest: ProxyRequest = {
      method: 'POST',
      path: `api/receivables/calendar-receivables`,
      body: {
        uids,
        initialDateS: this.formatDate(initialDate),
        finalDateS: this.formatDate(finalDate, true)
      }
    };

    return this.http.post<ReceivableCalendar[]>(`${this.proxyUrl}`, proxyRequest).pipe(take(1));
  }

  postDetail(
    initialDate: string,
    finalDate: string,
    uids: string[]
  ): Observable<ReceivableDetail[]> {
    const proxyRequest: ProxyRequest = {
      method: 'POST',
      path: `api/receivables/detail-receivables`,
      body: {
        uids,
        initialDateS: this.formatDate(initialDate),
        finalDateS: this.formatDate(finalDate, true)
      }
    };

    return this.http.post<ReceivableDetail[]>(`${this.proxyUrl}`, proxyRequest).pipe(take(1));
  }

  postExcelDetail(
    initialDate: string,
    finalDate: string,
    uids: string[],
    dates?: Date[]
  ): Observable<Blob> {
    const proxyRequest: ProxyRequest = {
      method: 'POST',
      path: `api/receivables/download/excel/detail`,
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
      path: `api/receivables/download/excel/calendar`,
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

  postAdjustments(
    initialDate: string,
    finalDate: string,
    uids: string[]
  ): Observable<Adjustment[]> {
    const proxyRequest: ProxyRequest = {
      method: 'POST',
      path: `api/adjustments`,
      body: {
        uids,
        initialDateS: this.formatDate(initialDate),
        finalDateS: this.formatDate(finalDate, true)
      }
    };

    return this.http.post<Adjustment[]>(`${this.proxyUrl}`, proxyRequest).pipe(take(1));
  }

  getLastUpdateDate(): Observable<LastUpdateDateReceivables> {
    const proxyRequest: ProxyRequest = {
      method: 'GET',
      path: `api/receivables/last-update-date`
    };

    return this.http
      .post<LastUpdateDateReceivables>(`${this.proxyUrl}`, proxyRequest)
      .pipe(take(1));
  }
}
