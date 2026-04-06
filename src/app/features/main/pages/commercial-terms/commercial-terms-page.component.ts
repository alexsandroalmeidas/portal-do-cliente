import { Banner } from '@/root-store/communication-store/communication.models';
import { CommunicationService } from '@/root-store/communication-store/communication.service';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { isEmpty } from 'lodash';
import { forkJoin, map, takeUntil } from 'rxjs';
import { AdministrationStoreActions, AdministrationStoreSelectors } from 'src/app/root-store/administration-store';
import { CommunicationStoreActions, CommunicationStoreSelectors } from 'src/app/root-store/communication-store';
import { MfaStoreActions } from 'src/app/root-store/mfa-store';
import { PrepaymentsStoreActions, PrepaymentsStoreSelectors } from 'src/app/root-store/prepayments-store';
import { GetScheduledFinalizedResponse } from 'src/app/root-store/prepayments-store/prepayments.models';
import { Slide } from 'src/app/shared/components/banner-carousel/slide';
import { SelectOption } from 'src/app/shared/models/select-options';
import { NavigationService } from 'src/app/shared/services/navigation.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { AppState } from '../../../../root-store/state';
import { SharedModule } from '../../../../shared/shared.module';
import { DialogScheduledActiveCancelComponent } from '../../components/dialog-scheduled-active-cancel/dialog-scheduled-active-cancel.component';
import { DialogCancelComponent } from '../../components/mfa/dialog-cancel/dialog-cancel.component';
import { DialogTwoFactorAuthenticationComponent } from '../../components/mfa/dialog-two-factor-authentication/dialog-two-factor-authentication.component';
import { SelectEstablishmentsComponent } from '../../components/select-establishments/select-establishments.component';
import { BasePage } from '../base.page';
import { DialogScheduledCancelComponent } from '../prepayments/dialog-scheduled-cancel/dialog-scheduled-cancel.component';
import { CardPrepaymentsScheduledConditionsComponent } from './card-prepayments-scheduled/card-prepayments-scheduled-conditions.component';

@Component({
  templateUrl: './commercial-terms-page.component.html',
  styleUrls: ['./commercial-terms-page.component.scss'],
  standalone: true,
  imports: [
    SharedModule,
    SelectEstablishmentsComponent,
    CardPrepaymentsScheduledConditionsComponent
  ],
})
export class CommercialTermsPageComponent extends BasePage implements OnInit, OnDestroy, AfterViewInit {

  scheduledFinalized: GetScheduledFinalizedResponse = { id: null as any } as GetScheduledFinalizedResponse;
  establishmentsSelected: string = null as any;
  establishmentsToSelect: SelectOption[] = [];
  slides: Slide[] = [];
  editCanceled = false;
  isEdit = false;
  economicGroupPhoneNumber = '';
  canceledScheduled = false;

  get hasPrepaymentsEstablishmentsSelected() {
    return !isEmpty(this.establishmentsSelected);
  }

  constructor(
    store$: Store<AppState>,
    navigationService: NavigationService,
    private notifcationService: NotificationService,
    private router: Router,
    public dialog: MatDialog,
    private communicationService: CommunicationService,
    private sanitizer: DomSanitizer) {

    super(store$, navigationService);

    this.subscribeEstablishmentsToSelect();
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.verifyEstablishmentSelected();
    this.subscribeScheduledPrepaymentHasError();
    this.subscribeGetEconomicGroupPhoneHasError();
    this.subscribeEconomicGroupPhone();
    this.subscribeActiveBanners();
    this.subscribeScheduledFinalizedPrepayment();
    this.selectGetScheduledFinalized();
    this.subscribeCanceledScheduledPrepayment();
    this.selectGetEconomicGroupPhone();

  }
  private subscribeActiveBanners() {
    this.store$
      .select(CommunicationStoreSelectors.selectActiveBanners)
      .pipe(takeUntil(this.$unsub))
      .subscribe((banners: Banner[]) => {
        const bannerRequests = (banners || [])
          .filter((x: Banner) => !!x.portalImage)
          .map((banner: Banner) =>
            this.communicationService.getBannerImage(banner?.portalImage?.fileName ?? '')
              .pipe(
                map((blob: Blob) => {
                  const objectUrl = URL.createObjectURL(blob);
                  return {
                    url: banner.url,
                    id: banner.id,
                    image: this.sanitizer.bypassSecurityTrustUrl(objectUrl),
                    backgroundColor: banner.backgroundColor,
                  };
                })
              )
          );

        // Aguarda todas as requisições serem concluídas antes de atualizar `this.slides`
        forkJoin(bannerRequests)
          .pipe(takeUntil(this.$unsub))
          .subscribe((slides: any) => {
            this.slides = slides;
          });
      });
  }

