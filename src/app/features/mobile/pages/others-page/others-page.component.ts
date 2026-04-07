import { AuthStoreSelectors } from '@/root-store/auth-store';
import { AppState } from '@/root-store/state';
import { MedalliaService } from '@/shared/services/medallia.service';
import { NavigationService } from '@/shared/services/navigation.service';
import { SharedModule } from '@/shared/shared.module';
import { Component, ViewContainerRef } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { takeUntil } from 'rxjs';
import { ToolbarBackgroundComponent } from '../../components/toolbar-background/toolbar-background.component';
import { SidenavService } from '../../services/sidenav.service';
import { ToolbarService } from '../../services/toolbar.service';
import { MobileBasePage } from '../mobile-base.page';
import { NotificationsCardComponent } from './notifications-card/notifications-card.component';
import { RatesFeesCardComponent } from './rates-fees-card/rates-fees-card.component';
import { ReportsCardComponent } from './reports-card/reports-card.component';
import { StatementsCardComponent } from './statements-card/statements-card.component';

@Component({
  standalone: true,
  imports: [
    SharedModule,
    ReportsCardComponent,
    StatementsCardComponent,
    NotificationsCardComponent,
    RatesFeesCardComponent,
    ToolbarBackgroundComponent
  ],
  templateUrl: './others-page.component.html',
  styleUrls: ['./others-page.component.scss']
})
export class OthersPageComponent extends MobileBasePage {
  loggedUser: any;

  get verifyRatesPermission() {
    return this.hasRatesPermission || (!!this.loggedUser && this.loggedUser.showRates);
  }

  constructor(
    store$: Store<AppState>,
    bottomSheet: MatBottomSheet,
    viewContainerRef: ViewContainerRef,
    navigationService: NavigationService,
    toolbarService: ToolbarService,
    sidenavService: SidenavService,
    router: Router,
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

    this.subscribeAuthData();
  }

  private subscribeAuthData() {
    this.store$
      .select(AuthStoreSelectors.selectAuthData)
      .pipe(takeUntil(this.$unsub))
      .subscribe((authData) => {
        this.loggedUser = authData?.user;
      });
  }
}
