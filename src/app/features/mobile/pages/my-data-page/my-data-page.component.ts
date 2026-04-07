import { AdministrationStoreActions, AdministrationStoreSelectors } from '@/root-store/administration-store';
import { EconomicGroupBankingAccountResponse } from '@/root-store/administration-store/administration.models';
import { AppState } from '@/root-store/state';
import { MedalliaService } from '@/shared/services/medallia.service';
import { NavigationService } from '@/shared/services/navigation.service';
import { SharedModule } from '@/shared/shared.module';
import { Component, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { isEmpty } from 'lodash';
import { take, takeUntil } from 'rxjs';
import { EstablishmentSelectDialogComponent } from '../../components/establishment-select-dialog/establishment-select-dialog.component';
import { ToolbarBackgroundComponent } from '../../components/toolbar-background/toolbar-background.component';
import { SidenavService } from '../../services/sidenav.service';
import { ToolbarService } from '../../services/toolbar.service';
import { MobileBasePage } from '../mobile-base.page';
import { MyDataDetailSideComponent } from './components/my-data-detail-side/my-data-detail-side.component';

@Component({
  standalone: true,
  imports: [
    SharedModule,
    MyDataDetailSideComponent,
    ToolbarBackgroundComponent
  ],
  templateUrl: './my-data-page.component.html',
  styleUrls: ['./my-data-page.component.scss']
})
export class MyDataPageComponent extends MobileBasePage {

  establishmentsSelected: string = null as any;
  economicGroupBankingAccounts!: EconomicGroupBankingAccountResponse[];
  bankingAccount!: EconomicGroupBankingAccountResponse;

  get hasSingleSelectedEstablishment() {
    return !isEmpty(this.selectedEstablishments) && (this.selectedEstablishments?.length || 0) === 1;
  }

  get selectedEstablishmentName() {
    return !isEmpty(this.establishmentsSelected) ? this.selectedEstablishments.filter(p => this.establishmentsSelected === p.uid)?.map(p => p.companyName) : null;
  }

  @ViewChild('myDataDetailRef') private myDataDetailRef!: TemplateRef<any>;

  constructor(
    store$: Store<AppState>,
    bottomSheet: MatBottomSheet,
    viewContainerRef: ViewContainerRef,
    navigationService: NavigationService,
    toolbarService: ToolbarService,
    sidenavService: SidenavService,
    router: Router,
    public dialog: MatDialog,
    medalliaService: MedalliaService) {

    super(store$, bottomSheet, viewContainerRef, navigationService, sidenavService, toolbarService, medalliaService, router);
  }

  ngOnInit() {
    this.verifyEstablishmentSelected();
    this.subscribeEconomicGroupBankingAccounts();
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

    this.allSelects();
  }

  protected override onChangeSelectedEstablishments(): void {
    this.verifyEstablishmentSelected();
  }

  private selectGetEconomicGroupBankingAccounts() {
    if (!!this.establishmentsSelected) {
      this.store$.dispatch(
        new AdministrationStoreActions.GetEconomicGroupBankingAccountsAction({
          uid: this.establishmentsSelected,
        })
      );
    }
  }

  private subscribeEconomicGroupBankingAccounts() {
    this.store$
      .select(AdministrationStoreSelectors.selectEconomicGroupBankingAccounts)
      .pipe(takeUntil(this.$unsub))
      .subscribe(bankingAccounts => {
        if (!!bankingAccounts) {
          this.economicGroupBankingAccounts = (bankingAccounts?.bankingAccounts || [])?.filter(x => x.hasAmex || x.hasElo || x.hasHiper || x.hasMaster || x.hasVisa || x.pix);
        }
      });
  }

  private allSelects() {
    this.selectGetEconomicGroupBankingAccounts();
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
          this.allSelects();
        }
      });
  }

  async onOpenDetailCardBrands(bankingAccount: EconomicGroupBankingAccountResponse) {
    this.bankingAccount = bankingAccount;
    await this.sidenavService.open(this.myDataDetailRef);
  }

  async onCloseDetailCardBrands() {
    await this.sidenavService.close();
  }

}