  private subscribeScheduledFinalizedPrepayment() {
    this.store$
      .select(PrepaymentsStoreSelectors.selectScheduledFinalizedPrepayment)
      .pipe(takeUntil(this.$unsub))
      .subscribe((scheduledFinalized) => {
        this.scheduledFinalized = scheduledFinalized;
      });
  }

  private subscribeEstablishmentsToSelect() {
    this.store$
      .select(AdministrationStoreSelectors.selectSelectedEstablishments)
      .pipe(takeUntil(this.$unsub))
      .subscribe(establishments => {
        if (!!establishments) {
          this.establishmentsToSelect = [...establishments
            .map(establishment => new SelectOption(`${establishment.documentNumber} - ${establishment.companyName}`, establishment.uid))];
        }
      });
  }

  private subscribeScheduledPrepaymentHasError() {
    this.store$
      .select(PrepaymentsStoreSelectors.selectScheduledPrepaymentHasError)
      .pipe(takeUntil(this.$unsub))
      .subscribe((error) => {
        if (!!error && error !== 'No active contracts') {
          this.store$.dispatch(new PrepaymentsStoreActions.SetNoErrorScheduledPrepaymentAction());
          this.notifcationService.showError("Por favor, tente novamente mais tarde ou entre em contato com nossa equipe de suporte.", "Algo deu errado nesta ação");
        }
      });
  }

