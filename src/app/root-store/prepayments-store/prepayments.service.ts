import { ProxyRequest } from '@/shared/models/proxy-request';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';
import { environment as env } from '../../../environments/environment';
import {
  BankingAccountResponse,
  CancelScheduledPrepaymentResponse,
  FinalizePunctualRequest,
  FinalizePunctualResponse,
  FinalizeScheduledRequest,
  FinalizeScheduledResponse,
  GetAccreditationsResponse,
  GetAuthorizationResponse,
  GetHistoricResponse,
  GetRateResponse,
  GetScheduledFinalizedResponse,
  LeadAction,
  ReceivablesScheduleGroupingResponse,
  ReceivablesScheduleResponse,
  SaveLeadResponse
} from './prepayments.models';

@Injectable()
export class PrepaymentsService {
  private readonly proxyUrl = `${env.proxyBaseUrl}/bff/proxy/prepayments`;

  constructor(private http: HttpClient) {}

  private createRequestApi(
    userName: string,
    deviceType: string,
    uuid: string,
    additionalData?: any
  ) {
    return {
      userName,
      deviceType,
      uuid,
      ...additionalData
    };
  }

  getReceivablesScheduleInformation(
    userName: string,
    uid: string,
    deviceType: string,
    uuid: string
  ): Observable<ReceivablesScheduleResponse> {
    const proxyRequest: ProxyRequest = {
      method: 'POST',
      path: 'api/punctual-prepayments/information',
      body: this.createRequestApi(userName, deviceType, uuid, { uid })
    };

    return this.http
      .post<ReceivablesScheduleResponse>(`${this.proxyUrl}`, proxyRequest)
      .pipe(take(1));
  }

  getScheduledBankingAccount(
    userName: string,
    uids: string[],
    deviceType: string,
    uuid: string
  ): Observable<BankingAccountResponse> {
    const proxyRequest: ProxyRequest = {
      method: 'POST',
      path: 'api/scheduled-prepayments/banking-accounts',
      body: this.createRequestApi(userName, deviceType, uuid, { uids })
    };

    return this.http.post<BankingAccountResponse>(`${this.proxyUrl}`, proxyRequest).pipe(take(1));
  }

  getReceivablesScheduleInformationGrouping(
    userName: string,
    uids: string[],
    deviceType: string,
    uuid: string
  ): Observable<ReceivablesScheduleGroupingResponse[]> {
    const proxyRequest: ProxyRequest = {
      method: 'POST',
      path: 'api/punctual-prepayments/information-grouping',
      body: this.createRequestApi(userName, deviceType, uuid, { uids })
    };

    return this.http
      .post<ReceivablesScheduleGroupingResponse[]>(`${this.proxyUrl}`, proxyRequest)
      .pipe(take(1));
  }

  requestReceivablesSchedule(
    userName: string,
    uid: string,
    deviceType: string,
    uuid: string
  ): Observable<any> {
    const proxyRequest: ProxyRequest = {
      method: 'POST',
      path: 'api/punctual-prepayments/request',
      body: this.createRequestApi(userName, deviceType, uuid, { uid })
    };

    return this.http.post<any>(`${this.proxyUrl}`, proxyRequest).pipe(take(1));
  }

  finalizePunctualPrepayment(
    userName: string,
    uid: string,
    deviceType: string,
    uuid: string,
    listSchedules: FinalizePunctualRequest[]
  ): Observable<FinalizePunctualResponse> {
    const proxyRequest: ProxyRequest = {
      method: 'POST',
      path: 'api/punctual-prepayments/finalize',
      body: this.createRequestApi(userName, deviceType, uuid, { uid, listSchedules })
    };

    return this.http.post<FinalizePunctualResponse>(`${this.proxyUrl}`, proxyRequest).pipe(take(1));
  }

  getScheduledRate(
    userName: string,
    uid: string,
    deviceType: string,
    uuid: string,
    prepaymentAmount: number
  ): Observable<GetRateResponse> {
    const proxyRequest: ProxyRequest = {
      method: 'POST',
      path: 'api/scheduled-prepayments/rate',
      body: this.createRequestApi(userName, deviceType, uuid, { uid, prepaymentAmount })
    };

    return this.http.post<GetRateResponse>(`${this.proxyUrl}`, proxyRequest).pipe(take(1));
  }

  finalizeScheduledPrepayment(
    userName: string,
    deviceType: string,
    uuid: string,
    request: FinalizeScheduledRequest
  ): Observable<FinalizeScheduledResponse> {
    const proxyRequest: ProxyRequest = {
      method: 'POST',
      path: 'api/scheduled-prepayments/finalize',
      body: this.createRequestApi(userName, deviceType, uuid, { ...request })
    };

    return this.http
      .post<FinalizeScheduledResponse>(`${this.proxyUrl}`, proxyRequest)
      .pipe(take(1));
  }

