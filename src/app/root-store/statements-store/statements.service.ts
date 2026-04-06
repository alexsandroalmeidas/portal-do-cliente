import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { environment as env } from '../../../environments/environment';
import {
  Statement,
  StatementScheduling,
  StatementSchedulingRequest,
} from './statements.models';
import { ProxyRequest } from 'src/app/shared/models/proxy-request';

@Injectable({ providedIn: 'root' })
export class StatementsService {
  private readonly proxyUrl = `${env.proxyBaseUrl}/bff/proxy/statements`;

  constructor(private http: HttpClient) {}

  postStatements(uids: string[]): Observable<Statement[]> {
    const proxyRequest: ProxyRequest = {
      method: 'POST',
      path: 'api/statements',
      body: {
        uids,
      },
    };

    return this.http
      .post<Statement[]>(`${this.proxyUrl}`, proxyRequest)
      .pipe(take(1));
  }

  postDownloadStatementsFileTxt(fileName: string): Observable<any> {
    const proxyRequest: ProxyRequest = {
      method: 'POST',
      path: `api/statements/download-txt`,
      body: {
        fileName,
      },
    };

    return this.http
      .post(`${this.proxyUrl}`, proxyRequest, {
        reportProgress: true,
        responseType: 'blob',
        observe: 'response',
      })
      .pipe(take(1));
  }

  postDownloadStatementsFileXml(fileName: string): Observable<any> {
    const proxyRequest: ProxyRequest = {
      method: 'POST',
      path: `api/statements/download-xml`,
      body: {
        fileName,
      },
    };

    return this.http
      .post(`${this.proxyUrl}`, proxyRequest, {
        reportProgress: true,
        responseType: 'blob',
        observe: 'response',
      })
      .pipe(take(1));
  }

  postLastStatementsScheduling(
    uids: string[],
  ): Observable<StatementScheduling[]> {
    const proxyRequest: ProxyRequest = {
      method: 'POST',
      path: 'api/statements/last-schedulings',
      body: {
        uids,
      },
    };

    return this.http
      .post<StatementScheduling[]>(`${this.proxyUrl}`, proxyRequest)
      .pipe(take(1));
  }

  postAddStatementsScheduling(
    request: StatementSchedulingRequest,
    userId: string = '',
  ): Observable<StatementScheduling> {
    const initDate = !!request.initialDate
      ? new Date(request.initialDate).date().format()
      : new Date().date().format();

    const finDate = !!request.finalDate
      ? new Date(request.finalDate).date().addDays(1).addSeconds(-1).format()
      : new Date().date().addDays(1).addSeconds(-1).format();

    const proxyRequest: ProxyRequest = {
      method: 'POST',
      path: 'api/statements/add-scheduling',
      body: {
        initialDate: `${initDate}`,
        finalDate: `${finDate}`,
        uids: request.uids,
        userId,
      },
    };

    return this.http
      .post<StatementScheduling>(`${this.proxyUrl}`, proxyRequest)
      .pipe(take(1));
  }

  postUploadFileStatementValidate(fileToUpload: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);

    // 🔑 METADADOS DO PROXY
    formData.append('__method', 'POST');
    formData.append('__path', 'api/statements/upload-file-validate');

    return this.http
      .post(`${this.proxyUrl}`, formData, {
        reportProgress: true,
        responseType: 'blob',
        observe: 'response',
      })
      .pipe(take(1));
  }
}
