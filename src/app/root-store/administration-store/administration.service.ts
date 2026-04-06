import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { GenericApiResult } from 'src/app/shared/models/api-result';
import { environment as env } from '../../../environments/environment';
import {
  AddPhoneNumberResponse,
  EconomicGroupBankingAccountsResponse,
  EconomicGroupPhoneNumberResponse,
  EconomicGroupRatesResponse,
  EconomicGroupReserveResponse,
  Establishment,
} from './administration.models';
import { ProxyRequest } from 'src/app/shared/models/proxy-request';

@Injectable()
export class AdministrationService {
  private readonly proxyUrl = `${env.proxyBaseUrl}/bff/proxy/administration`;

  constructor(private http: HttpClient) {}

  getEconomicGroup(eid: string): Observable<Establishment[]> {
    const proxyRequest: ProxyRequest = {
      method: 'GET',
      path: `api/economic-groups/${eid}`,
    };

    return this.http
      .post<Establishment[]>(`${this.proxyUrl}`, proxyRequest)
      .pipe(take(1));
  }

  addPhoneNumber(
    email: string,
    phoneNumber: string,
    uids: string[],
  ): Observable<GenericApiResult<AddPhoneNumberResponse>> {
    const phoneNumberHasDDI = phoneNumber.slice(0, 2) === '55';

    const proxyRequest: ProxyRequest = {
      method: 'POST',
      path: 'api/economic-groups/add-phone',
      body: {
        email,
        phoneNumber: phoneNumberHasDDI ? phoneNumber : `55${phoneNumber}`,
        uids,
      },
    };

    return this.http
      .post<
        GenericApiResult<AddPhoneNumberResponse>
      >(`${this.proxyUrl}`, proxyRequest)
      .pipe(take(1));
  }

  getEconomicGroupPhone(
    email: string,
  ): Observable<GenericApiResult<EconomicGroupPhoneNumberResponse>> {
    const proxyRequest: ProxyRequest = {
      method: 'GET',
      path: 'api/economic-groups/phone',
      query: {
        email,
      },
    };

    return this.http
      .post<
        GenericApiResult<EconomicGroupPhoneNumberResponse>
      >(`${this.proxyUrl}`, proxyRequest)
      .pipe(take(1));
  }

  getEconomicGroupRates(
    uid: string,
  ): Observable<GenericApiResult<EconomicGroupRatesResponse>> {
    const proxyRequest: ProxyRequest = {
      method: 'GET',
      path: `api/economic-groups/${uid}/get-rates`,
    };

    return this.http
      .post<
        GenericApiResult<EconomicGroupRatesResponse>
      >(`${this.proxyUrl}`, proxyRequest)
      .pipe(take(1));
  }

  getEconomicGroupReserve(
    uids: string[],
  ): Observable<GenericApiResult<EconomicGroupReserveResponse>> {
    const proxyRequest: ProxyRequest = {
      method: 'POST',
      path: `api/economic-groups/get-rate-reserve`,
      body: {
        uids,
      },
    };

    return this.http
      .post<
        GenericApiResult<EconomicGroupRatesResponse>
      >(`${this.proxyUrl}`, proxyRequest)
      .pipe(take(1));
  }

  getEconomicBankingAccounts(
    uid: string,
  ): Observable<GenericApiResult<EconomicGroupBankingAccountsResponse>> {
    const proxyRequest: ProxyRequest = {
      method: 'GET',
      path: `api/economic-groups/${uid}/get-banking-account`,
    };

    return this.http
      .post<
        GenericApiResult<EconomicGroupBankingAccountsResponse>
      >(`${this.proxyUrl}`, proxyRequest)
      .pipe(take(1));
  }
}
