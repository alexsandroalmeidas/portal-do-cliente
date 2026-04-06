import { Banner } from '@/root-store/communication-store/communication.models';
import { CommunicationService } from '@/root-store/communication-store/communication.service';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { isEmpty } from 'lodash';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { distinctUntilChanged, forkJoin, map, skip, takeUntil } from 'rxjs';
import { AuthStoreSelectors } from 'src/app/root-store';
import { AdministrationStoreSelectors } from 'src/app/root-store/administration-store';
import { IdentityStoreSelectors } from 'src/app/root-store/identity-store';
import {
  MfaStoreActions,
  MfaStoreSelectors,
} from 'src/app/root-store/mfa-store';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { Slide } from '../../../../shared/components/banner-carousel/slide';
import { DialogChangePasswordComponent } from '../../components/dialog-change-password/dialog-change-password.component';
import { DialogActivationCompletedComponent } from '../../components/mfa/dialog-activation-completed/dialog-activation-completed.component';
import { DialogCancelComponent } from '../../components/mfa/dialog-cancel/dialog-cancel.component';
import { DialogReinforceSecurityComponent } from '../../components/mfa/dialog-reinforce-security/dialog-reinforce-security.component';
import { DialogTwoFactorAuthenticationComponent } from '../../components/mfa/dialog-two-factor-authentication/dialog-two-factor-authentication.component';
import { BasePage } from '../base.page';
import {
  CommunicationStoreActions,
  CommunicationStoreSelectors,
} from './../../../../root-store/communication-store';
import {
  ReceivablesStoreActions,
  ReceivablesStoreSelectors,
} from './../../../../root-store/receivables-store';
import { SummaryCardReceivables } from './../../../../root-store/receivables-store/receivables.models';
import {
  SalesStoreActions,
  SalesStoreSelectors,
} from './../../../../root-store/sales-store';
import {
  SummaryCardSales,
  SummaryLastSales,
} from './../../../../root-store/sales-store/sales.models';
import { AppState } from './../../../../root-store/state';
import {
  FilterOption,
  SelectedOption,
} from './../../../../shared/components/inline-filter';
import { DateRange } from './../../../../shared/models/date';
import { NavigationService } from './../../../../shared/services/navigation.service';
import { SharedModule } from './../../../../shared/shared.module';
import { CardMyReceivablesComponent } from './card-my-receivables/card-my-receivables.component';
import { CardMySalesComponent } from './card-my-sales/card-my-sales.component';
import { MySalesDetailVisionComponent } from './my-sales-detail-vision/my-sales-detail-vision.component';

