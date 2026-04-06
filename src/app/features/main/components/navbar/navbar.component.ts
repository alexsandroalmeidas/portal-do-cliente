import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { isEmpty } from 'lodash';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { IdentityStoreSelectors } from 'src/app/root-store/identity-store';
import { MfaStoreActions } from 'src/app/root-store/mfa-store';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { DialogChangePasswordComponent } from '../dialog-change-password/dialog-change-password.component';
import { DialogEstablishmentSelectorComponent } from '../dialog-establishment-selector/dialog-establishment-selector.component';
import { EstablishmentInfo } from '../dialog-establishment-selector/establishment-info';
import { DialogActivationCompletedComponent } from '../mfa/dialog-activation-completed/dialog-activation-completed.component';
import { DialogCancelComponent } from '../mfa/dialog-cancel/dialog-cancel.component';
import { DialogTwoFactorAuthenticationComponent } from '../mfa/dialog-two-factor-authentication/dialog-two-factor-authentication.component';
import { AuthStoreSelectors, AuthStoreActions } from 'src/app/root-store';
import {
  AdministrationStoreSelectors,
  AdministrationStoreActions,
} from 'src/app/root-store/administration-store';
import {
  CommunicationStoreActions,
  CommunicationStoreSelectors,
} from 'src/app/root-store/communication-store';
import { AppState } from 'src/app/root-store/state';
import { SharedModule } from 'src/app/shared/shared.module';
import { MedalliaService } from 'src/app/shared/services/medallia.service';
import { Notification } from 'src/app/root-store/communication-store/communication.models';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  standalone: true,
  imports: [SharedModule],
})
export class NavbarComponent implements OnInit, OnDestroy {
  private $unsub = new Subject();

  textSelectEstablishment = 'Selecionar Estabelecimentos';

  selectedEstablishments: string[] = [];
  documentSelected: string = this.textSelectEstablishment;
  justOneDocument?: boolean;
  establishments: EstablishmentInfo[] | null = [];
  name?: string;
  notifications: Notification[] | null = [];
  notificationsOrdered: Notification[] | null = [];
  showNotifications = false;
  hasMyDataPermission = false;
  today = new Date().date();
  userEmail: string = '';
  isAd = false;
  forgotPassword = false;
  isFirstAccess = false;
  economicGroupPhoneNumber = '';

  get notificacoesNaoLidas() {
    return this.notifications?.filter((m) => !m.read).length || 0;
  }

  get hasNotifications() {
    return (this.notifications?.length || 0) > 0;
  }

  get hasDocumentSelected() {
    return (
      !!this.documentSelected &&
      this.documentSelected !== this.textSelectEstablishment
    );
  }

  get firstName() {
    if (!this.name) {
      return '';
    }

    return this.name.split(' ')[0];
  }

  get unreadedNotificationsCount() {
    if (!!this.notifications) {
      const filteredNotifications = this.notifications.filter((x) => !x.read);

      return filteredNotifications?.length ?? 0;
    }

    return 0;
  }

  constructor(
    public dialog: MatDialog,
    private store$: Store<AppState>,
    private router: Router,
    private notificationService: NotificationService,
    private medalliaService: MedalliaService,
  ) {}

  ngOnInit(): void {
    this.subscribeAuthData();
    this.subscribeNotifications();
    this.subscribeSelectedEstablishmentsDocuments();
    this.subscribeEstablishments();
    this.subscribeMyDataPermission();
    this.selectNotifications();
    this.subscribeNotificationDeleted();
    this.subscribeEconomicGroupPhone();
  }

  private selectNotifications() {
    if (this.hasDocumentSelected) {
      this.store$.dispatch(
        new CommunicationStoreActions.ListNotificationsAction(),
      );
    }
  }

  private subscribeEstablishments() {
    this.store$
      .select(AdministrationStoreSelectors.selectEstablishments)
      .pipe(takeUntil(this.$unsub))
      .subscribe((allEstablishments) => {
        this.establishments = (allEstablishments || []).map((establishment) => {
          this.justOneDocument = allEstablishments.length === 1;

          if (this.justOneDocument && isEmpty(this.selectedEstablishments)) {
            this.store$.dispatch(
              new AdministrationStoreActions.SetUserCustomersAction({
                uids: allEstablishments.map((c) => c.uid),
              }),
            );

            // this.medalliaService.loadMedalliaScript();
          }

          return {
            uid: establishment.uid,
            zuriId: establishment.idZuri,
            selected: this.selectedEstablishments.includes(
              establishment.documentNumber,
            ),
            name:
              establishment.groupName.length > 25
                ? establishment.groupName.slice(0, 24) + '...'
                : establishment.groupName,
            nameFull: establishment.groupName,
            document:
              establishment.documentNumber.length > 14
                ? establishment.documentNumber.slice(0, 14)
                : establishment.documentNumber,
            document15:
              establishment.documentNumber.length > 14
                ? establishment.documentNumber
                : 0 + establishment.documentNumber,
            companyName:
              establishment.companyName.length > 25
                ? establishment.companyName.slice(0, 24) + '...'
                : establishment.companyName,
            companyNameFull: establishment.companyName,
            customerName: establishment.companyName.slice(0, 30),

            documentFormatted: establishment.documentNumber.replace(
              /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
              '$1.$2.$3/$4-$5',
            ),
            documentFormatted15: (0 + establishment.documentNumber).replace(
              /^(\d{3})(\d{3})(\d{3})(\d{4})(\d{2})/,
              '0$1.$2.$3/$4-$5',
            ),
          } as EstablishmentInfo;
        });

        if (!isEmpty(this.establishments) && !this.hasDocumentSelected) {
          this.onSelectCustomer(false);
        }
      });
  }

