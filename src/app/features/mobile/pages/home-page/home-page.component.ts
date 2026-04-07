import { AdministrationStoreSelectors } from '@/root-store/administration-store';
import { AuthStoreSelectors } from '@/root-store/auth-store';
import {
  CommunicationStoreActions,
  CommunicationStoreSelectors,
} from '@/root-store/communication-store';
import { Banner } from '@/root-store/communication-store/communication.models';
import { CommunicationService } from '@/root-store/communication-store/communication.service';
import { CoreStoreActions } from '@/root-store/core-store';
import { IdentityStoreSelectors } from '@/root-store/identity-store';
import { MfaStoreActions, MfaStoreSelectors } from '@/root-store/mfa-store';
import {
  PrepaymentsStoreActions,
  PrepaymentsStoreSelectors,
} from '@/root-store/prepayments-store';
import { ReceivablesScheduleGroupingResponse } from '@/root-store/prepayments-store/prepayments.models';
import {
  ReceivablesStoreActions,
  ReceivablesStoreSelectors,
} from '@/root-store/receivables-store';
import { SummaryCardReceivables } from '@/root-store/receivables-store/receivables.models';
import {
  SalesStoreActions,
  SalesStoreSelectors,
} from '@/root-store/sales-store';
import { SummaryCardSales } from '@/root-store/sales-store/sales.models';
import { AppState } from '@/root-store/state';
import { Slide } from '@/shared/components/banner-carousel/slide';
import { MedalliaService } from '@/shared/services/medallia.service';
import { NavigationService } from '@/shared/services/navigation.service';
import { NotificationService } from '@/shared/services/notification.service';
import { SharedModule } from '@/shared/shared.module';
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { DateRange } from '@angular/material/datepicker';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Device } from '@capacitor/device';
import { Store } from '@ngrx/store';
import { isEmpty } from 'lodash';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { firstValueFrom, forkJoin, map, take, takeUntil } from 'rxjs';
import { ChangePasswordBottomSheetComponent } from '../../components/change-password-bottom-sheet/change-password-bottom-sheet.component';
import { ConfirmationBottomSheetComponent } from '../../components/confirmation-bottom-sheet/confirmation-bottom-sheet.component';
import { MfaActivationCompletedBottomSheetComponent } from '../../components/mfa/mfa-activation-completed-bottom-sheet/mfa-activation-completed-bottom-sheet.component';
import { MfaReinforceSecurityDialogComponent } from '../../components/mfa/mfa-reinforce-security-dialog/mfa-reinforce-security-dialog.component';
import { MfaTwoFactorAuthenticationBottomSheetComponent } from '../../components/mfa/mfa-two-factor-authentication-bottom-sheet/mfa-two-factor-authentication-bottom-sheet.component';
import { PrepaymentsCardComponent } from '../../components/prepayments-card/prepayments-card.component';
import { ReceivablesCardDialogComponent } from '../../components/receivables-card-dialog/receivables-card-dialog.component';
import { SalesDetailsDialogComponent } from '../../components/sales-details-dialog/sales-details-dialog.component';
import {
  ReceivablesPeriodFilter,
  SalesPeriodFilter,
} from '../../models/period-filter';
import { SidenavService } from '../../services/sidenav.service';
import { ToolbarService } from '../../services/toolbar.service';
import { MobileBasePage } from '../mobile-base.page';
import { ToolbarBackgroundComponent } from './../../components/toolbar-background/toolbar-background.component';
import { ReceivablesCardComponent } from './components/receivables-card/receivables-card.component';
import { SalesCardComponent } from './components/sales-card/sales-card.component';

@Component({
  standalone: true,
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
  imports: [
    SharedModule,
    ReceivablesCardComponent,
    SalesCardComponent,
    PrepaymentsCardComponent,
    ToolbarBackgroundComponent,
  ],
})
export class HomePageComponent extends MobileBasePage implements OnInit {
  today = new Date();
  salesValues: SummaryCardSales = {} as SummaryCardSales;
  receivableValues: SummaryCardReceivables = {} as SummaryCardReceivables;
  userEmail: string = '';
  showMfa = false;
  hasPermissionMfa = false;
  hasPunctualPermission = false;
  hasPermissionToBanner = false;
  isManager = false;
  pinId!: string;
  receivablesSchedule: ReceivablesScheduleGroupingResponse[] = [];
  slides: Slide[] = [];
  isAd = false;
  forgotPassword = false;
  isFirstAccess = false;
  economicGroupPhoneNumber = '';

