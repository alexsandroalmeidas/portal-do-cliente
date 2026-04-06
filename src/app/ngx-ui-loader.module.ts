import {
  importProvidersFrom,
  ModuleWithProviders,
  NgModule,
} from '@angular/core';
import {
  NgxUiLoaderHttpModule,
  NgxUiLoaderModule,
  NgxUiLoaderRouterModule,
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
  fgsColor: '#4E2096', ///cor do spinner
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
  pbColor: '#4E2096', ///cor da linha
  pbDirection: PB_DIRECTION.leftToRight,
  pbThickness: 3,
  hasProgressBar: true,
  text: '',
  textColor: '#FFFFFF',
  textPosition: POSITION.centerCenter,
  maxTime: -1,
  minTime: 300,
};

@NgModule({})
export class CustomNgxUiLoaderModule {
  static forRoot(): ModuleWithProviders<CustomNgxUiLoaderModule> {
    return {
      ngModule: CustomNgxUiLoaderModule,
      providers: [
        importProvidersFrom(
          NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
          NgxUiLoaderRouterModule, // import this module for showing loader automatically when navigating between app routes
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
        ),
      ],
    };
  }
}
