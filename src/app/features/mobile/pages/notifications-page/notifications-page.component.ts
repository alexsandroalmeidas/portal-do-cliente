import { environment } from '@/environments/environment';
import { AuthStoreSelectors } from '@/root-store/auth-store';
import {
  CommunicationStoreActions,
  CommunicationStoreSelectors
} from '@/root-store/communication-store';
import { Notification } from '@/root-store/communication-store/communication.models';
import { AppState } from '@/root-store/state';
import { MedalliaService } from '@/shared/services/medallia.service';
import { NavigationService } from '@/shared/services/navigation.service';
import { PushService } from '@/shared/services/push.service';
import { SharedModule } from '@/shared/shared.module';
import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, ViewChild, ViewContainerRef } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { SwPush } from '@angular/service-worker';
import { select, Store } from '@ngrx/store';
import { isEmpty } from 'lodash';
import { exhaustMap, from, map, take, takeUntil } from 'rxjs';
import { EstablishmentSelectDialogComponent } from '../../components/establishment-select-dialog/establishment-select-dialog.component';
import { ToolbarBackgroundComponent } from '../../components/toolbar-background/toolbar-background.component';
import { SidenavService } from '../../services/sidenav.service';
import { ToolbarService } from '../../services/toolbar.service';
import { MobileBasePage } from '../mobile-base.page';
import { NotificationsViewPageComponent } from './components/notifications-view-page.component';
import { NotificationPageForm } from './notification-page.forms';

@Component({
  standalone: true,
  imports: [SharedModule, ToolbarBackgroundComponent, NotificationsViewPageComponent],
  templateUrl: './notifications-page.component.html',
  styleUrls: ['./notifications-page.component.scss']
})
export class NotificationsPageComponent extends MobileBasePage implements AfterViewInit {
  establishmentsSelected: string = null as any;
  editCanceled = false;
  canceledScheduled = false;
  economicGroupPhoneNumber = '';
  safeHtml!: SafeHtml;
  filteredNotifications: Notification[] = [];
  notificationView: Notification = null as any;

  user?: string;
  subscription: PushSubscription | null = null;
  form = this.fb.group<NotificationPageForm>({
    enabled: this.fb.control(false, [Validators.required])
  });

  get selectedEstablishmentName() {
    return !isEmpty(this.establishmentsSelected)
      ? this.selectedEstablishments
          .filter((p) => this.establishmentsSelected === p.uid)
          ?.map((p) => p.companyName)
      : null;
  }

  get hasSingleSelectedEstablishment() {
    return (
      !isEmpty(this.selectedEstablishments) && (this.selectedEstablishments?.length || 0) === 1
    );
  }

  @ViewChild('buttonSubscriber') buttonSubscriber!: ElementRef<HTMLElement>;

  constructor(
    store$: Store<AppState>,
    bottomSheet: MatBottomSheet,
    viewContainerRef: ViewContainerRef,
    navigationService: NavigationService,
    toolbarService: ToolbarService,
    sidenavService: SidenavService,
    router: Router,
    private fb: FormBuilder,
    private swPush: SwPush,
    private pushService: PushService,
    public dialog: MatDialog,
    private sanitizer: DomSanitizer,
    medalliaService: MedalliaService
  ) {
    super(
      store$,
      bottomSheet,
      viewContainerRef,
      navigationService,
      sidenavService,
      toolbarService,
      medalliaService,
      router
    );
  }

  ngOnInit() {
    this.subscribeAuthData();
    this.subscribePushNotificationSettings();
    this.verifyEstablishmentSelected();
  }

  private subscribePushNotificationSettings() {
    this.store$
      .pipe(
        takeUntil(this.$unsub),
        select(CommunicationStoreSelectors.selectPushNotificationSettings)
      )
      .subscribe({
        next: ({ enabled, subscription }) => {
          this.subscription = subscription;

          this.form.patchValue({
            enabled: enabled
          });
        }
      });
  }

  private subscribeAuthData() {
    this.store$.pipe(takeUntil(this.$unsub), select(AuthStoreSelectors.selectAuthData)).subscribe({
      next: (authData) => {
        this.user = authData?.user?.email;
      }
    });
  }