  get totalAvailableAmountPrepayment() {
    return !isEmpty(this.receivablesSchedule)
      ? (this.receivablesSchedule?.sumBy((p) => p.availableValue ?? 0) ?? 0)
      : 0;
  }

  get prepaymentsAvailable() {
    if (!isEmpty(this.receivablesSchedule)) {
      this.stopLoader('loader-home-prepayments');
      return (
        this.receivablesSchedule?.some((p) => p.available ?? false) ?? false
      );
    }

    return false;
  }

  lastUpdateDateSales!: Date;
  lastUpdateDateReceivables!: Date;

  constructor(
    store$: Store<AppState>,
    bottomSheet: MatBottomSheet,
    viewContainerRef: ViewContainerRef,
    navigationService: NavigationService,
    toolbarService: ToolbarService,
    sidenavService: SidenavService,
    protected notificationService: NotificationService,
    router: Router,
    public dialog: MatDialog,
    private ngxService: NgxUiLoaderService,
    medalliaService: MedalliaService,
    private communicationService: CommunicationService,
    private sanitizer: DomSanitizer,
  ) {
    super(
      store$,
      bottomSheet,
      viewContainerRef,
      navigationService,
      sidenavService,
      toolbarService,
      medalliaService,
      router,
    );

    this.getUuid();

    this.subscribeAuthData();
    this.subscribeEconomicGroupPhone();
    this.subscribePunctualPrepaymentPermission();
    this.subscribePermissionToBanner();
    this.subscribeMfaPermission();
    this.subscribeSelectIsManager();
    this.subscribeShowMfa();
    this.subscribeReceivablesDetail();
    this.subscribeSummaryCardSales();
    this.subscribeReceivablesSchedule();
    this.subscribeActiveBanners();

    this.subscribeLastUpdateDateReceivables();
    this.subscribeLastUpdateDateSales();
  }

  ngOnInit() {}

  protected override onChangeSelectedEstablishments(): void {
    this.selectLastUpdateDateReceivables();
    this.selectLastUpdateDateSales();
    this.selectReceivablesDetail();
    this.selectSales();
    this.selectListActiveBanners();

    if (this.hasPunctualPermission) {
      this.selectGetReceivablesSchedule();
      this.startLoader('loader-home-prepayments');
    }
  }

  onSalesFilter() {
    const bottomSheetRef = this.bottomSheet.open(SalesDetailsDialogComponent, {
      panelClass: 'bottom-sheet-panel',
      hasBackdrop: true,
      disableClose: true,
      data: {
        selectedEstablishments: this.selectedEstablishmentsUids,
        currentFilter: new SalesPeriodFilter('today'),
        showDetailsButtom: true,
        visibilityOn: this.visibilityOn,
      },
    });

    bottomSheetRef
      .afterDismissed()
      .pipe(takeUntil(this.$unsub))
      .subscribe((value: SalesPeriodFilter) => {
        this.salesValues = {
          ...this.salesValues,
          // filter: value
        };
      });
  }

  onReceivablesFilter() {
    const from = new Date().date();
    const to = from.addDays(365);

    const bottomSheetRef = this.bottomSheet.open(
      ReceivablesCardDialogComponent,
      {
        panelClass: 'bottom-sheet-panel',
        hasBackdrop: true,
        disableClose: true,
        data: {
          selectedEstablishments: this.selectedEstablishmentsUids,
          currentFilter: new ReceivablesPeriodFilter(
            'custom',
            new DateRange<Date>(from, to),
          ),
          showDetailsButtom: true,
          visibilityOn: this.visibilityOn,
        },
      },
    );

    bottomSheetRef
      .afterDismissed()
      .pipe(takeUntil(this.$unsub))
      .subscribe((value: ReceivablesPeriodFilter) => {
        this.receivableValues = {
          ...this.receivableValues,
          // filter: value
        };
      });
  }