  private subscribeSelectedEstablishmentsDocuments() {
    this.store$
      .select(AdministrationStoreSelectors.selectSelectedEstablishments)
      .pipe(takeUntil(this.$unsub))
      .subscribe((selectedEstablishments) => {
        this.selectedEstablishments = selectedEstablishments.map(
          (estab) => estab.documentNumber,
        );

        if (!isEmpty(selectedEstablishments)) {
          this.store$.dispatch(
            new CommunicationStoreActions.ListNotificationsAction(),
          );
          this.showNotifications = this.selectedEstablishments.length === 1;

          if (this.showNotifications) {
            this.documentSelected = `${this.selectedEstablishments[0]}`.replace(
              /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
              '$1.$2.$3/$4-$5',
            );
          } else {
            this.documentSelected =
              `${this.selectedEstablishments[0]}`.replace(
                /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
                '$1.$2.$3/$4-$5',
              ) + '...+';
          }
        }
      });
  }

  private subscribeAuthData() {
    this.store$
      .select(AuthStoreSelectors.selectAuthData)
      .pipe(takeUntil(this.$unsub))
      .subscribe((authData) => {
        this.name = authData?.user?.name;

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

  private subscribeNotifications() {
    this.store$
      .select(CommunicationStoreSelectors.selectNotifications)
      .pipe(takeUntil(this.$unsub))
      .subscribe((notifications: Notification[]) => {
        this.notifications = notifications || [];
        this.notificationsOrdered = this.notifications
          ?.filter((x) => !x.read)
          ?.sortBy((x) => x.id)
          .reverse()
          .slice(0, 5);
      });
  }

  private subscribeNotificationDeleted() {
    this.store$
      .select(CommunicationStoreSelectors.selectNotificationDeleted)
      .pipe(takeUntil(this.$unsub))
      .subscribe((notificationDeleted: boolean) => {
        if (notificationDeleted) {
          this.notificationService.showSuccess(
            'Notificação excluída com sucesso!',
          );
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

  ngOnDestroy(): void {
    this.$unsub.next(false);
    this.$unsub.complete();
  }

  async onSignOut() {
    console.log(`SignOutAction: navbar.component.ts:195`);
    this.store$.dispatch(new AuthStoreActions.SignOutAction());
    this.documentSelected = '';
  }

  async goToMyData() {
    await this.router.navigate(['/my-data']);
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

  openDialogTwoFactorAuthentication(step: number) {
    // enviar pin por sms
    this.store$.dispatch(
      new MfaStoreActions.SendPinSmsAction({
        phoneNumber: this.economicGroupPhoneNumber,
      }),
    );

    const config: MatDialogConfig = {
      width: '70vh',
      hasBackdrop: true,
      disableClose: true,
      data: {
        step: step,
        emailSelected: this.userEmail,
        isMfa: step === 1,
      },
    };

    const dialogTwoFactorRef = this.dialog.open(
      DialogTwoFactorAuthenticationComponent,
      config,
    );

    dialogTwoFactorRef.afterClosed().subscribe((data) => {
      if (data === true) {
        this.openDialogVerificationCompleted();
      } else if (data === false) {
        this.openDialogCancel(step);
      }
    });
  }

  openDialogCancel(step: number) {
    const config: MatDialogConfig = {
      width: '22%',
      hasBackdrop: true,
      disableClose: true,
    };

    const dialogCancelRef = this.dialog.open(DialogCancelComponent, config);

    dialogCancelRef.afterClosed().subscribe((data) => {
      this.store$.dispatch(new MfaStoreActions.VerifiedMfaAction());

      if (!data) {
        this.openDialogTwoFactorAuthentication(step);
      } else {
        this.store$.dispatch(new MfaStoreActions.VerifiedMfaAction());
      }
    });
  }

  openDialogVerificationCompleted() {
    const config: MatDialogConfig = {
      width: '22%',
      hasBackdrop: true,
      disableClose: true,
    };

    const dialogRef = this.dialog.open(
      DialogActivationCompletedComponent,
      config,
    );

    dialogRef.afterClosed().subscribe((_data) => {
      this.store$.dispatch(new MfaStoreActions.VerifiedMfaAction());

      if (!this.isAd) {
        if (this.isFirstAccess) {
          this.openChangePasswordDialog();
        }
      }
    });
  }

  showDialog(showCancel: boolean) {
    const config: MatDialogConfig = {
      width: '110vh',
      hasBackdrop: true,
      disableClose: true,
      data: {
        showCancel,
      },
      panelClass: 'dialog-establishment',
    };

    const dialogRef = this.dialog.open(
      DialogEstablishmentSelectorComponent,
      config,
    );

    dialogRef.afterClosed().subscribe((data) => {
      const uids = data.map((c: any) => c.uid);
      this.store$.dispatch(
        new AdministrationStoreActions.SetUserCustomersAction({ uids }),
      );
    });
  }

  async onSelectCustomer(showCancel: boolean = true) {
    if (this.justOneDocument) return;

    this.showDialog(showCancel);
  }

  async onNotificationClick(notification: Notification) {
    await this.router.navigate(['/notifications'], {
      queryParams: {
        id: notification.id,
      },
    });
  }

  async onDeleteClick(notification: Notification) {
    this.store$.dispatch(
      new CommunicationStoreActions.DeleteNotificationAction({
        id: notification.id,
        documentNumber: this.documentSelected,
      }),
    );
    this.selectNotifications();
  }

  async onNotificationsClick() {
    await this.router.navigate(['/notifications']);
  }

  private subscribeMyDataPermission() {
    this.store$
      .select(IdentityStoreSelectors.selectMyDataPermission)
      .pipe(takeUntil(this.$unsub))
      .subscribe((myDataPermission: boolean) => {
        this.hasMyDataPermission = myDataPermission || false;
      });
  }
}
