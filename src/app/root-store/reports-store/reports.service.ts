import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { environment as env } from '../../../environments/environment';
import {
  ReportRequest as ReportRequestResponse,
  RequestReport,
} from './reports.models';
import { ProxyRequest } from 'src/app/shared/models/proxy-request';

@Injectable()
export class ReportsService {
  private readonly proxyUrl = `${env.proxyBaseUrl}/bff/proxy/reports`;

  constructor(private http: HttpClient) {}

  // Função auxiliar para criar o objeto de requisição
  private createRequestPayload(request: RequestReport, userId: string): any {
    const stringifyObj = JSON.stringify(request.establishmentsToPush);

    return {
      initialDate: `${request.initialDate}`,
      finalDate: `${request.finalDate}`,
      uids: request.uids,
      userId,
      equipments: request.equipments,
      establishmentsToPush: btoa(stringifyObj), // Codificando em Base64
    };
  }

  getRequestsReports(userId: string = ''): Observable<ReportRequestResponse[]> {
    const proxyRequest: ProxyRequest = {
      method: 'GET',
      path: 'api/movements',
      query: {
        userId,
      },
    };

    return this.http
      .post<ReportRequestResponse[]>(`${this.proxyUrl}`, proxyRequest)
      .pipe(take(1));
  }

  getLastRequestReports(
    userId: string = '',
  ): Observable<ReportRequestResponse> {
    const proxyRequest: ProxyRequest = {
      method: 'GET',
      path: 'api/movements/last',
      query: {
        userId,
      },
    };

    return this.http
      .post<ReportRequestResponse>(`${this.proxyUrl}`, proxyRequest)
      .pipe(take(1));
  }

  postRequestReceivablesReports(
    request: RequestReport,
    userId: string = '',
  ): Observable<ReportRequestResponse> {
    const proxyRequest: ProxyRequest = {
      method: 'POST',
      path: 'api/receivables',
      body: this.createRequestPayload(request, userId),
      query: {
        userId,
      },
    };

    return this.http
      .post<ReportRequestResponse>(`${this.proxyUrl}`, proxyRequest)
      .pipe(take(1));
  }

  postRequestSalesReports(
    request: RequestReport,
    userId: string = '',
  ): Observable<ReportRequestResponse> {
    const proxyRequest: ProxyRequest = {
      method: 'POST',
      path: 'api/sales',
      body: this.createRequestPayload(request, userId),
      query: {
        userId,
      },
    };

    return this.http
      .post<ReportRequestResponse>(`${this.proxyUrl}`, proxyRequest)
      .pipe(take(1));
  }

  postRequestAllCardsReports(
    request: RequestReport,
    userId: string = '',
  ): Observable<ReportRequestResponse> {
    const proxyRequest: ProxyRequest = {
      method: 'POST',
      path: 'api/sales/all-cards',
      body: this.createRequestPayload(request, userId),
      query: {
        userId,
      },
    };

    return this.http
      .post<ReportRequestResponse>(`${this.proxyUrl}`, proxyRequest)
      .pipe(take(1));
  }

  downloadAllCardsReportExcel(id: number): Observable<any> {
    const proxyRequest: ProxyRequest = {
      method: 'GET',
      path: `api/sales/${id}/all-cards/download/excel`,
    };

    return this.http
      .post(`${this.proxyUrl}`, proxyRequest, {
        reportProgress: true,
        responseType: 'blob',
        observe: 'response',
      })
      .pipe(take(1));
  }

  downloadSalesReportExcel(id: number): Observable<any> {
    const proxyRequest: ProxyRequest = {
      method: 'GET',
      path: `api/sales/${id}/download/excel`,
    };

    return this.http
      .post(`${this.proxyUrl}`, proxyRequest, {
        reportProgress: true,
        responseType: 'blob',
        observe: 'response',
      })
      .pipe(take(1));
  }

  downloadReceivablesReportExcel(id: number): Observable<any> {
    const proxyRequest: ProxyRequest = {
      method: 'GET',
      path: `api/receivables/${id}/download/excel`,
    };

    return this.http
      .post(`${this.proxyUrl}`, proxyRequest, {
        reportProgress: true,
        responseType: 'blob',
        observe: 'response',
      })
      .pipe(take(1));
  }
}