  async onPrepaymentsFilter() {
    await this.router.navigate(['/prepayments/mobile']);
  }

  onRefreshSales() {
    this.selectSales();
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

  private subscribeActiveBanners() {
    this.store$
      .select(CommunicationStoreSelectors.selectActiveBanners)
      .pipe(takeUntil(this.$unsub))
      .subscribe((banners: Banner[]) => {
        const bannerRequests = (banners || [])
          .filter((x: Banner) => !!x.appImage)
          .map((banner: Banner) =>
            this.communicationService
              .getBannerImage(banner?.appImage?.fileName ?? '')
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

  private subscribeReceivablesSchedule() {
    this.store$
      .select(PrepaymentsStoreSelectors.selectReceivablesScheduleGrouping)
      .pipe(takeUntil(this.$unsub))
      .subscribe((receivablesSchedule) => {
        this.receivablesSchedule = receivablesSchedule || [];
      });
  }

  private selectGetReceivablesSchedule() {
    if (this.hasSelectedEstablishments) {
      this.store$.dispatch(
        new PrepaymentsStoreActions.GetReceivablesScheduleGroupingAction({
          uid: this.selectedEstablishmentsUids.firstOrDefault((x) => !x),
        }),
      );
    }
  }

  private stopLoader(loaderId: string) {
    if (!!this.ngxService.getLoaders()[loaderId]) {
      this.ngxService.stopLoader(loaderId);
    }
  }

  private startLoader(loaderId: string) {
    this.ngxService.startLoader(loaderId);
  }

  private selectListActiveBanners() {
    if (this.hasSelectedEstablishments) {
      this.store$.dispatch(
        new CommunicationStoreActions.ListActiveBannersAction({
          listUids: this.selectedEstablishmentsUids,
        }),
      );
    }
  }

  private selectSales() {
    if (this.hasSelectedEstablishments) {
      const today = new Date().date();

      this.store$.dispatch(
        new SalesStoreActions.SelectSummaryCardSalesAction({
          initialDate: today.format(),
          finalDate: today.format(),
          uids: this.selectedEstablishmentsUids,
        }),
      );

      this.store$.dispatch(
        new SalesStoreActions.SelectSalesDetailAction({
          initialDate: today.format(),
          finalDate: today.format(),
          uids: this.selectedEstablishmentsUids,
        }),
      );
    }
  }

  private getUuid = async () => {
    const deviceId = await Device.getId();

    this.store$.dispatch(
      new CoreStoreActions.SetUuidAction({ uuid: `${deviceId.identifier}` }),
    );
  };

  private selectReceivablesDetail() {
    if (this.hasSelectedEstablishments) {
      const from = new Date().date();
      const to = from.addDays(365);

      this.store$.dispatch(
        new ReceivablesStoreActions.SelectReceivablesSummaryAction({
          initialDate: from.format(),
          finalDate: to.format(),
          uids: this.selectedEstablishmentsUids,
        }),
      );
    }
  }

  private subscribeSummaryCardSales() {
    this.store$
      .select(SalesStoreSelectors.selectSummaryCardSales)
      .pipe(takeUntil(this.$unsub))
      .subscribe((sales: SummaryCardSales) => {
        this.salesValues = sales;
      });
  }

  private subscribeReceivablesDetail() {
    this.store$
      .select(ReceivablesStoreSelectors.selectReceivablesSummary)
      .pipe(takeUntil(this.$unsub))
      .subscribe((receivablesDetail: SummaryCardReceivables) => {
        this.receivableValues = receivablesDetail;
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
            this.openMfaReinforceSecurityDialog();
          } else {
            if (!this.isAd) {
              if (this.isFirstAccess) {
                this.openChangePasswordBottomSheet();
              }
            }
          }
        } else {
          if (!this.isAd) {
            if (this.isFirstAccess) {
              this.openChangePasswordBottomSheet();
            }
          }
        }
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

  private subscribePunctualPrepaymentPermission() {
    this.store$
      .select(IdentityStoreSelectors.selectPunctualPrepaymentPermission)
      .pipe(takeUntil(this.$unsub))
      .subscribe((punctualPermission: boolean) => {
        this.hasPunctualPermission = punctualPermission;

        if (this.hasPunctualPermission) {
          this.selectGetReceivablesSchedule();
          this.startLoader('loader-home-prepayments');
        }
      });
  }

  private subscribePermissionToBanner() {
    this.store$
      .select(IdentityStoreSelectors.selectPermissionToBanner)
      .pipe(takeUntil(this.$unsub))
      .subscribe((permissionToBanner: boolean) => {
        this.hasPermissionToBanner = permissionToBanner;
      });
  }

  openMfaActivationCompletedDialog() {
    const bottomSheetRef = this.bottomSheet.open(
      MfaActivationCompletedBottomSheetComponent,
      {
        panelClass: 'bottom-sheet-panel',
        hasBackdrop: true,
        disableClose: true,
        data: {},
      },
    );

    bottomSheetRef
      .afterDismissed()
      .pipe(take(1))
      .subscribe(async (data) => {});
  }

  openChangePasswordBottomSheet() {
    const changePasswordBottomSheet = this.bottomSheet.open(
      ChangePasswordBottomSheetComponent,
      {
        panelClass: 'bottom-sheet-prepayment-panel',
        hasBackdrop: true,
        disableClose: true,
      },
    );

    changePasswordBottomSheet
      .afterDismissed()
      .pipe(take(1))
      .subscribe(async (data) => {});
  }

  confirmCancelMfa() {
    const dialogTwoFactorRef = this.bottomSheet.open(
      ConfirmationBottomSheetComponent,
      {
        panelClass: 'bottom-sheet-prepayment-panel',
        hasBackdrop: true,
        disableClose: true,
        data: {
          title:
            'Atenção! Você tem certeza que deseja cancelar a ativação da autenticação de 2 fatores?',
          description:
            'O cancelamento da autenticação de 2 fatores (MFA) impede que você conclua suas transações.',
          okText: 'Sim, desejo cancelar',
          cancelText: 'Voltar',
        },
      },
    );

    return firstValueFrom(
      dialogTwoFactorRef.afterDismissed().pipe(map((confirm) => !!confirm)),
    );
  }

  async openMfaCancelDialog(callback: () => Promise<void>) {
    if (!(await this.confirmCancelMfa())) {
      await callback();
    }
  }

  async openMfaTwoFactorAuthenticationBottomSheet() {
    // enviar pin por email
    this.store$.dispatch(new MfaStoreActions.SendPinEmailAction());

    const dialogTwoFactorRef = this.bottomSheet.open(
      MfaTwoFactorAuthenticationBottomSheetComponent,
      {
        panelClass: 'bottom-sheet-prepayment-panel',
        hasBackdrop: true,
        disableClose: true,
        data: {
          step: 1,
          emailSelected: this.userEmail,
          isMfa: true,
        },
      },
    );

    dialogTwoFactorRef
      .afterDismissed()
      .pipe(takeUntil(this.$unsub))
      .subscribe(async (data) => {
        if (data === true) {
          this.openMfaActivationCompletedDialog();
        } else if (data === false) {
          await this.openMfaCancelDialog(() =>
            this.openMfaTwoFactorAuthenticationBottomSheet(),
          );
        }
      });
  }

  openMfaReinforceSecurityDialog() {
    const config: MatDialogConfig = {
      width: '80%',
      hasBackdrop: true,
      disableClose: true,
    };

    const dialogReinforceRef = this.dialog.open(
      MfaReinforceSecurityDialogComponent,
      config,
    );

    dialogReinforceRef.afterClosed().subscribe((data) => {
      this.store$.dispatch(new MfaStoreActions.VerifiedMfaAction());

      if (data) {
        this.openMfaTwoFactorAuthenticationBottomSheet();
      } else {
        this.store$.dispatch(new MfaStoreActions.VerifiedMfaAction());
      }
    });
  }
}
