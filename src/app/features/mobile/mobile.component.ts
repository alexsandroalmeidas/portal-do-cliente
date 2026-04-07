import { AdministrationStoreSelectors } from '@/root-store/administration-store';
import { IdentityStoreSelectors } from '@/root-store/identity-store';
import {
  AfterContentInit,
  AfterViewInit,
  Component,
  OnDestroy,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenav } from '@angular/material/sidenav';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { SwPush } from '@angular/service-worker';
import { select, Store } from '@ngrx/store';
import { isEmpty } from 'lodash';
import { filter, map, Subject, takeUntil, withLatestFrom } from 'rxjs';

import { AuthStoreSelectors } from './../../root-store';
import { UserInfo } from './../../root-store/auth-store/auth.models';
import {
  CommunicationStoreActions,
  CommunicationStoreSelectors,
} from './../../root-store/communication-store';
import { AppState } from './../../root-store/state';
import { PushNotificationEnableData } from './../../shared/components/push-notification-enable-dialog/push-notification-enable-data';
import { PushNotificationEnableDialogComponent } from './../../shared/components/push-notification-enable-dialog/push-notification-enable-dialog.component';
import { PushNotificationEnableResult } from './../../shared/components/push-notification-enable-dialog/push-notification-enable-result';
import { NavigationItem } from './../../shared/models/main.models';
import { SharedModule } from './../../shared/shared.module';
import { SidenavService } from './services/sidenav.service';
import { ToolbarService } from './services/toolbar.service';

