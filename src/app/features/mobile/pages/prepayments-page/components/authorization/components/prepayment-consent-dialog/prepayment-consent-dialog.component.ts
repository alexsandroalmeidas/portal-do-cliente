import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatBottomSheet, MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';
import { firstValueFrom, map, Subject, take, takeUntil } from 'rxjs';
import { CheckMarkedComponent } from 'src/app/features/main/components/check-marked/check-marked.component';
import {
  MfaTwoFactorAuthenticationBottomSheetComponent
} from 'src/app/features/mobile/components/mfa/mfa-two-factor-authentication-bottom-sheet/mfa-two-factor-authentication-bottom-sheet.component';
import { Establishment } from 'src/app/root-store/administration-store/administration.models';
import { MfaStoreActions } from 'src/app/root-store/mfa-store';
import { PrepaymentsStoreActions } from 'src/app/root-store/prepayments-store';
import { AuthorizationCancelDialogComponent } from '../authorization-cancel-dialog/authorization-cancel-dialog.component';
import { CoreStoreSelectors } from './../../../../../../../../root-store';
import { AppState } from './../../../../../../../../root-store/state';
import { SharedModule } from './../../../../../../../../shared/shared.module';
import {
  BottomSheetPanelBodyDirective
} from './../../../../../../components/bottom-sheet-panel/bottom-sheet-panel-body.directive';
import { BottomSheetPanelComponent } from './../../../../../../components/bottom-sheet-panel/bottom-sheet-panel.component';
import {
  ConfirmationBottomSheetComponent
} from './../../../../../../components/confirmation-bottom-sheet/confirmation-bottom-sheet.component';

@Component({
  selector: 'app-prepayment-consent-dialog',
  standalone: true,
  templateUrl: './prepayment-consent-dialog.component.html',
  styleUrls: ['./prepayment-consent-dialog.component.scss'],
  imports: [
    SharedModule,
    BottomSheetPanelComponent,
    BottomSheetPanelBodyDirective,
    CheckMarkedComponent
  ]
})
export class PrepaymentConsentDialogComponent implements OnInit, OnDestroy {

  private $unsub = new Subject();

  hasAuthorization: boolean;
  sentAuthorization: boolean = false;
  economicGroupPhoneNumber!: string;

  constructor(
    private store$: Store<AppState>,
    private dialog: MatDialog,
    private bottomSheet: MatBottomSheet,
    private bottomSheetRef: MatBottomSheetRef<PrepaymentConsentDialogComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: { establishmentSelected: Establishment; hasAuthorization: boolean; phoneNumber: string; }) {

    this.hasAuthorization = data.hasAuthorization;
    this.economicGroupPhoneNumber = data.phoneNumber;
  }

  ngOnInit() {
    this.store$
      .pipe(
        select(CoreStoreSelectors.selectOverscrolling),
        takeUntil(this.$unsub)
      )
      .subscribe(overscrolling => {
        if (overscrolling) {
          this.onClose();
        }
      });
  }

  ngOnDestroy(): void {
    this.$unsub.next(false);
    this.$unsub.complete();
  }

  onClose() {
    this.bottomSheetRef.dismiss(true);
  }

  onChangeAuthorize(event: any) {
    if (event.checked) {
      this.sentAuthorization = true;
      this.openMfaTwoFactorAuthenticationBottomSheet();
    } else {
      this.openAuthorizationCancelDialog();
    }
  }

  async openAuthorizationCancelDialog() {

    const bottomSheetRef = this.bottomSheet.open(AuthorizationCancelDialogComponent, {
      panelClass: 'bottom-sheet-prepayment-panel',
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
          return;
        }

        if (keep === false) {
          this.openMfaTwoFactorAuthenticationBottomSheet();
        }
      });
  }

  async openMfaTwoFactorAuthenticationBottomSheet() {
    this.store$.dispatch(new MfaStoreActions.SendPinSmsAction({ phoneNumber: this.economicGroupPhoneNumber }));

    const bottomSheetRef = this.bottomSheet.open(MfaTwoFactorAuthenticationBottomSheetComponent, {
      panelClass: 'bottom-sheet-prepayment-panel',
      hasBackdrop: true,
      disableClose: true,
      data: {
        step: 3,
        isMfa: true,
        isActivation: false
      }
    });

    bottomSheetRef
      .afterDismissed()
      .pipe(take(1))
      .subscribe(async (data) => {
        if (data === true) {
          if (this.sentAuthorization) {
            this.store$.dispatch(new PrepaymentsStoreActions.AuthorizeAction({ uid: this.economicGroupPhoneNumber }));
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
        .pipe(take(1))
        .pipe(
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