  getAuthorization(
    userName: string,
    uid: string,
    deviceType: string,
    uuid: string
  ): Observable<GetAuthorizationResponse> {
    const proxyRequest: ProxyRequest = {
      method: 'POST',
      path: 'api/authorization-prepayments',
      body: this.createRequestApi(userName, deviceType, uuid, { uid })
    };

    return this.http.post<GetAuthorizationResponse>(`${this.proxyUrl}`, proxyRequest).pipe(take(1));
  }

  postAuthorize(
    userName: string,
    uid: string,
    deviceType: string,
    uuid: string
  ): Observable<GetAuthorizationResponse> {
    const proxyRequest: ProxyRequest = {
      method: 'POST',
      path: `api/authorization-prepayments/${uid}/authorize`,
      body: this.createRequestApi(userName, deviceType, uuid, { uid })
    };

    return this.http.post<GetAuthorizationResponse>(`${this.proxyUrl}`, proxyRequest).pipe(take(1));
  }

  getScheduledFinalized(
    userName: string,
    uid: string,
    deviceType: string,
    uuid: string
  ): Observable<GetScheduledFinalizedResponse> {
    const proxyRequest: ProxyRequest = {
      method: 'POST',
      path: `api/scheduled-prepayments/${uid}/get-finalized`,
      body: this.createRequestApi(userName, deviceType, uuid, { uid })
    };

    return this.http
      .post<GetScheduledFinalizedResponse>(`${this.proxyUrl}`, proxyRequest)
      .pipe(take(1));
  }

  cancelScheduledFinalized(
    userName: string,
    uid: string,
    deviceType: string,
    uuid: string,
    scheduledFinalizedId: string
  ): Observable<CancelScheduledPrepaymentResponse> {
    const proxyRequest: ProxyRequest = {
      method: 'POST',
      path: `api/scheduled-prepayments/${scheduledFinalizedId}/cancel`,
      body: this.createRequestApi(userName, deviceType, uuid, { uid })
    };

    return this.http
      .post<CancelScheduledPrepaymentResponse>(`${this.proxyUrl}`, proxyRequest)
      .pipe(take(1));
  }

  getHistoric(
    userName: string,
    uid: string,
    deviceType: string,
    uuid: string,
    initialDate: string,
    finalDate: string
  ): Observable<GetHistoricResponse> {
    const initDate = initialDate || new Date().toISOString();
    const finDate = finalDate || new Date().toISOString();

    const proxyRequest: ProxyRequest = {
      method: 'POST',
      path: `api/punctual-prepayments/${uid}/get-historic`,
      body: this.createRequestApi(userName, deviceType, uuid, {
        uid,
        initialDate: initDate,
        finalDate: finDate
      })
    };

    return this.http.post<GetHistoricResponse>(`${this.proxyUrl}`, proxyRequest).pipe(take(1));
  }

  getPunctualAccreditations(
    userName: string,
    uid: string,
    deviceType: string,
    uuid: string
  ): Observable<GetAccreditationsResponse> {
    const proxyRequest: ProxyRequest = {
      method: 'POST',
      path: `api/punctual-prepayments/${uid}/get-accreditations`,
      body: this.createRequestApi(userName, deviceType, uuid, { uid })
    };

    return this.http
      .post<GetAccreditationsResponse>(`${this.proxyUrl}`, proxyRequest)
      .pipe(take(1));
  }

  getScheduledAccreditations(
    userName: string,
    uid: string,
    deviceType: string,
    uuid: string
  ): Observable<GetAccreditationsResponse> {
    const proxyRequest: ProxyRequest = {
      method: 'POST',
      path: `api/scheduled-prepayments/${uid}/get-accreditations`,
      body: this.createRequestApi(userName, deviceType, uuid, { uid })
    };

    return this.http
      .post<GetAccreditationsResponse>(`${this.proxyUrl}`, proxyRequest)
      .pipe(take(1));
  }

  postSaveLead(
    userName: string,
    uid: string,
    deviceType: string,
    uuid: string,
    leadAction: LeadAction,
    itStarted: boolean,
    finished: boolean,
    canceled: boolean
  ): Observable<SaveLeadResponse> {
    const proxyRequest: ProxyRequest = {
      method: 'POST',
      path: `api/lead/${uid}/save`,
      body: this.createRequestApi(userName, deviceType, uuid, {
        uid,
        leadAction,
        itStarted,
        finished,
        canceled
      })
    };

    return this.http.post<SaveLeadResponse>(`${this.proxyUrl}`, proxyRequest).pipe(take(1));
  }

  getPunctualRate(
    userName: string,
    uid: string,
    deviceType: string,
    uuid: string,
    prepaymentAmount: number
  ): Observable<GetRateResponse> {
    const proxyRequest: ProxyRequest = {
      method: 'POST',
      path: `api/punctual-prepayments/rate`,
      body: this.createRequestApi(userName, deviceType, uuid, { uid, prepaymentAmount })
    };

    return this.http.post<GetRateResponse>(`${this.proxyUrl}`, proxyRequest).pipe(take(1));
  }
}