@Component({
  templateUrl: './summary-page.component.html',
  styleUrls: ['./summary-page.component.scss'],
  standalone: true,
  imports: [
    CardMyReceivablesComponent,
    CardMySalesComponent,
    MySalesDetailVisionComponent,
    SharedModule,
  ],
})
export class SummaryPageComponent
  extends BasePage
  implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChild(CardMySalesComponent) cardMySales: CardMySalesComponent =
    {} as CardMySalesComponent;

  today = new Date().date();
  lastSalesFilterValue: DateRange = {
    from: this.today,
    to: this.today,
    update: true,
  };
  isMobile = false;
  currentFilterName!: string;
  salesFilterOptions = [
    new FilterOption('Hoje', 'today', (): DateRange => {
      return {
        from: this.today,
        to: this.today,
        update: true,
      };
    }),
    new FilterOption('Últimos 7 dias', 'lastWeek', (): DateRange => {
      return {
        from: this.today.addDays(-7),
        to: this.today,
        update: true,
      };
    }),
    new FilterOption('Últimos 30 dias', 'lastMonth', (): DateRange => {
      return {
        from: this.today.addDays(-30),
        to: this.today,
        update: true,
      };
    }),
  ];

  receivables: SummaryCardReceivables = {} as SummaryCardReceivables;
  sales: SummaryCardSales = {} as SummaryCardSales;
  lastSales: SummaryLastSales[] = [];
  slides: Slide[] = [];
  lastSaleDate: Date = new Date();
  userEmail: string = '';
  showMfa = false;
  hasPermissionMfa = false;
  pinId!: string;
  isAd = false;
  forgotPassword = false;
  isFirstAccess = false;
  economicGroupPhoneNumber = '';
  summaryCardSalesHasError = false;
  isManager = false;
  lastUpdateDateSales!: Date;
  lastUpdateDateReceivables!: Date;
  isLoadingLastSales = false;
  hasLoadedLastSales = false;
  reserve: number = 0;

  constructor(
    store$: Store<AppState>,
    public dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    navigationService: NavigationService,
    protected notificationService: NotificationService,
    private ngxService: NgxUiLoaderService,
    private communicationService: CommunicationService,
    private sanitizer: DomSanitizer,
  ) {
    super(store$, navigationService);
  }

  ngOnInit(): void {
    this.receivables = {} as SummaryCardReceivables;
  }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
    this.subscribeSelectIsManager();
    this.subscribeLastUpdateDateReceivables();
    this.subscribeLastUpdateDateSales();
    this.subscribeReceivablesSummary();
    this.subscribeSalesSummaryError();
    this.subscribeSalesSummary();
    this.subscribeLastSalesSummary();
    this.subscribeActiveBanners();
    this.subscribeShowMfa();
    this.subscribeMfaPermission();
    this.subscribeAuthData();
    this.subscribeEconomicGroupPhone();
    this.subscribeEconomicGroupReserve();
  }

  private subscribeEconomicGroupReserve() {
    this.store$
      .select(AdministrationStoreSelectors.selectEconomicGroupReserve)
      .pipe(takeUntil(this.$unsub))
      .subscribe((result) => {
        this.reserve = result?.reserve || 0;
      });
  }

  private subscribeLastUpdateDateReceivables() {
    this.store$
      .select(ReceivablesStoreSelectors.selectLastUpdateDateReceivables)
      .pipe(takeUntil(this.$unsub))
      .subscribe((last) => {
        if (!!last) this.lastUpdateDateReceivables = last.lastUpdateDate;
      });
  }

  private subscribeLastUpdateDateSales() {
    this.store$
      .select(SalesStoreSelectors.selectLastUpdateDateSales)
      .pipe(takeUntil(this.$unsub))
      .subscribe((last) => {
        if (!!last) this.lastUpdateDateSales = last.lastUpdateDate;
      });
  }

  protected override onChangeSelectedEstablishments(): void {
    const today = new Date().date();
    this.selectLastUpdateDateReceivables();
    this.selectLastUpdateDateSales();
    this.selectReceivables(today, this.selectedEstablishmentsUids);
    this.selectSummaryCardSales(today, today, this.selectedEstablishmentsUids);
    this.selectLastSales(today, today, this.selectedEstablishmentsUids);
    this.selectListActiveBanners(this.selectedEstablishmentsUids);
  }

  private selectLastUpdateDateReceivables() {
    this.store$.dispatch(
      new ReceivablesStoreActions.SelectLastUpdateDateReceivablesAction(),
    );
  }

  private selectLastUpdateDateSales() {
    this.store$.dispatch(
      new SalesStoreActions.SelectLastUpdateDateSalesAction(),
    );
  }

  private subscribeReceivablesSummary() {
    this.store$
      .select(ReceivablesStoreSelectors.selectReceivablesSummary)
      .pipe(takeUntil(this.$unsub))
      .subscribe((receivablesSummary: SummaryCardReceivables) => {
        this.receivables = receivablesSummary ?? ({} as SummaryCardReceivables);
        this.stopLoader('loader_summary_card_receivables');
      });
  }

  private subscribeSalesSummary() {
    this.store$
      .select(SalesStoreSelectors.selectSummaryCardSales)
      .pipe(takeUntil(this.$unsub))
      .subscribe((salesSummary: SummaryCardSales) => {
        this.sales = salesSummary ?? ({} as SummaryCardSales);
      });
  }

  private subscribeSalesSummaryError() {
    this.store$
      .select(SalesStoreSelectors.selectSummaryCardSalesError)
      .pipe(takeUntil(this.$unsub))
      .subscribe((error) => {
        this.summaryCardSalesHasError = false;
        if (!!error) {
          this.summaryCardSalesHasError = true;
          this.stopLoader('loader_summary_card_sales');
        }
      });
  }

  private subscribeLastSalesSummary() {
    this.store$
      .select(SalesStoreSelectors.selectLastSalesSummary)
      .pipe(takeUntil(this.$unsub))
      .subscribe((lastSalesSummary: SummaryLastSales[]) => {
        this.ngxService.startLoader('loader_summary_last_sales');

        // 🔥 SEMPRE atualiza a lista
        this.lastSales = lastSalesSummary ?? [];

        this.ngxService.stopLoader('loader_summary_last_sales');
      });
  }

  private subscribeActiveBanners() {
    this.store$
      .select(CommunicationStoreSelectors.selectActiveBanners)
      .pipe(takeUntil(this.$unsub))
      .subscribe((banners: Banner[]) => {
        const bannerRequests = (banners || [])
          .filter((x: Banner) => !!x.portalImage)
          .map((banner: Banner) =>
            this.communicationService
              .getBannerImage(banner?.portalImage?.fileName ?? '')
              .pipe(
                map((blob: Blob) => {
                  const objectUrl = URL.createObjectURL(blob);
                  return {
                    url: banner.url,
                    id: banner.id,
                    image: this.sanitizer.bypassSecurityTrustUrl(objectUrl),
                    backgroundColor: banner.backgroundColor,
                  };
                }),
              ),
          );

        // Aguarda todas as requisições serem concluídas antes de atualizar `this.slides`
        forkJoin(bannerRequests)
          .pipe(takeUntil(this.$unsub))
          .subscribe((slides: any) => {
            this.slides = slides;
          });
      });
  }

  private subscribeShowMfa() {
    this.store$
      .select(MfaStoreSelectors.selectVerifiyShowMfa)
      .pipe(takeUntil(this.$unsub))
      .subscribe((showMfa: boolean) => {
        this.showMfa = showMfa;
      });
  }

  private subscribeSelectIsManager() {
    this.store$
      .select(AdministrationStoreSelectors.selectIsManager)
      .pipe(takeUntil(this.$unsub))
      .subscribe((isManager: boolean) => {
        this.isManager = isManager;
      });
  }

  private subscribeMfaPermission() {
    this.store$
      .select(IdentityStoreSelectors.selectMfaPermission)
      .pipe(takeUntil(this.$unsub))
      .subscribe((permissionMfa: boolean) => {
        this.hasPermissionMfa = permissionMfa;

        if (!this.isManager && this.showMfa && this.hasPermissionMfa) {
          if (
            !isEmpty(this.selectedEstablishments) &&
            this.selectedEstablishments.some((x) => !x.activeMfa)
          ) {
            this.openDialogReinforceSecurity();
          } else {
            this.verifyOpenChangePasswordDialog();
          }
        } else {
          this.verifyOpenChangePasswordDialog();
        }
      });
  }

  private verifyOpenChangePasswordDialog() {
    if (this.isAd) {
      return;
    }

    if (this.isFirstAccess) {
      this.openChangePasswordDialog();
    }
  }

  private subscribeAuthData() {
    this.store$
      .select(AuthStoreSelectors.selectAuthData)
      .pipe(takeUntil(this.$unsub))
      .subscribe((authData) => {
        if (!!authData?.user?.email) {
          const emailSplited = (authData?.user?.email).split('@');
          this.userEmail =
            `${emailSplited[0].substring(0, 3)}${'*'.repeat(emailSplited[0].length - 3)}@${
              emailSplited[1]
            }` || '';
        }

        this.isAd = authData?.isAd || false;
        this.isFirstAccess = authData?.user?.isFirstAccess || false;
        this.forgotPassword = authData?.user?.forgotPassword || false;
      });
  }

  private subscribeEconomicGroupPhone() {
    this.store$
      .select(AdministrationStoreSelectors.selectEconomicGroupPhone)
      .pipe(takeUntil(this.$unsub))
      .subscribe((phoneNumber) => {
        this.economicGroupPhoneNumber = phoneNumber;
      });
  }

  openDialogReinforceSecurity() {
    const config: MatDialogConfig = {
      width: '22%',
      hasBackdrop: true,
      disableClose: true,
    };

    const dialogRef = this.dialog.open(
      DialogReinforceSecurityComponent,
      config,
    );

    dialogRef.afterClosed().subscribe((data) => {
      this.store$.dispatch(new MfaStoreActions.VerifiedMfaAction());

      if (data) {
        this.openDialogTwoFactorAuthentication(1);
      } else {
        this.store$.dispatch(new MfaStoreActions.VerifiedMfaAction());
      }
    });
  }

  openDialogTwoFactorAuthentication(step: number) {
    if (step === 1) {
      // enviar pin por email
      this.store$.dispatch(new MfaStoreActions.SendPinEmailAction());
    } else {
      // enviar pin por sms
      this.store$.dispatch(
        new MfaStoreActions.SendPinSmsAction({
          phoneNumber: this.economicGroupPhoneNumber,
        }),
      );
    }

    this.dialog
      .open(DialogTwoFactorAuthenticationComponent, {
        width: '392px',
        hasBackdrop: true,
        disableClose: true,
        data: {
          step: step,
          emailSelected: this.userEmail,
          isMfa: step === 1,
        },
      })
      .afterClosed()
      .subscribe((data) => {
        if (data === true) {
          this.openDialogVerificationCompleted();
        } else if (data === false) {
          this.openDialogCancel(step);
        }
      });
  }

  openDialogCancel(step: number) {
    this.dialog
      .open(DialogCancelComponent, {
        width: '392px',
        hasBackdrop: true,
        disableClose: true,
      })
      .afterClosed()
      .subscribe((data) => {
        this.store$.dispatch(new MfaStoreActions.VerifiedMfaAction());

        if (!data) {
          this.openDialogTwoFactorAuthentication(step);
        } else {
          this.store$.dispatch(new MfaStoreActions.VerifiedMfaAction());
        }
      });
  }

  openDialogVerificationCompleted() {
    this.dialog
      .open(DialogActivationCompletedComponent, {
        width: '392px',
        hasBackdrop: true,
        disableClose: true,
      })
      .afterClosed()
      .subscribe((data) => {
        this.store$.dispatch(new MfaStoreActions.VerifiedMfaAction());

        this.verifyOpenChangePasswordDialog();
      });
  }

  openChangePasswordDialog() {
    const config: MatDialogConfig = {
      width: '31%',
      hasBackdrop: true,
      disableClose: true,
    };

    const dialogRef = this.dialog.open(DialogChangePasswordComponent, config);

    dialogRef.afterClosed().subscribe((confirmChange) => {});
  }

  onPeriodChange(period: DateRange) {
    if (!isEmpty(this.selectedEstablishmentsUids)) {
      this.selectSummaryCardSales(
        period.from,
        period.to,
        this.selectedEstablishmentsUids,
      );
    }
  }

  onLastSalesFilterChange(filters: SelectedOption[]): void {
    this.hasLoadedLastSales = false;
    this.lastSalesFilterValue = filters[0].value;
    this.getCurrentFilterName(filters);

    this.selectLastSales(
      this.lastSalesFilterValue.from,
      this.lastSalesFilterValue.to,
      this.selectedEstablishmentsUids,
    );
  }

  private selectLastSales(
    from: Date,
    to: Date,
    selectedEstablishments: string[],
  ) {
    if (!this.hasSelectedEstablishments) return;

    // if (this.isLoadingLastSales) return;

    this.isLoadingLastSales = true;

    this.store$.dispatch(
      new SalesStoreActions.SelectLastSalesSummaryAction({
        initialDate: from.format(),
        finalDate: to.format(),
        uids: selectedEstablishments,
      }),
    );
  }

  private selectReceivables(today: Date, selectedEstablishments: string[]) {
    if (this.hasSelectedEstablishments) {
      this.store$.dispatch(
        new ReceivablesStoreActions.SelectReceivablesSummaryAction({
          initialDate: today.format(),
          finalDate: today.addDays(365).format(),
          uids: selectedEstablishments,
        }),
      );

      this.startLoader('loader_summary_card_receivables');
    }
  }

  private selectSummaryCardSales(
    from: Date,
    to: Date,
    selectedEstablishments: string[],
  ) {
    if (this.hasSelectedEstablishments) {
      this.store$.dispatch(
        new SalesStoreActions.SelectSummaryCardSalesAction({
          initialDate: from.format(),
          finalDate: to.format(),
          uids: selectedEstablishments,
        }),
      );

      this.startLoaderSales('loader_summary_card_sales');
    }
  }

  private selectListActiveBanners(selectedEstablishments: string[]) {
    if (this.hasSelectedEstablishments) {
      this.store$.dispatch(
        new CommunicationStoreActions.ListActiveBannersAction({
          listCnpjs: selectedEstablishments,
        }),
      );
    }
  }

  private stopLoader(loaderId: string) {
    setTimeout(() => {
      this.ngxService.stopLoader(loaderId);
    });
  }

  private startLoader(loaderId: string) {
    if (!this.ngxService) return;

    setTimeout(() => {
      this.ngxService.startLoader(loaderId);
    });
  }

  private startLoaderSales(loaderId: string) {
    if (!this.ngxService) return;

    this.isLoadingLastSales = true;

    setTimeout(() => {
      this.ngxService.startLoader(loaderId);
    });
  }

  private getCurrentFilterName(filters: SelectedOption[]) {
    this.currentFilterName =
      filters[0].name === 'lastWeek'
        ? 'weekly'
        : filters[0].name === 'lastMonth'
          ? 'monthly'
          : filters[0].name;
  }
}
