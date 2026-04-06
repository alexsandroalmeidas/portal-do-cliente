import { APP_BASE_HREF, registerLocaleData } from '@angular/common';
import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import ptBr from '@angular/common/locales/pt';
import { enableProdMode, importProvidersFrom, LOCALE_ID } from '@angular/core';
import {
  MatBottomSheetRef,
  MAT_BOTTOM_SHEET_DATA,
} from '@angular/material/bottom-sheet';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { bootstrapApplication, BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  PreloadAllModules,
  provideRouter,
  RouterModule,
  withPreloading,
} from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import {
  CalendarDateFormatter,
  CalendarModule,
  CalendarMomentDateFormatter,
  DateAdapter,
  MOMENT,
} from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import moment from 'moment';
import { APP_ROUTES } from './app/app-routes';
import { AppComponent } from './app/app.component';
import { RootStoreModule } from './app/root-store';
import { HttpAuthInterceptor } from './app/shared/interceptors/http-auth.interceptor';
import { HttpLoadingInterceptor } from './app/shared/interceptors/http-loading.interceptor';
import { HttpTokenInterceptor } from './app/shared/interceptors/http-token.interceptor';
import { SharedModule } from './app/shared/shared.module';
import { environment } from './environments/environment';

import {
  NgxUiLoaderModule,
  NgxUiLoaderRouterModule,
  NgxUiLoaderHttpModule,
  PB_DIRECTION,
  POSITION,
  SPINNER,
} from 'ngx-ui-loader';

const ngxUiLoaderConfig = {
  bgsColor: '#f5e5fd',
  bgsOpacity: 0.5,
  bgsPosition: POSITION.centerCenter,
  bgsSize: 50,
  bgsType: SPINNER.pulse,
  blur: 0,
  delay: 0,
  fgsColor: '#4E2096',
  fgsPosition: POSITION.centerCenter,
  fgsSize: 60,
  fgsType: SPINNER.pulse,
  gap: 24,
  logoPosition: POSITION.centerCenter,
  logoUrl: './assets/img/logo_transparent.svg',
  logoSize: 200,
  masterLoaderId: 'masterLoaderId',
  overlayBorderRadius: '0',
  overlayColor: 'rgba(40, 40, 40, 0.8)',
  pbColor: '#4E2096',
  pbDirection: PB_DIRECTION.leftToRight,
  pbThickness: 3,
  hasProgressBar: true,
  text: '',
  textColor: '#FFFFFF',
  textPosition: POSITION.centerCenter,
  maxTime: -1,
  minTime: 300,
};

registerLocaleData(ptBr, 'pt');

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(APP_ROUTES, withPreloading(PreloadAllModules)),

    importProvidersFrom(
      BrowserModule,
      BrowserAnimationsModule,

      RootStoreModule,
      SharedModule,
      RouterModule,
      StoreRouterConnectingModule.forRoot(),

      // ✅ AQUI ESTÁ A CORREÇÃO
      NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
      NgxUiLoaderRouterModule,
      NgxUiLoaderHttpModule.forRoot({
        showForeground: true,
        excludeRegexp: [
          '/movements/last',
          'api/notifications',
          'banners/active',
          'information-grouping',
          'economic-groups/phone',
          'api/lead',
          'summary-last-sales',
          'summary-card-receivables',
          'summary-card-sales',
        ],
      }),

      TranslateModule.forRoot({
        defaultLanguage: 'pt-BR',
        loader: {
          provide: TranslateLoader,
          useFactory: createTranslateLoader,
          deps: [HttpClient],
        },
      }),
      CalendarModule.forRoot({
        provide: DateAdapter,
        useFactory: adapterFactory,
      }),
      ServiceWorkerModule.register(
        'ngsw-worker.js?ngsw-cache-bust=' + Math.random(),
        {
          enabled: true,
          // Register the ServiceWorker as soon as the application is stable
          // or after 30 seconds (whichever comes first).
          registrationStrategy: 'registerWhenStable:30000',
        },
      ),
    ),
    {
      provide: LOCALE_ID,
      useValue: 'pt',
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpAuthInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpTokenInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpLoadingInterceptor,
      multi: true,
    },
    {
      provide: MOMENT,
      useValue: moment,
    },
    {
      provide: CalendarDateFormatter,
      useClass: CalendarMomentDateFormatter,
    },
    {
      provide: JWT_OPTIONS,
      useValue: JWT_OPTIONS,
    },
    JwtHelperService,
    {
      provide: APP_BASE_HREF,
      useValue: '/',
    },
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: {
        hasBackdrop: false,
        disableClose: true,
      },
    },
    { provide: MatBottomSheetRef, useValue: {} },
    { provide: MAT_BOTTOM_SHEET_DATA, useValue: {} },
  ],
});