  private subscribeGetEconomicGroupPhoneHasError() {
    this.store$
      .select(AdministrationStoreSelectors.selectGetEconomicGroupPhoneHasError)
      .pipe(takeUntil(this.$unsub))
      .subscribe((error) => {
        if (!!error) {
          this.store$.dispatch(new AdministrationStoreActions.SetNoErrorGetEconomicGroupPhoneAction());
          this.notifcationService.showError("Por favor, tente novamente mais tarde ou entre em contato com nossa equipe de suporte.", "Algo deu errado nesta ação");
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

  private subscribeCanceledScheduledPrepayment() {
    this.store$
      .select(PrepaymentsStoreSelectors.selectCanceledScheduledPrepayment)
      .pipe(takeUntil(this.$unsub))
      .subscribe((canceledScheduled) => {
        this.canceledScheduled = canceledScheduled;

        if (canceledScheduled) {
          this.store$.dispatch(new PrepaymentsStoreActions.SetCanceledScheduledPrepaymentAction());

          if (this.isEdit) {
            this.isEdit = false;
          } else {
            this.editCanceled = false;
            this.onOpenScheduledCancelDialog();
          }
        }
      });
  }

  private selectGetEconomicGroupPhone() {
    this.store$.dispatch(new AdministrationStoreActions.GetEconomicGroupPhoneAction());
  }

  private selectGetScheduledFinalized() {
    if (!!this.establishmentsSelected) {
      this.store$.dispatch(new PrepaymentsStoreActions.GetScheduledFinalizedAction(
        {
          uid: this.establishmentsSelected
        }));
    }
  }

  private selectCancelScheduledPrepayment() {
    if (!!this.establishmentsSelected) {
      this.store$.dispatch(new PrepaymentsStoreActions.CancelScheduledPrepaymentAction(
        {
          id: this.scheduledFinalized.id,
          uid: this.establishmentsSelected
        }));
    }
  }

  private selectListActiveBanners() {
    if (this.hasSelectedEstablishments) {
      this.store$.dispatch(
        new CommunicationStoreActions.ListActiveBannersAction({
          listCnpjs: this.establishmentsSelected
        }));
    }
  }

  onSelectedEstablishmentsClick(event: any) {
    this.establishmentsSelected = event;

    this.selectGetScheduledFinalized();
    this.selectListActiveBanners();
  }

  protected override onChangeSelectedEstablishments(): void {
    this.verifyEstablishmentSelected();

    this.selectGetScheduledFinalized();
    this.selectListActiveBanners();
  }

  private verifyEstablishmentSelected() {
    if (!this.establishmentsSelected) {
      this.establishmentsSelected = this.selectedEstablishmentsUids.firstOrDefault(x => !!x);
    } else {

      if (!isEmpty(this.selectedEstablishmentsUids) && this.selectedEstablishmentsUids.length === 1) {
        const firstEstablishment: string = this.selectedEstablishmentsUids.firstOrDefault(x => !!x);

        if (firstEstablishment !== this.establishmentsSelected) {
          this.establishmentsSelected = firstEstablishment;
        }
      }
    }
  }

  async onEditClick() {
    this.isEdit = true;

    await this.router.navigate(
      ['/prepayments-scheduled'],
      {
        queryParams: {
          uid: this.establishmentsSelected,
        }
      });
  }

  async onCancelClick() {

    const config: MatDialogConfig = {
      width: '22%',
      hasBackdrop: true,
      disableClose: true,
    };

    const dialogScheduleActiveRef = this.dialog.open(DialogScheduledActiveCancelComponent, config);

    dialogScheduleActiveRef
      .afterClosed()
      .subscribe((keep) => {
        if (keep === false) {
          this.editCanceled = true;
          this.openMfaTwoFactorAuthenticationDialog();
        }
      });
  }

  async onOpenScheduledCancelDialog() {

    const config: MatDialogConfig = {
      width: '22%',
      hasBackdrop: true,
      disableClose: true,
    };

    const dialogScheduleCancelRef = this.dialog.open(DialogScheduledCancelComponent, config);

    dialogScheduleCancelRef
      .afterClosed()
      .subscribe((confirm) => {
        if (!confirm) {
          this.goToPrepayments();
        }
      });
  }

  async goToPrepayments() {
    await this.router.navigate(
      ['/prepayments'],
      {
        queryParams: {
          uid: this.selectedEstablishmentsUids,
        }
      });
  }

  openMfaTwoFactorAuthenticationDialog() {
    this.store$.dispatch(new MfaStoreActions.SendPinSmsAction({ phoneNumber: this.economicGroupPhoneNumber }));

    this.dialog
      .open(DialogTwoFactorAuthenticationComponent, {
        width: '392px',
        hasBackdrop: true,
        disableClose: true,
        data: {
          step: 3,
          isMfa: false
        }
      })
      .afterClosed()
      .subscribe(data => {

        if (data === true) {
          if (this.isEdit || this.editCanceled) {
            this.selectCancelScheduledPrepayment();
          }
        } else if (data === false) {
          this.openMfaCancelDialog();
        }
      });
  }

  openMfaCancelDialog() {

    const config: MatDialogConfig = {
      width: '22%',
      hasBackdrop: true,
      disableClose: true,
    };

    const dialogCancelRef = this.dialog.open(DialogCancelComponent, config);

    dialogCancelRef
      .afterClosed()
      .subscribe(
        data => {
          if (!data) {
            this.openMfaTwoFactorAuthenticationDialog();
          }
        }
      );
  }
}