  private verifyEstablishmentSelected() {
    if (!this.establishmentsSelected) {
      this.establishmentsSelected = this.selectedEstablishmentsUids.firstOrDefault((x) => !!x);
    } else {
      if (
        !isEmpty(this.selectedEstablishmentsUids) &&
        this.selectedEstablishmentsUids.length === 1
      ) {
        const firstEstablishment: string = this.selectedEstablishmentsUids.firstOrDefault(
          (x) => !!x
        );

        if (firstEstablishment !== this.establishmentsSelected) {
          this.establishmentsSelected = firstEstablishment;
        }
      }
    }

    if (!!this.notifications) {
      const selectedEstablishment = this.selectedEstablishments.filter(
        (x) => x.uid == this.establishmentsSelected
      )[0];
      this.filteredNotifications = [
        ...this.notifications.filter(
          (p) => selectedEstablishment.documentNumber === p.documentNumber
        )
      ];
    } else {
      this.filteredNotifications = [];
    }
  }

  onSelectEstablishments() {
    const bottomSheetRef = this.bottomSheet.open(EstablishmentSelectDialogComponent, {
      panelClass: 'bottom-sheet-panel',
      hasBackdrop: true,
      disableClose: true,
      data: {
        establishments: this.selectedEstablishments,
        enableSelectedAllEstablishments: false,
        selectedEstablishments: [
          ...this.selectedEstablishmentsUids.filter((p) => this.establishmentsSelected === p)
        ],
        selectedMoreThanOne: false
      }
    });

    bottomSheetRef
      .afterDismissed()
      .pipe(take(1))
      .subscribe((documents: string[]) => {
        if (!!documents) {
          this.establishmentsSelected = documents.firstOrDefault((x) => !!x);

          if (!!this.notifications) {
            const selectedEstablishment = this.selectedEstablishments.filter(
              (x) => x.uid == this.establishmentsSelected
            )[0];
            this.filteredNotifications = [
              ...this.notifications.filter(
                (p) => selectedEstablishment.documentNumber === p.documentNumber
              )
            ];
          } else {
            this.filteredNotifications = [];
          }
        }
      });
  }

  byPassHTML(notification: Notification, fullText: boolean = false): SafeHtml {
    let text =
      notification.text.length > 50 ? notification.text.slice(0, 50) + '...' : notification.text;

    if (fullText) {
      text = notification.text;
    }

    if (!!notification) {
      this.safeHtml = this.sanitizer.bypassSecurityTrustHtml(text);
    }

    return this.safeHtml;
  }

  async onViewClick(notification: Notification) {
    this.notificationView = notification;

    this.store$.dispatch(
      new CommunicationStoreActions.MarkNotificationReadAction({ id: notification.id })
    );
    this.store$.dispatch(new CommunicationStoreActions.ListNotificationsAction());
  }

  override ngAfterViewInit(): void {
    super.ngAfterViewInit();

    if (!this.swPush.isEnabled) {
      return;
    }

    this.buttonSubscriber.nativeElement.addEventListener('change', (evt) => {
      const enabled = this.form.controls.enabled.value;

      if (enabled) {
        this.store$.dispatch(new CommunicationStoreActions.EnablePushNotificationsAction());

        from(
          this.swPush.requestSubscription({
            serverPublicKey: environment.pushNotificationsPublicKey
          })
        )
          .pipe(
            takeUntil(this.$unsub),
            exhaustMap((subscription) =>
              this.pushService.subscribe(this.user!, subscription).pipe(map(() => subscription))
            )
          )
          .subscribe({
            next: () => console.log('Successufully subscribed to push notifications'),
            error: (err: HttpErrorResponse) => console.log(err.error)
          });

        return;
      }

      this.store$.dispatch(new CommunicationStoreActions.DisablePushNotificationsAction());

      from(this.swPush.unsubscribe())
        .pipe(
          takeUntil(this.$unsub),
          exhaustMap((subscription) => this.pushService.unsubscribe(this.subscription!.endpoint))
        )
        .subscribe({
          next: () => console.log('Successufully unsubscribed to push notifications'),
          error: (err: HttpErrorResponse) => console.log(err.error)
        });
    });
  }
}
