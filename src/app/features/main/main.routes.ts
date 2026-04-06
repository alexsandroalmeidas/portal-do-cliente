import { Routes } from '@angular/router';
import { MainComponent } from './main.component';
import { ReceivablesPageComponent } from './pages/receivables/receivables-page.component';
import { ReportsPageComponent } from './pages/reports/reports-page.component';
import { SalesPageComponent } from './pages/sales/sales-page.component';
import { StatementsPageComponent } from './pages/statements/statements-page.component';
import { SummaryPageComponent } from './pages/summary/summary-page.component';
import { AuthorizedGuard } from 'src/app/shared/guards/authorized.guard';

export const MAIN_ROUTES: Routes = [
  {
    path: '',
    component: MainComponent,
    providers: [],
    children: [
      {
        path: 'summary',
        component: SummaryPageComponent,
        data: { title: 'app.summary.title' },
      },
      {
        path: 'statements',
        component: StatementsPageComponent,
        data: { title: 'app.statements.title' },
        canActivate: [AuthorizedGuard],
        canActivateChild: [AuthorizedGuard],
        children: [
          {
            path: 'validate',
            loadComponent: () =>
              import('./pages/statements/statements-validate-page/statements-validate-page.component').then(
                (x) => x.StatementsValidatePageComponent,
              ),
            data: { title: 'app.statements.validate.title' },
          },
        ],
      },
      {
        path: 'receivables',
        component: ReceivablesPageComponent,
        data: { title: 'app.receivables.title' },
        canActivate: [AuthorizedGuard],
        canActivateChild: [AuthorizedGuard],
      },
      {
        path: 'sales',
        component: SalesPageComponent,
        data: { title: 'app.sales.title' },
        canActivate: [AuthorizedGuard],
        canActivateChild: [AuthorizedGuard],
      },
      {
        path: 'reports',
        component: ReportsPageComponent,
        data: { title: 'app.reports.title' },
        canActivate: [AuthorizedGuard],
        canActivateChild: [AuthorizedGuard],
      },
      {
        path: 'access-link',
        loadComponent: () =>
          import('./pages/access-link/access-link-page/access-link-page.component').then(
            (x) => x.AccessLinkPageComponent,
          ),
        data: { title: 'app.access-link.title' },
        canActivate: [AuthorizedGuard],
        canActivateChild: [AuthorizedGuard],
        children: [
          {
            path: ':roleId/permissions',
            loadComponent: () =>
              import('./pages/access-link/permissions-page/permissions-page.component').then(
                (x) => x.PermissionsPageComponent,
              ),
            data: { title: 'app.permissions.title' },
            canActivate: [AuthorizedGuard],
            canActivateChild: [AuthorizedGuard],
          },
        ],
      },
      {
        path: 'my-data',
        loadComponent: () =>
          import('./pages/my-data/my-data-page.component').then(
            (x) => x.MyDataPageComponent,
          ),
        data: { title: 'app.my-data.title' },
        canActivate: [AuthorizedGuard],
        canActivateChild: [AuthorizedGuard],
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./pages/settings/settings-page.component').then(
            (x) => x.SettingsPageComponent,
          ),
        data: { title: 'app.settings.title' },
        canActivate: [AuthorizedGuard],
        canActivateChild: [AuthorizedGuard],
      },
      {
        path: 'prepayments',
        loadComponent: () =>
          import('./pages/prepayments/prepayments-page.component').then(
            (x) => x.PrepaymentsPageComponent,
          ),
        data: { title: 'app.prepayments.title' },
        canActivate: [AuthorizedGuard],
        canActivateChild: [AuthorizedGuard],
      },
      {
        path: 'prepayments-scheduled',
        loadComponent: () =>
          import('./pages/prepayments/scheduled-prepayment-page/scheduled-prepayment-page.component').then(
            (x) => x.ScheduledPrepaymentPageComponent,
          ),
        data: { title: 'app.prepayments-scheduled.title' },
        canActivate: [AuthorizedGuard],
        canActivateChild: [AuthorizedGuard],
      },
      {
        path: 'prepayments-punctual',
        loadComponent: () =>
          import('./pages/prepayments/punctual-prepayment-page/punctual-prepayment-page.component').then(
            (x) => x.PunctualPrepaymentPageComponent,
          ),
        data: { title: 'app.prepayments-punctual.title' },
        canActivate: [AuthorizedGuard],
        canActivateChild: [AuthorizedGuard],
      },
      {
        path: 'prepayments-historic',
        loadComponent: () =>
          import('./pages/prepayments/historic-prepayment-page/historic-prepayment-page.component').then(
            (x) => x.HistoricPrepaymentPageComponent,
          ),
        data: { title: 'app.prepayments-historic.title' },
        canActivate: [AuthorizedGuard],
        canActivateChild: [AuthorizedGuard],
      },
      {
        path: 'communication',
        loadComponent: () =>
          import('./pages/communication/communication-page.component').then(
            (x) => x.CommunicationPageComponent,
          ),
        data: { title: 'app.communication.title' },
        canActivate: [AuthorizedGuard],
        canActivateChild: [AuthorizedGuard],
      },
      {
        path: 'notifications',
        loadComponent: () =>
          import('./pages/notifications/notifications-page.component').then(
            (x) => x.NotificationsPageComponent,
          ),
        data: { title: 'app.notifications.title' },
        canActivate: [AuthorizedGuard],
        canActivateChild: [AuthorizedGuard],
      },
      {
        path: 'rates-fees',
        loadComponent: () =>
          import('./pages/rates-fees/rates-fees-page.component').then(
            (x) => x.RatesFeesPageComponent,
          ),
        data: { title: 'app.rates-fees.title' },
        canActivate: [AuthorizedGuard],
        canActivateChild: [AuthorizedGuard],
      },
    ],
  },
];
