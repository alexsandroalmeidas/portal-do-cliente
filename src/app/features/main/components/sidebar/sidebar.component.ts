import { IdentityStoreSelectors } from 'src/app/root-store/identity-store';
import { AfterViewInit, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { isEmpty } from 'lodash';
import { filter, Subject, takeUntil } from 'rxjs';
import { AuthStoreSelectors } from 'src/app/root-store';
import { UserInfo } from 'src/app/root-store/auth-store/auth.models';
import { AdministrationStoreSelectors } from 'src/app/root-store/administration-store';
import { AppState } from 'src/app/root-store/state';
import { NavigationItem } from 'src/app/shared/models/main.models';
import { SharedModule } from 'src/app/shared/shared.module';
import { SidebarItemComponent } from './sidebar-nav-item/sidebar-nav-item.component';
import { navigationItems } from 'src/app/app-navigation-items';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  standalone: true,
  imports: [SharedModule, SidebarItemComponent],
})
export class SidebarComponent implements AfterViewInit {
  private $unsub = new Subject();

  originalNavItems: NavigationItem[] = [];
  navItems: NavigationItem[] = [];
  hasPunctualPermission = false;
  hasScheduledPermission = false;
  hasAuthorizationPermission = false;
  hasRatesPermission = false;
  hasSalesPermission = false;
  hasReceivablesPermission = false;
  hasStatementsPermission = false;
  hasReportsPermission = false;
  loggedUser?: UserInfo;
  isManager = false;

  constructor(private store$: Store<AppState>) {
    this.subscribeSelectIsManager();
    this.subscribePunctualPrepaymentPermission();
    this.subscribeScheduledPrepaymentPermission();
    this.subscribeAuthorizationPrepaymentPermission();
    this.subscribeRatesPermission();
    this.subscribeSalesPermission();
    this.subscribeReceivablesPermission();
    this.subscribeStatementsPermission();
    this.subscribeReportsPermission();

    this.navItems = [];
  }

  ngAfterViewInit(): void {
    this.subscribeUserRoles();
    this.subscribeAuthData();
  }

  private subscribeUserRoles() {
    this.store$
      .select(IdentityStoreSelectors.selectUserRoles)
      .pipe(
        filter((roles) => !!roles),
        takeUntil(this.$unsub),
      )
      .subscribe((roles) => {
        this.originalNavItems = navigationItems.filter((nav) =>
          roles.some((role: any) => nav.roles.includes(role)),
        );
        this.loadMenu();
      });
  }

  private subscribeAuthData() {
    this.store$
      .select(AuthStoreSelectors.selectAuthData)
      .pipe(takeUntil(this.$unsub))
      .subscribe((authData) => {
        this.loggedUser = authData?.user;
        this.loadMenu();
      });
  }

  private loadMenu() {
    this.navItems = this.originalNavItems;
    if (!isEmpty(this.navItems)) {
      this.navItems.map((nav) => {
        if (nav.label === 'app.navigation.prepayments') {
          nav.hasPermission = !this.isManager && this.hasPermission;
        } else if (nav.label === 'app.navigation.sales') {
          nav.hasPermission = this.hasSalesPermission;
        } else if (nav.label === 'app.navigation.receivables') {
          nav.hasPermission = this.hasReceivablesPermission;
        } else if (nav.label === 'app.navigation.statements') {
          nav.hasPermission = this.hasStatementsPermission;
        } else if (nav.label === 'app.navigation.reports') {
          nav.hasPermission = this.hasReportsPermission;
        } else if (nav.label === 'app.navigation.commercial-terms') {
          nav.hasPermission = this.hasScheduledPermission;
        } else if (nav.label === 'app.navigation.rates-fees') {
          if (!!this.loggedUser && this.loggedUser.showRates) {
            nav.hasPermission = true;
          } else {
            nav.hasPermission = this.hasRatesPermission;
          }
        }

        if (!isEmpty(nav.children)) {
          nav.children?.map((child) => {
            if (child.label === 'app.navigation.prepayments-authorization') {
              child.hasPermission = this.hasAuthorizationPermission;
            } else if (child.label === 'app.navigation.prepayments') {
              child.hasPermission =
                this.hasPunctualPermission || this.hasScheduledPermission;
            }
          });
        }
      });
    }
  }

