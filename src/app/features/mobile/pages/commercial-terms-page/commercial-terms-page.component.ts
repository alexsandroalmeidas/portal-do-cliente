import { MedalliaService } from '@/shared/services/medallia.service';
import { Component, ViewContainerRef } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { isEmpty } from 'lodash';
import { firstValueFrom, map } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { MfaStoreActions } from 'src/app/root-store/mfa-store';
import { PrepaymentsStoreActions, PrepaymentsStoreSelectors } from 'src/app/root-store/prepayments-store';
import { GetScheduledFinalizedResponse } from 'src/app/root-store/prepayments-store/prepayments.models';
import { AppState } from 'src/app/root-store/state';
import { NavigationService } from 'src/app/shared/services/navigation.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { ConfirmationBottomSheetComponent } from '../../components/confirmation-bottom-sheet/confirmation-bottom-sheet.component';
import { EstablishmentSelectDialogComponent } from '../../components/establishment-select-dialog/establishment-select-dialog.component';
import { MfaTwoFactorAuthenticationBottomSheetComponent } from '../../components/mfa/mfa-two-factor-authentication-bottom-sheet/mfa-two-factor-authentication-bottom-sheet.component';
import { SidenavService } from '../../services/sidenav.service';
import { ToolbarService } from '../../services/toolbar.service';
import { MobileBasePage } from '../mobile-base.page';
import { PrepaymentScheduledActiveCardComponent } from './components/scheduled-active-card/scheduled-active-card.component';

@Component({
  standalone: true,
  imports: [
    SharedModule,
    PrepaymentScheduledActiveCardComponent
  ],
  templateUrl: './commercial-terms-page.component.html',
  styleUrls: ['./commercial-terms-page.component.scss']
})
export class CommercialTermsPageComponent extends MobileBasePage {

  scheduledFinalized: GetScheduledFinalizedResponse = { id: null as any } as GetScheduledFinalizedResponse;
  establishmentsSelected: string = null as any;
  editCanceled = false;
  canceledScheduled = false;
  economicGroupPhoneNumber = '';

  get selectedEstablishmentName() {
    return !isEmpty(this.establishmentsSelected) ? this.selectedEstablishments.filter(p => this.establishmentsSelected === p.uid)?.map(p => p.companyName) : null;
  }

  get hasSingleSelectedEstablishment() {
    return !isEmpty(this.selectedEstablishments) && (this.selectedEstablishments?.length || 0) === 1;
  }

  get hasSelectedEstablishment() {
    return !isEmpty(this.establishmentsSelected);
  }

  constructor(
    store$: Store<AppState>,
    bottomSheet: MatBottomSheet,
    viewContainerRef: ViewContainerRef,
    navigationService: NavigationService,
    toolbarService: ToolbarService,
    sidenavService: SidenavService,
    medalliaService: MedalliaService,
    router: Router,
    public dialog: MatDialog) {

    super(store$, bottomSheet, viewContainerRef, navigationService, sidenavService, toolbarService, medalliaService, router);
  }

  ngOnInit() {
    this.verifyEstablishmentSelected();

    this.subscribeScheduledFinalizedPrepayment();
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

    this.selectGetScheduledFinalized();
  }

  private selectGetScheduledFinalized() {
    if (!!this.establishmentsSelected) {
      this.store$.dispatch(new PrepaymentsStoreActions.GetScheduledFinalizedAction(
        {
          uid: this.establishmentsSelected
        }));
    }
  }

  private subscribeScheduledFinalizedPrepayment() {
    this.store$
      .select(PrepaymentsStoreSelectors.selectScheduledFinalizedPrepayment)
      .pipe(takeUntil(this.$unsub))
      .subscribe((scheduledFinalized) => {
        this.scheduledFinalized = scheduledFinalized;
      });
  }

  onSelectEstablishments() {

    const bottomSheetRef = this.bottomSheet.open(EstablishmentSelectDialogComponent, {
      panelClass: 'bottom-sheet-panel',
      hasBackdrop: true,
      disableClose: true,
      data: {
        establishments: this.selectedEstablishments,
        enableSelectedAllEstablishments: false,
        selectedEstablishments: [...this.selectedEstablishmentsUids.filter(p => this.establishmentsSelected === p)],
        selectedMoreThanOne: false
      }
    });

    bottomSheetRef
      .afterDismissed()
      .pipe(take(1))
      .subscribe((documents: string[]) => {
        if (!!documents) {
          this.establishmentsSelected = documents.firstOrDefault(x => !!x);
        }
      });
  }

  async goActivate(isEdit: boolean) {
    await this.router.navigate(
      ['/prepayments/mobile/scheduled'],
      {
        queryParams: {
          uid: this.establishmentsSelected,
          isEdit
        }
      });
  }

  onEditScheduledFinalizedClick(event: any) {

    if (event === true) {
      this.editCanceled = true;
      this.goActivate(this.editCanceled);
    }
  }

  onCancelScheduledFinalizedClick(event: any) {

    if (event === true) {
      this.openMfaTwoFactorAuthenticationBottomSheet();
    }
  }

  async openMfaTwoFactorAuthenticationBottomSheet() {
    this.store$.dispatch(new MfaStoreActions.SendPinSmsAction({ phoneNumber: this.economicGroupPhoneNumber }));

    const dialogTwoFactorRef = this.bottomSheet.open(MfaTwoFactorAuthenticationBottomSheetComponent, {
      panelClass: 'bottom-sheet-prepayment-panel',
      hasBackdrop: true,
      disableClose: true,
      data: {
        step: 3,
        isMfa: false
      }
    });

    dialogTwoFactorRef.afterDismissed()
      .pipe(take(1))
      .subscribe(async (data) => {
        if (data === true) {
          this.selectCancelScheduledPrepayment();

        } else if (data === false) {
          this.openMfaCancelDialog(() => this.openMfaTwoFactorAuthenticationBottomSheet());
        }
      }
      );
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

  confirmCancelMfa() {
    const dialogTwoFactorRef = this.bottomSheet.open(ConfirmationBottomSheetComponent, {
      panelClass: 'bottom-sheet-prepayment-panel',
      hasBackdrop: true,
      disableClose: true,
      data: {
        title: 'Atenção! Você tem certeza que deseja cancelar a ativação da autenticação de 2 fatores?',
        description: 'O cancelamento da autenticação de 2 fatores (MFA) impede que você conclua suas transações.',
        okText: 'Sim, desejo cancelar',
        cancelText: 'Voltar'
      }
    });

    return firstValueFrom(
      dialogTwoFactorRef
        .afterDismissed()
        .pipe(
          take(1),
          map(confirm => !!confirm)
        )
    );
  }

  async openMfaCancelDialog(callback: () => Promise<void>) {
    if (!(await this.confirmCancelMfa())) {
      await callback();
    }
  }
}