@Component({
  standalone: true,
  selector: 'app-mobile',
  imports: [SharedModule, MatMenuModule, MatExpansionModule],
  templateUrl: './mobile.component.html',
  styleUrls: ['./mobile.component.scss'],
  host: { class: '' },
})
export class MobileComponent
  implements AfterViewInit, AfterContentInit, OnDestroy
{
  private $unsub = new Subject();

  events: string[] = [];
  opened!: boolean;
  toolbarStyle!: string;

  navigationItems: NavigationItem[] = [
    {
      path: '/summary/mobile',
      icon: 'home',
      label: 'Início',
      hasPermission: true,
      roles: [],
      order: 1,
    },
    {
      path: '/sales/mobile',
      icon: 'credit_card',
      label: 'Vendas',
      hasPermission: true,
      roles: [],
      order: 2,
    },
    {
      path: '/receivables/mobile',
      icon: 'attach_money',
      label: 'A Receber',
      hasPermission: true,
      roles: [],
      order: 3,
    },
    {
      path: '/prepayments/mobile',
      icon: 'calendar_today',
      label: 'Antecipar',
      hasPermission: this.hasPermission,
      roles: [],
      order: 4,
    },
    {
      path: '/others/mobile',
      icon: 'more_horiz',
      label: 'Outros',
      hasPermission: true,
      roles: [],
      order: 5,
    },
  ];

  hasPunctualPermission = false;
  hasScheduledPermission = false;
  hasAuthorizationPermission = false;
  hasRatesPermission = false;
  loggedUser?: UserInfo;
  isManager = false;

  @ViewChild('rightSidenavPanel') private rightSidenavPanel!: MatSidenav;
  @ViewChild('rightSidenavContent', { read: ViewContainerRef })
  private viewContainerRef!: ViewContainerRef;

  get hasPermission() {
    return (
      this.hasPunctualPermission &&
      this.hasScheduledPermission &&
      this.hasAuthorizationPermission
    );
  }

  get filter(): NavigationItem[] {
    return this.navigationItems.filter((x) => x.hasPermission);
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private sidenavService: SidenavService,
    public toolbarService: ToolbarService,
    private store$: Store<AppState>,
    private swPush: SwPush,
    private dialog: MatDialog,
  ) {
    this.toolbarService.setPortal(null as any);

    this.subscribeSelectIsManager();
    this.subscribePunctualPrepaymentPermission();
    this.subscribeScheduledPrepaymentPermission();
    this.subscribeAuthorizationPrepaymentPermission();

    this.subscribeAuthData();

    this.router.events
      .pipe(
        takeUntil(this.$unsub),
        filter((e) => e instanceof NavigationEnd),
        map(() => {
          let route = this.route.firstChild;
          let child = route;

          while (child) {
            if (child.firstChild) {
              child = child.firstChild;
              route = child;
            } else {
              child = null;
            }
          }
          return route;
        }),
      )
      .subscribe((route: any) => {
        if (route) {
          const {
            snapshot: {
              data: { toolbar },
            },
          } = route;

          const url = this.router.url;

          if (url.includes('/summary/mobile')) {
            this.toolbarStyle = '';
          } else {
            this.toolbarStyle = 'light';
          }
        }
      });
  }

  ngAfterViewInit() {
    this.sidenavService.setSidenav(this.rightSidenavPanel);
    this.sidenavService.setContentVcf(this.viewContainerRef);
  }

  ngAfterContentInit() {
    if (!this.swPush.isEnabled) {
      return;
    }

    this.swPush.subscription.subscribe((subscription) => {
      if (!!subscription) {
        this.store$.dispatch(
          new CommunicationStoreActions.SubscribePushNotificationsAction({
            subscription,
          }),
        );
        return;
      }

      this.store$.dispatch(
        new CommunicationStoreActions.UnsubscribePushNotificationsAction(),
      );

      this.store$
        .select(AuthStoreSelectors.selectSessionInitialized)
        .pipe(
          takeUntil(this.$unsub),
          filter((initialized) => initialized === true),
          withLatestFrom(
            this.store$.pipe(
              select(
                CommunicationStoreSelectors.selectPushNotificationSettings,
              ),
            ),
          ),
        )
        .subscribe(([_, pushNotificationsSettings]) => {
          if (
            pushNotificationsSettings.subscription ||
            !pushNotificationsSettings.enabled
          ) {
            return;
          }

          this.dialog.open<
            PushNotificationEnableDialogComponent,
            PushNotificationEnableData,
            PushNotificationEnableResult
          >(PushNotificationEnableDialogComponent, {
            width: '100vh',
            hasBackdrop: false,
            disableClose: true,
            panelClass: 'push-notification-dialog',
            data: {
              user: this.loggedUser?.email!,
            },
          });
        });
    });
  }

  ngOnDestroy(): void {
    this.$unsub.next(false);
    this.$unsub.complete();
  }

  private subscribePunctualPrepaymentPermission() {
    this.store$
      .select(IdentityStoreSelectors.selectPunctualPrepaymentPermission)
      .pipe(takeUntil(this.$unsub))
      .subscribe((punctualPermission: boolean) => {
        const permission = punctualPermission || false;

        if (permission !== this.hasAuthorizationPermission) {
          this.hasPunctualPermission = permission;
          this.verifyMenuPermissions();
        }
      });
  }

  private subscribeScheduledPrepaymentPermission() {
    this.store$
      .select(IdentityStoreSelectors.selectScheduledPrepaymentPermission)
      .pipe(takeUntil(this.$unsub))
      .subscribe((scheduledPermission: boolean) => {
        const permission = scheduledPermission || false;

        if (permission !== this.hasAuthorizationPermission) {
          this.hasScheduledPermission = permission;
          this.verifyMenuPermissions();
        }
      });
  }

  private subscribeAuthorizationPrepaymentPermission() {
    this.store$
      .select(IdentityStoreSelectors.selectAuthorizationPrepaymentPermission)
      .pipe(takeUntil(this.$unsub))
      .subscribe((authorizationPermission: boolean) => {
        const permission = authorizationPermission || false;

        if (permission !== this.hasAuthorizationPermission) {
          this.hasAuthorizationPermission = permission;
          this.verifyMenuPermissions();
        }
      });
  }

  private subscribeAuthData() {
    this.store$
      .select(AuthStoreSelectors.selectAuthData)
      .pipe(takeUntil(this.$unsub))
      .subscribe((authData) => {
        this.loggedUser = authData?.user;
        this.verifyMenuPermissions();
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

  private verifyMenuPermissions() {
    if (!isEmpty(this.navigationItems)) {
      if (!!this.loggedUser) {
        this.navigationItems
          .filter((x) => x.path === '/prepayments/mobile')
          ?.map(
            (p) => (p.hasPermission = this.hasPermission && !this.isManager),
          );
      }

      this.navigationItems = this.navigationItems.sortBy((x) => x.order);
    }
  }
}