  get hasPermission() {
    return (
      this.hasPunctualPermission &&
      this.hasScheduledPermission &&
      this.hasAuthorizationPermission
    );
  }

  onClickItem() {
    this.store$
      .select(AdministrationStoreSelectors.selectSelectedEstablishmentsUids)
      .pipe(takeUntil(this.$unsub))
      .subscribe((selectedEstablishments) => {
        if (!isEmpty(selectedEstablishments)) {
          const showNotifications = selectedEstablishments.length === 1;

          if (showNotifications) {
            // this.store$.dispatch(new CommunicationStoreActions.ListNotificationsAction());
          }
        }
      });
  }

  private subscribeSelectIsManager() {
    this.store$
      .select(AdministrationStoreSelectors.selectIsManager)
      .pipe(takeUntil(this.$unsub))
      .subscribe((isManager: boolean) => {
        this.isManager = isManager;
        this.loadMenu();
      });
  }

  private subscribePunctualPrepaymentPermission() {
    this.store$
      .select(IdentityStoreSelectors.selectPunctualPrepaymentPermission)
      .pipe(takeUntil(this.$unsub))
      .subscribe((punctualPermission: boolean) => {
        const permission = punctualPermission || false;

        if (permission !== this.hasAuthorizationPermission) {
          this.hasPunctualPermission = permission;
          this.loadMenu();
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
          this.loadMenu();
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
          this.loadMenu();
        }
      });
  }

  private subscribeRatesPermission() {
    this.store$
      .select(IdentityStoreSelectors.selectRatesFeesPermission)
      .pipe(takeUntil(this.$unsub))
      .subscribe((ratesPermission: boolean) => {
        const permission = ratesPermission || false;

        if (permission !== this.hasRatesPermission) {
          this.hasRatesPermission = permission;
          this.loadMenu();
        }
      });
  }

  private subscribeSalesPermission() {
    this.store$
      .select(IdentityStoreSelectors.selectSalesPermission)
      .pipe(takeUntil(this.$unsub))
      .subscribe((salesPermission: boolean) => {
        const permission = salesPermission || false;

        if (permission !== this.hasSalesPermission) {
          this.hasSalesPermission = permission;
          this.loadMenu();
        }
      });
  }

  private subscribeReceivablesPermission() {
    this.store$
      .select(IdentityStoreSelectors.selectReceivablesPermission)
      .pipe(takeUntil(this.$unsub))
      .subscribe((receivablesPermission: boolean) => {
        const permission = receivablesPermission || false;

        if (permission !== this.hasReceivablesPermission) {
          this.hasReceivablesPermission = permission;
          this.loadMenu();
        }
      });
  }

  private subscribeStatementsPermission() {
    this.store$
      .select(IdentityStoreSelectors.selectStatementsPermission)
      .pipe(takeUntil(this.$unsub))
      .subscribe((statementsPermission: boolean) => {
        const permission = statementsPermission || false;

        if (permission !== this.hasStatementsPermission) {
          this.hasStatementsPermission = permission;
          this.loadMenu();
        }
      });
  }

  private subscribeReportsPermission() {
    this.store$
      .select(IdentityStoreSelectors.selectReportsPermission)
      .pipe(takeUntil(this.$unsub))
      .subscribe((reportsPermission: boolean) => {
        const permission = reportsPermission || false;

        if (permission !== this.hasReportsPermission) {
          this.hasReportsPermission = permission;
          this.loadMenu();
        }
      });
  }
}
