import { environment } from '@/environments/environment';
import { IdentityStoreActions } from '@/root-store/identity-store';
import { MedalliaService } from '@/shared/services/medallia.service';
import { TemplatePortal } from '@angular/cdk/portal';
import { AfterViewInit, Component, OnDestroy, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { isEmpty } from 'lodash';
import { Subject, take, takeUntil } from 'rxjs';
import { CommunicationStoreActions, CommunicationStoreSelectors } from 'src/app/root-store/communication-store';
import { IdentityStoreSelectors } from 'src/app/root-store/identity-store';
import { MfaStoreSelectors } from 'src/app/root-store/mfa-store';
import { MyDataDialogComponent } from '../components/my-data-dialog/my-data-dialog.component';
import { AdministrationStoreActions, AdministrationStoreSelectors } from './../../../root-store/administration-store';
import { Establishment } from './../../../root-store/administration-store/administration.models';
import { AuthStoreActions } from './../../../root-store/auth-store';
import { Notification } from './../../../root-store/communication-store/communication.models';
import { CoreStoreActions, CoreStoreSelectors } from './../../../root-store/core-store';
import { AppState } from './../../../root-store/state';
import { NavigationService } from './../../../shared/services/navigation.service';
import {
  EstablishmentSelectDialogComponent
} from './../components/establishment-select-dialog/establishment-select-dialog.component';
import { SidenavService } from './../services/sidenav.service';
import { ToolbarService } from './../services/toolbar.service';

@Component({ template: '' })
export abstract class MobileBasePage implements AfterViewInit, OnDestroy {

  protected $unsub = new Subject();
  private establishments: Establishment[] = [];
  // protected selectedEstablishmentsDocuments: string[] = [];
  protected selectedEstablishmentsUids: string[] = [];
  protected selectedEstablishments: Establishment[] = [];
  protected notifications: Notification[] = [];
  protected hasBannersPermission = false;
  protected hasRatesPermission = false;
  protected hasScheduledPermission = false;
  protected verificationCompleted = false;

  public visibilityOn: boolean = false;
  public bannerUrl: string = environment.prepaymentLink;

  @ViewChild('toolbarContent')
  private toolbarContent!: TemplateRef<unknown>;
  private toolbarPortal!: TemplatePortal<unknown>;

  private get hasSingleEstablishment() {
    return this.establishments.length === 1;
  }

  private get hasEstablishments() {
    return !Array.isEmpty(this.establishments);
  }

  protected get hasSelectedEstablishments() {
    return !Array.isEmpty(this.selectedEstablishmentsUids);
  }

  protected get unreadedNotificationsCount() {
    if (!!this.notifications) {
      const filteredNotifications = this.notifications.filter(x => !x.read);

      return filteredNotifications?.length ?? 0;
    }

    return 0;
  }

  constructor(
    protected store$: Store<AppState>,
    protected bottomSheet: MatBottomSheet,
    protected viewContainerRef: ViewContainerRef,
    protected navigationService: NavigationService,
    protected sidenavService: SidenavService,
    protected toolbarService: ToolbarService,
    protected medalliaService: MedalliaService,
    protected router: Router) {

    this.subscribeSelectedEstablishments();
    this.subscribeSensitiveDataVisibility();
    this.subscribeEstablishments();
    this.subscribeNotifications();
    this.subscribeBannersPermission();
    this.subscribeRatesPermission();
    this.subscribeScheduledPrepaymentPermission();
    this.subscribeVerificationCompleted();
  }

  protected onChangeSelectedEstablishments(): void { };
  protected onChangeVisibilityMode(): void { };

  ngAfterViewInit(): void {
    this.toolbarPortal = new TemplatePortal(
      this.toolbarContent,
      this.viewContainerRef
    );

    this.toolbarService.setPortal(this.toolbarPortal);
  }

  ngOnDestroy(): void {
    this.$unsub.next(false);
    this.$unsub.complete();
  }

  onToggleVisibility() {
    this.store$.dispatch(new CoreStoreActions.ToggleSensitiveDataVisibilityModeAction());
  }

  onSignout() {
    console.log(`SignOutAction: mobile-base.page.ts:106`);
    this.store$.dispatch(new AuthStoreActions.SignOutAction());
  }

  onNavigateBack() {
    this.navigationService.back();
  }

  protected onNotificationClick() {
    this.router.navigate(['/notifications/mobile']);
  }

  protected goToMyData() {
    this.router.navigate(['/my-data/mobile']);
  }

  protected onOpenMyDataDialog() {

    const bottomSheetRef = this.bottomSheet.open(MyDataDialogComponent, {
      panelClass: 'bottom-sheet-panel',
      hasBackdrop: true,
      disableClose: true,
      data: {}
    });

    bottomSheetRef
      .afterDismissed()
      .pipe(take(1))
      .subscribe((click) => {
        if (click === true) {
          this.goToMyData();
        }

        if (click === false) {
          this.onSignout();
        }
      });
  }

  protected onSelectEstablishment() {
    if (this.hasSingleEstablishment) {
      // this.store$.dispatch(new AdministrationStoreActions.SetUserCustomersAction({ documents: this.selectedEstablishmentsDocuments }));
      return;
    }

    const bottomSheetRef = this.bottomSheet.open(EstablishmentSelectDialogComponent, {
      panelClass: 'bottom-sheet-panel',
      hasBackdrop: true,
      disableClose: true,
      data: {
        establishments: this.establishments,
        selectedEstablishmentsUids: this.selectedEstablishmentsUids
      }
    });

    bottomSheetRef
      .afterDismissed()
      .pipe(take(1))
      .subscribe((uids: string[]) => {
        if (!!uids) {
          this.selectSetUserCustomers(uids);
          this.selectNotifications();
        }
      });
  }

  private selectSetUserCustomers(uids: any) {

    if (!!uids) {
      this.store$.dispatch(
        new AdministrationStoreActions.SetUserCustomersAction({ uids })
      );
    }
  }

  private selectNotifications() {
    this.store$.dispatch(new CommunicationStoreActions.ListNotificationsAction());
  }

  private subscribeNotifications() {
    this.store$
      .select(CommunicationStoreSelectors.selectNotifications)
      .pipe(takeUntil(this.$unsub))
      .subscribe((notifications: any) => {
        this.notifications = (notifications || []);
      });
  }

  private subscribeBannersPermission() {
    this.store$
      .select(IdentityStoreSelectors.selectBannersPermission)
      .pipe(takeUntil(this.$unsub))
      .subscribe((bannersPermission: boolean) => {
        this.hasBannersPermission = bannersPermission || false;
      });
  }

  private subscribeScheduledPrepaymentPermission() {
    this.store$
      .select(IdentityStoreSelectors.selectScheduledPrepaymentPermission)
      .pipe(takeUntil(this.$unsub))
      .subscribe((scheduledPermission: boolean) => {
        this.hasScheduledPermission = scheduledPermission || false;
      });
  }

  private subscribeRatesPermission() {
    this.store$
      .select(IdentityStoreSelectors.selectRatesFeesPermission)
      .pipe(takeUntil(this.$unsub))
      .subscribe((ratesPermission: boolean) => {
        this.hasRatesPermission = ratesPermission || false;
      });
  }

  private subscribeSelectedEstablishments() {
    this.store$
      .select(AdministrationStoreSelectors.selectSelectedEstablishments)
      .pipe(takeUntil(this.$unsub))
      .subscribe((selectedEstablishments: Establishment[]) => {

        const activeMfa =
          (!isEmpty(this.selectedEstablishments) && this.selectedEstablishments.some((x) => x.activeMfa));

        (window as any).statusMfa = activeMfa ? 'Ativo' : 'Não Ativo';

        const selectedEstablishmentDocuments = selectedEstablishments.map(c => c.documentNumber);
        const selectedEstablishmentsUids = selectedEstablishments.map(c => c.uid);
        const selectedEstablishmentIdZuri = selectedEstablishments.map(c => c.idZuri);
        const selectedEstablishmentEstablishmentType = selectedEstablishments.map(c => c.establishmentType);

        // const documentsChanged = [
        //   ... this.selectedEstablishmentsDocuments.differenceWith(selectedEstablishmentDocuments),
        //   ...selectedEstablishmentDocuments.differenceWith(this.selectedEstablishmentsDocuments)
        // ];

        this.selectedEstablishments = selectedEstablishments || [];
        // this.selectedEstablishmentsDocuments = selectedEstablishmentDocuments || [];

        const uidsChanged = [
          ... this.selectedEstablishmentsUids.differenceWith(selectedEstablishmentsUids),
          ...selectedEstablishmentsUids.differenceWith(this.selectedEstablishmentsUids)
        ];

        const selectedEstablishmentsDocuments = selectedEstablishmentDocuments || [];
        this.selectedEstablishmentsUids = selectedEstablishmentsUids || [];

        if (uidsChanged.length) {
          this.onChangeSelectedEstablishments();
          this.selectListUserPermissions();
          this.selectNotifications();
        }

        (window as any).uids = this.selectedEstablishmentsUids.toString();
        (window as any).cnpj = selectedEstablishmentsDocuments.toString();
        (window as any).idZuri = selectedEstablishmentIdZuri.toString();
        (window as any).tipoEstabelecimento = selectedEstablishmentEstablishmentType.toString();

        if (!isEmpty(this.selectedEstablishments)) {
          const activeMfa = this.selectedEstablishments.some((x) => x.activeMfa);
          (window as any).statusMfa = activeMfa ? 'Ativo' : 'Não Ativo';
        }
      });
  }

  private selectListUserPermissions() {
    this.store$.dispatch(
      new IdentityStoreActions.ListUserPermissionsAction(
        {
          selectedEstablishments: this.selectedEstablishmentsUids
        }));
  }

  private subscribeEstablishments() {
    this.store$
      .select(AdministrationStoreSelectors.selectEstablishments)
      .pipe(takeUntil(this.$unsub))
      .subscribe((establishments: Establishment[]) => {
        this.establishments = [...(establishments || [])];

        if (this.establishments.length === 1 && !this.hasSelectedEstablishments) {
          const uids = establishments.map((c) => c.uid);

          this.selectSetUserCustomers(uids);
          this.selectNotifications();
          this.medalliaService.loadMedalliaScript();
        }

        if (this.hasEstablishments && !this.hasSelectedEstablishments) {
          this.onSelectEstablishment();
        }
      });
  }

  private subscribeSensitiveDataVisibility() {
    this.store$
      .select(CoreStoreSelectors.selectSensitiveDataVisibility)
      .pipe(takeUntil(this.$unsub))
      .subscribe((visibilityOn) => {
        this.visibilityOn = visibilityOn;
        this.onChangeVisibilityMode();
      });
  }

  private subscribeVerificationCompleted() {
    this.store$
      .select(MfaStoreSelectors.selectVerificationCompleted)
      .pipe(takeUntil(this.$unsub))
      .subscribe((verificationCompleted: boolean) => {
        this.verificationCompleted = verificationCompleted;
      });
  }
}
