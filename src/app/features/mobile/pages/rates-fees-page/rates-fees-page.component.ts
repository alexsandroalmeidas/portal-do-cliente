import {
  AdministrationStoreActions,
  AdministrationStoreSelectors
} from '@/root-store/administration-store';
import { EconomicGroupRatesResponse } from '@/root-store/administration-store/administration.models';
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
import { CardBrandsDetailSideComponent } from './components/card-brands-detail-side/card-brands-detail-side.component';

@Component({
  standalone: true,
  imports: [SharedModule, CardBrandsDetailSideComponent, ToolbarBackgroundComponent],
  templateUrl: './rates-fees-page.component.html',
  styleUrls: ['./rates-fees-page.component.scss']
})
export class RatesFeesPageComponent extends MobileBasePage {
  establishmentsSelected: string = null as any;
  economicGroupRates!: EconomicGroupRatesResponse;
  cardBrandSelected: string = '';
  lastUpdateDate!: Date;
  reserve: number = 0;

  get selectedEstablishmentName() {
    return !isEmpty(this.establishmentsSelected)
      ? this.selectedEstablishments
          .filter((p) => this.establishmentsSelected === p.uid)
          ?.map((p) => p.companyName)
      : null;
  }

  @ViewChild('cardBrandsDetailRef') private cardBrandsDetailRef!: TemplateRef<any>;

  constructor(
    store$: Store<AppState>,
    bottomSheet: MatBottomSheet,
    viewContainerRef: ViewContainerRef,
    navigationService: NavigationService,
    toolbarService: ToolbarService,
    sidenavService: SidenavService,
    medalliaService: MedalliaService,
    router: Router,
    public dialog: MatDialog
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
    this.verifyEstablishmentSelected();

    this.subscribeEconomicGroupRates();
  }

  private subscribeEconomicGroupRates() {
    this.store$
      .select(AdministrationStoreSelectors.selectEconomicGroupRates)
      .pipe(takeUntil(this.$unsub))
      .subscribe((economicGroupRates: EconomicGroupRatesResponse) => {
        this.economicGroupRates = economicGroupRates;

        if (!!this.economicGroupRates) {
          this.lastUpdateDate = this.economicGroupRates.lastUpdateDate;
          this.reserve = this.economicGroupRates.reserve;
        }
      });
  }

  private selectGetEconomicGroupRates() {
    if (!!this.establishmentsSelected) {
      this.store$.dispatch(
        new AdministrationStoreActions.GetEconomicGroupRatesAction({
          uid: this.establishmentsSelected
        })
      );
    }
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

    this.allSelects();
  }

  private allSelects() {
    this.selectGetEconomicGroupRates();
  }

  protected override onChangeSelectedEstablishments(): void {
    this.verifyEstablishmentSelected();
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
          this.allSelects();
        }
      });
  }

  async onOpenDetailCardBrands(cardBrandSelected: string) {
    this.cardBrandSelected = cardBrandSelected;
    await this.sidenavService.open(this.cardBrandsDetailRef);
  }

  async onCloseDetailCardBrands() {
    await this.sidenavService.close();
  }

  verifyHasRates(cardBrand: string) {
    const cardBrandsFiltered = this.economicGroupRates.rates.filter(
      (x) => x.cardBrand.toLocaleLowerCase() === cardBrand.toLocaleLowerCase()
    );

    return !!cardBrandsFiltered && cardBrandsFiltered.length > 0;
  }
}
