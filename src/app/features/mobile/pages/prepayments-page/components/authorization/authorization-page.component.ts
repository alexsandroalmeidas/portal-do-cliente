import { MedalliaService } from '@/shared/services/medallia.service';
import { Component, ViewContainerRef } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { firstValueFrom, map, take, takeUntil } from 'rxjs';
import {
  MfaTwoFactorAuthenticationBottomSheetComponent
} from 'src/app/features/mobile/components/mfa/mfa-two-factor-authentication-bottom-sheet/mfa-two-factor-authentication-bottom-sheet.component';
import { SidenavService } from 'src/app/features/mobile/services/sidenav.service';
import { ToolbarService } from 'src/app/features/mobile/services/toolbar.service';
import { AdministrationStoreActions, AdministrationStoreSelectors } from 'src/app/root-store/administration-store';
import { MfaStoreActions, MfaStoreSelectors } from 'src/app/root-store/mfa-store';
import { PrepaymentsStoreActions, PrepaymentsStoreSelectors } from 'src/app/root-store/prepayments-store';
import { AppState } from 'src/app/root-store/state';
import { NavigationService } from 'src/app/shared/services/navigation.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { MobileBasePage } from '../../../mobile-base.page';
import {
  ConfirmationBottomSheetComponent
} from './../../../../components/confirmation-bottom-sheet/confirmation-bottom-sheet.component';
import {
  AuthorizationCancelDialogComponent
} from './components/authorization-cancel-dialog/authorization-cancel-dialog.component';
import {
  AuthorizationSuccessDialogComponent
} from './components/authorization-success-dialog/authorization-success-dialog.component';

@Component({
  standalone: true,
  imports: [
    SharedModule
  ],
  templateUrl: './authorization-page.component.html',
  styleUrls: ['./authorization-page.component.scss']
})
export class PrepaymentsAuthorizationPageComponent extends MobileBasePage {

  documentNumberSelected = '';
  economicGroupPhoneNumber = '';
  hasAuthorization = false;
  sentAuthorization = false;

  constructor(
    store$: Store<AppState>,
    bottomSheet: MatBottomSheet,
    viewContainerRef: ViewContainerRef,
    navigationService: NavigationService,
    toolbarService: ToolbarService,
    sidenavService: SidenavService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    medalliaService: MedalliaService,
    router: Router) {

    super(store$, bottomSheet, viewContainerRef, navigationService, sidenavService, toolbarService, medalliaService, router);

    const { uid } = this.route.snapshot.queryParams;
    this.documentNumberSelected = uid;
  }

  ngOnInit() {
    this.selectGetEconomicGroupPhone();
    this.subscribeEconomicGroupPhone();
    this.subscribeAuthorization();
    this.selectGetAuthorization();
    this.subscribeAuthorized();
    this.subscribeGetEconomicGroupPhoneHasError();
    this.subscribePinSmsHasError();
    this.subscribeVerificationCompletedHasError();
  }

  private subscribeGetEconomicGroupPhoneHasError() {
    this.store$
      .select(AdministrationStoreSelectors.selectGetEconomicGroupPhoneHasError)
      .pipe(takeUntil(this.$unsub))
      .subscribe((error) => {
        if (!!error) {
          this.store$.dispatch(new AdministrationStoreActions.SetNoErrorGetEconomicGroupPhoneAction());
          this.router.navigate(['/failure/mobile']);
        }
      });
  }

  private subscribePinSmsHasError() {
    this.store$
      .select(MfaStoreSelectors.selectPinSmsHasError)
      .pipe(takeUntil(this.$unsub))
      .subscribe((error) => {
        if (!!error) {
          this.store$.dispatch(new MfaStoreActions.SetNoErrorPinSmsAction());
          this.router.navigate(['/failure/mobile']);
        }
      });
  }

  private subscribeVerificationCompletedHasError() {
    this.store$
      .select(MfaStoreSelectors.selectVerificationCompletedHasError)
      .pipe(takeUntil(this.$unsub))
      .subscribe((error) => {
        if (!!error) {
          this.store$.dispatch(new MfaStoreActions.SetNoErrorVerificationCompletedAction());
          this.router.navigate(['/failure/mobile']);
        }
      });
  }

  private selectGetEconomicGroupPhone() {
    this.store$.dispatch(new AdministrationStoreActions.GetEconomicGroupPhoneAction());
  }

  private subscribeEconomicGroupPhone() {
    this.store$
      .select(AdministrationStoreSelectors.selectEconomicGroupPhone)
      .pipe(takeUntil(this.$unsub))
      .subscribe((phoneNumber) => {
        this.economicGroupPhoneNumber = phoneNumber;
      });
  }

  private subscribeAuthorization() {
    this.store$
      .select(PrepaymentsStoreSelectors.selectAuthorization)
      .pipe(takeUntil(this.$unsub))
      .subscribe((authorization) => {
        if (!!authorization) {
          this.hasAuthorization = authorization;
        }
      });
  }

  private subscribeAuthorized() {
    this.store$
      .select(PrepaymentsStoreSelectors.selectAuthorized)
      .pipe(takeUntil(this.$unsub))
      .subscribe((authorized) => {

        if (this.sentAuthorization) {
          if (authorized) {
            this.openAuthorizationSuccessDialog();
          }
        }
      });
  }

  private selectGetAuthorization() {
    this.store$.dispatch(
      new PrepaymentsStoreActions.GetAuthorizationAction(
        {
          uid: this.documentNumberSelected
        }));
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

    dialogTwoFactorRef
      .afterDismissed()
      .pipe(take(1))
      .subscribe(async data => {
        if (data === true) {
          if (this.sentAuthorization) {
            this.store$.dispatch(new PrepaymentsStoreActions.AuthorizeAction({ uid: this.documentNumberSelected }));
          }
        } else if (data === false) {
          await this.openMfaCancelDialog(() => this.openMfaTwoFactorAuthenticationBottomSheet());
        }
      });
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

  async onChangeAuthorize(event: any) {

    if (event.checked) {
      this.sentAuthorization = true;
      this.openMfaTwoFactorAuthenticationBottomSheet();
    } else {
      this.openAuthorizationCancelDialog();
    }
  }

  async openAuthorizationCancelDialog() {

    const bottomSheetRef = this.bottomSheet.open(AuthorizationCancelDialogComponent, {
      panelClass: 'bottom-sheet-panel',
      hasBackdrop: true,
      disableClose: true,
      data: {}
    });

    bottomSheetRef
      .afterDismissed()
      .pipe(take(1))
      .subscribe((keep) => {
        if (keep === true) {
          this.hasAuthorization = true;
        } else if (keep === false) {
          this.openMfaTwoFactorAuthenticationBottomSheet();
        }
      });
  }

  async openAuthorizationSuccessDialog() {

    const bottomSheetRef = this.bottomSheet.open(AuthorizationSuccessDialogComponent, {
      panelClass: 'bottom-sheet-panel',
      hasBackdrop: true,
      disableClose: true,
      data: {}
    });

    bottomSheetRef
      .afterDismissed()
      .pipe(take(1))
      .subscribe((concluido) => {
        if (concluido) {
          this.store$.dispatch(new PrepaymentsStoreActions.SetAuthorizedAction());
          this.hasAuthorization = true;
          this.onNavigateBack();
        }
      });
  }
}
