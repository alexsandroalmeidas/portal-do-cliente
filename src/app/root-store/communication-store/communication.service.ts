import { ProxyRequest } from '@/shared/models/proxy-request';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { environment as env } from '../../../environments/environment';
import { ApiResult, GenericApiResult } from './../../shared/models/api-result';
import { Banner, Message, Notification } from './communication.models';

enum NotificationStatus {
  Read = 'read',
  Unread = 'unread',
  Displayed = 'displayed'
}

@Injectable()
export class CommunicationService {
  private readonly proxyUrl = `${env.proxyBaseUrl}/bff/proxy/communication`;

  constructor(private readonly http: HttpClient) {}

  associateUserCustomer(uid: string, user: string): Observable<ApiResult> {
    const proxyRequest: ProxyRequest = {
      method: 'POST',
      path: `api/establishments/${uid}`,
      body: {
        user
      }
    };

    return this.http.post<ApiResult>(`${this.proxyUrl}`, proxyRequest).pipe(take(1));
  }

  getNotifications(uids: string[]): Observable<Notification[]> {
    const proxyRequest: ProxyRequest = {
      method: 'POST',
      path: `api/notifications`,
      body: {
        uids
      }
    };

    return this.http.post<Notification[]>(`${this.proxyUrl}`, proxyRequest).pipe(take(1));
  }

  getNotification(id: number): Observable<Notification> {
    const proxyRequest: ProxyRequest = {
      method: 'GET',
      path: `api/notifications/${id}/notification`
    };

    return this.http.post<Notification>(`${this.proxyUrl}`, proxyRequest).pipe(take(1));
  }

  markNotificationRead(uid: string, id: number): Observable<ApiResult> {
    return this.patchNotificationAction(uid, id, 'read');
  }

  markUnreadNotification(uid: string, id: number): Observable<ApiResult> {
    return this.patchNotificationAction(uid, id, 'unread');
  }

  markNotificationDisplayed(uid: string, id: number): Observable<ApiResult> {
    return this.patchNotificationAction(uid, id, 'displayed');
  }

  private patchNotificationAction(uid: string, id: number, action: string): Observable<ApiResult> {
    const proxyRequest: ProxyRequest = {
      method: 'PATCH',
      path: `api/notifications/${uid}/${id}/${action}`
    };

    return this.http.post<ApiResult>(`${this.proxyUrl}`, proxyRequest).pipe(take(1));
  }

  updateNotificationStatus(
    uid: string,
    id: number,
    status: NotificationStatus
  ): Observable<ApiResult> {
    const proxyRequest: ProxyRequest = {
      method: 'PATCH',
      path: `api/notifications/${uid}/${id}/${status}`
    };

    return this.http.post<ApiResult>(`${this.proxyUrl}`, proxyRequest).pipe(take(1));
  }

  deleteNotification(uid: string, id: number): Observable<ApiResult> {
    const proxyRequest: ProxyRequest = {
      method: 'DELETE',
      path: `api/notifications/${uid}/${id}`
    };

    return this.http.post<ApiResult>(`${this.proxyUrl}`, proxyRequest).pipe(take(1));
  }

  registerMessage(
    user: string,
    title: string,
    text: string,
    establishments: { email: string; uid: string }[],
    pushNotification: boolean,
    allEstablishments: boolean
  ): Observable<Message> {
    const proxyRequest: ProxyRequest = {
      method: 'POST',
      path: `api/messages`,
      body: {
        user,
        title,
        text,
        establishments: btoa(JSON.stringify(establishments)),
        pushNotification,
        allEstablishments
      }
    };

    return this.http.post<Message>(`${this.proxyUrl}`, proxyRequest).pipe(take(1));
  }

  updateMessage(
    user: string,
    id: number,
    title: string,
    text: string,
    establishments: { email: string; uid: string }[],
    pushNotification: boolean,
    allEstablishments: boolean
  ): Observable<Message> {
    const proxyRequest: ProxyRequest = {
      method: 'PUT',
      path: `api/messages`,
      body: {
        id,
        user,
        title,
        text,
        establishments: btoa(JSON.stringify(establishments)),
        pushNotification,
        allEstablishments
      }
    };

    return this.http.post<Message>(`${this.proxyUrl}`, proxyRequest).pipe(take(1));
  }

  deleteMessageRegistration(user: string, id: string): Observable<Message> {
    const proxyRequest: ProxyRequest = {
      method: 'PUT',
      path: `api/messages/${id}/delete`,
      body: {
        user
      }
    };

    return this.http.post<Message>(`${this.proxyUrl}`, proxyRequest).pipe(take(1));
  }

