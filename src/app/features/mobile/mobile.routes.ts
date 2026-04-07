import { Routes } from '@angular/router';
import { FailureMobilePageComponent } from './components/failure-page/failure-page.component';
import { MobileComponent } from './mobile.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { MyDataPageComponent } from './pages/my-data-page/my-data-page.component';
import {
  NotificationPermissionsPageComponent
} from './pages/notification-permissions-page/notification-permissions-page.component';
import { NotificationsPageComponent } from './pages/notifications-page/notifications-page.component';
import { OthersPageComponent } from './pages/others-page/others-page.component';
import {
  PrepaymentsAuthorizationPageComponent
} from './pages/prepayments-page/components/authorization/authorization-page.component';
import { PrepaymentsPunctualPageComponent } from './pages/prepayments-page/components/punctual/punctual-page.component';
import { PrepaymentsScheduledPageComponent } from './pages/prepayments-page/components/scheduled/scheduled-page.component';
import { PrepaymentsPageComponent } from './pages/prepayments-page/prepayments-page.component';
import { RatesFeesPageComponent } from './pages/rates-fees-page/rates-fees-page.component';
import { ReceivablesPageComponent } from './pages/receivables-page/receivables-page.component';
import { ReportsPageComponent } from './pages/reports-page/reports-page.component';
import { SalesPageComponent } from './pages/sales-page/sales-page.component';
import { StatementsPageComponent } from './pages/statements-page/statements-page.component';

export const MOBILE_ROUTES: Routes = [
  {
    path: '',
    component: MobileComponent,
    providers: [],
    children: [
      {
        path: 'summary/mobile',
        component: HomePageComponent,
        data: { title: 'app.home.title', toolbar: 'primary' }
      },
      {
        path: 'sales/mobile',
        component: SalesPageComponent,
        data: { title: 'app.sales.title', toolbar: 'primary' }
      },
      {
        path: 'receivables/mobile',
        component: ReceivablesPageComponent,
        data: { title: 'app.receivables-mobile.title', toolbar: 'primary' }
      },
      {
        path: 'prepayments/mobile',
        component: PrepaymentsPageComponent,
        data: { title: 'app.prepayments-mobile.title', toolbar: 'primary' }
      },
      {
        path: 'prepayments/mobile/punctual',
        component: PrepaymentsPunctualPageComponent,
        data: { title: 'app.prepayments-punctual-mobile.title', toolbar: 'primary' }
      },
      {
        path: 'prepayments/mobile/scheduled',
        component: PrepaymentsScheduledPageComponent,
        data: { title: 'app.prepayments-scheduled-mobile.title', toolbar: 'primary' }
      },
      {
        path: 'prepayments/mobile/authorization',
        component: PrepaymentsAuthorizationPageComponent,
        data: { title: 'app.prepayments-authorization-mobile.title', toolbar: 'primary' }
      },
      {
        path: 'statements/mobile',
        component: StatementsPageComponent,
        data: { title: 'app.statements.title', toolbar: 'primary' }
      },
      {
        path: 'reports/mobile',
        component: ReportsPageComponent,
        data: { title: 'app.reports.title', toolbar: 'primary' }
      },
      // {
      //   path: 'commercial-terms/mobile',
      //   component: CommercialTermsPageComponent,
      //   data: { title: 'app.commercial-terms.title', toolbar: 'primary' }
      // },
      {
        path: 'notifications/mobile',
        component: NotificationsPageComponent,
        data: { title: 'app.notifications.title', toolbar: 'primary' }
      },
      {
        path: 'notification-permissions/mobile',
        component: NotificationPermissionsPageComponent,
        data: { title: 'app.notification-permissions.title', toolbar: 'primary' }
      },
      {
        path: 'others/mobile',
        component: OthersPageComponent,
        data: { title: 'app.other-mobile.title', toolbar: 'primary' }
      },
      {
        path: 'failure/mobile',
        component: FailureMobilePageComponent,
        data: { title: 'app.failure-mobile.title', toolbar: 'primary' }
      },
      {
        path: 'rates-fees/mobile',
        component: RatesFeesPageComponent,
        data: { title: 'app.rates-fees.title', toolbar: 'primary' }
      },
      {
        path: 'my-data/mobile',
        component: MyDataPageComponent,
        data: { title: 'app.my-data.title', toolbar: 'primary' }
      }
    ]
  }
];