  notifyRegistrationMessage(user: string, id: string): Observable<Message> {
    const proxyRequest: ProxyRequest = {
      method: 'PUT',
      path: `api/messages/${id}/notify`,
      body: {
        user
      }
    };

    return this.http.post<Message>(`${this.proxyUrl}`, proxyRequest).pipe(take(1));
  }

  getMessagesRegistration(userEmail: string): Observable<Message[]> {
    const proxyRequest: ProxyRequest = {
      method: 'POST',
      path: `api/messages/user-messages`,
      body: {
        userEmail
      }
    };

    return this.http.post<Message[]>(`${this.proxyUrl}`, proxyRequest).pipe(take(1));
  }

  getMessageRegistration(id: number): Observable<Message> {
    const proxyRequest: ProxyRequest = {
      method: 'GET',
      path: `api/messages/${id}/message`
    };

    return this.http.post<Message>(`${this.proxyUrl}`, proxyRequest).pipe(take(1));
  }

  getBannerImage(fileName: string): Observable<Blob> {
    return this.http
      .get(`${env.proxyBaseUrl}/bff/download/communication/api/banners/download/${fileName}`, {
        responseType: 'blob'
      })
      .pipe(take(1));
  }

  private processFileUpload(formData: FormData, file: File, key: string): void {
    const allowedTypes = ['image/png', 'image/jpeg'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error(`Somente arquivos PNG e JPG são permitidos para ${key}.`);
    }
    formData.append(key, file);
  }

  private createFormDataForBanner(
    user: string,
    url: string,
    initialDate: string,
    backgroundColor: string,
    finalDate?: string,
    portalfile?: File,
    appfile?: File,
    id?: number
  ): FormData {
    const formData = new FormData();
    formData.append('user', user);
    formData.append('url', url);
    formData.append('backgroundColor', backgroundColor);
    formData.append('initialDate', initialDate);
    if (finalDate) formData.append('finalDate', finalDate);
    if (id !== undefined) formData.append('id', `${id}`);
    if (portalfile) this.processFileUpload(formData, portalfile, 'portalFile');
    if (appfile) this.processFileUpload(formData, appfile, 'appFile');
    return formData;
  }

  addBanner(
    user: string,
    url: string,
    initialDate: string,
    backgroundColor: string,
    finalDate?: string,
    portalfile?: File,
    appfile?: File
  ): Observable<GenericApiResult<Banner>> {
    const formData = this.createFormDataForBanner(
      user,
      url,
      initialDate,
      backgroundColor,
      finalDate,
      portalfile,
      appfile
    );

    // 🔑 METADADOS DO PROXY
    formData.append('__method', 'POST');
    formData.append('__path', 'api/banners/add');

    return this.http.post<GenericApiResult<Banner>>(`${this.proxyUrl}`, formData).pipe(take(1));
  }

  updateBanner(
    id: number,
    user: string,
    url: string,
    initialDate: string,
    backgroundColor: string,
    finalDate?: string,
    portalfile?: File,
    appfile?: File
  ): Observable<GenericApiResult<Banner>> {
    const proxyRequest: ProxyRequest = {
      method: 'POST',
      path: `api/banners/update`,
      body: this.createFormDataForBanner(
        user,
        url,
        initialDate,
        backgroundColor,
        finalDate,
        portalfile,
        appfile,
        id
      )
    };

    return this.http.post<GenericApiResult<Banner>>(`${this.proxyUrl}`, proxyRequest).pipe(take(1));
  }

  deleteBannerRegistration(user: string, id: string): Observable<GenericApiResult<Banner>> {
    const proxyRequest: ProxyRequest = {
      method: 'PUT',
      path: `api/banners/${id}/delete`,
      body: {
        user
      }
    };

    return this.http.post<GenericApiResult<Banner>>(`${this.proxyUrl}`, proxyRequest).pipe(take(1));
  }

  getBannerRegistration(id: number): Observable<GenericApiResult<Banner>> {
    const proxyRequest: ProxyRequest = {
      method: 'GET',
      path: `api/banners/${id}/banner`
    };

    return this.http.post<GenericApiResult<Banner>>(`${this.proxyUrl}`, proxyRequest).pipe(take(1));
  }

  getBannersRegistration(): Observable<GenericApiResult<Banner[]>> {
    const proxyRequest: ProxyRequest = {
      method: 'GET',
      path: `api/banners`
    };

    return this.http
      .post<GenericApiResult<Banner[]>>(`${this.proxyUrl}`, proxyRequest)
      .pipe(take(1));
  }

  getActiveBanners(): Observable<GenericApiResult<Banner[]>> {
    const proxyRequest: ProxyRequest = {
      method: 'GET',
      path: `api/banners/active`
    };

    return this.http
      .post<GenericApiResult<Banner[]>>(`${this.proxyUrl}`, proxyRequest)
      .pipe(take(1));
  }
}
