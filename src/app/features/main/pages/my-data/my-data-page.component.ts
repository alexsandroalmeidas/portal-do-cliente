import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatAccordion } from '@angular/material/expansion';
import { Store } from '@ngrx/store';
import { isEmpty } from 'lodash';
import { takeUntil } from 'rxjs';
import { AuthStoreSelectors } from 'src/app/root-store';
import {
  AdministrationStoreActions,
  AdministrationStoreSelectors,
} from 'src/app/root-store/administration-store';
import { EconomicGroupBankingAccountResponse } from 'src/app/root-store/administration-store/administration.models';
import { SelectOption } from 'src/app/shared/models/select-options';
import { NavigationService } from 'src/app/shared/services/navigation.service';
import { SelectEstablishmentsComponent } from '../../components/select-establishments/select-establishments.component';
import { BasePage } from '../base.page';
import { AppState } from './../../../../root-store/state';
import { SharedModule } from './../../../../shared/shared.module';

@Component({
  templateUrl: './my-data-page.component.html',
  styleUrls: ['./my-data-page.component.scss'],
  standalone: true,
  imports: [SharedModule, SelectEstablishmentsComponent],
})
export class MyDataPageComponent
  extends BasePage
  implements OnInit, OnDestroy, AfterViewInit
{
  establishmentsToSelect: SelectOption[] = [];
  establishmentsSelected: string = null as any;
  establishmentsSelectedDocNumber: string = null as any;
  userEmail = '';
  panelOpenState = false;
  economicGroupBankingAccounts!: EconomicGroupBankingAccountResponse[];

  @ViewChild(MatAccordion) accordion!: MatAccordion;
  step = 0;

  constructor(
    store$: Store<AppState>,
    navigationService: NavigationService,
    public dialog: MatDialog,
  ) {
    super(store$, navigationService);

    this.subscribeEstablishmentsToSelect();
    this.subscribeEconomicGroupBankingAccounts();
    this.subscribeAuthData();
  }

  ngOnInit() {}

  ngAfterViewInit(): void {
    this.verifyEstablishmentSelected();
  }

  private subscribeEstablishmentsToSelect() {
    this.store$
      .select(AdministrationStoreSelectors.selectSelectedEstablishments)
      .pipe(takeUntil(this.$unsub))
      .subscribe((establishments) => {
        if (!!establishments) {
          this.establishmentsToSelect = [
            ...establishments.map(
              (establishment) =>
                new SelectOption(
                  `${establishment.documentNumber} - ${establishment.companyName}`,
                  establishment.uid,
                ),
            ),
          ];
        }
      });
  }

  private subscribeEconomicGroupBankingAccounts() {
    this.store$
      .select(AdministrationStoreSelectors.selectEconomicGroupBankingAccounts)
      .pipe(takeUntil(this.$unsub))
      .subscribe((bankingAccounts) => {
        if (!!bankingAccounts) {
          this.economicGroupBankingAccounts = (
            bankingAccounts?.bankingAccounts || []
          )?.filter(
            (x) =>
              x.hasAmex ||
              x.hasElo ||
              x.hasHiper ||
              x.hasMaster ||
              x.hasVisa ||
              x.pix,
          );
        }
      });
  }

  private verifyEstablishmentSelected() {
    if (!this.establishmentsSelected) {
      this.establishmentsSelected =
        this.selectedEstablishmentsUids.firstOrDefault((x) => !!x);
      this.establishmentsSelectedDocNumber = this.selectedEstablishments.filter(
        (x) => x.uid == this.establishmentsSelected,
      )[0].documentNumber;
    } else {
      if (
        !isEmpty(this.selectedEstablishmentsUids) &&
        this.selectedEstablishmentsUids.length === 1
      ) {
        const firstEstablishment: string =
          this.selectedEstablishmentsUids.firstOrDefault((x) => !!x);

        if (firstEstablishment !== this.establishmentsSelected) {
          this.establishmentsSelected = firstEstablishment;
          this.establishmentsSelectedDocNumber =
            this.selectedEstablishments.filter(
              (x) => x.uid == this.establishmentsSelected,
            )[0].documentNumber;
        }
      } else {
        this.establishmentsSelectedDocNumber =
          this.selectedEstablishments.filter(
            (x) => x.uid == this.establishmentsSelected,
          )[0].documentNumber;
      }
    }
  }

  private subscribeAuthData() {
    this.store$
      .select(AuthStoreSelectors.selectAuthData)
      .pipe(takeUntil(this.$unsub))
      .subscribe((authData) => {
        if (!!authData?.user?.email) {
          this.userEmail = authData?.user?.email;
        }
      });
  }

  private selectGetEconomicGroupBankingAccounts() {
    if (!!this.establishmentsSelected) {
      this.store$.dispatch(
        new AdministrationStoreActions.GetEconomicGroupBankingAccountsAction({
          uid: this.establishmentsSelected,
        }),
      );
    }
  }

  onSelectedEstablishmentsClick(event: any) {
    this.establishmentsSelected = event;
    this.selectGetEconomicGroupBankingAccounts();
    this.verifyEstablishmentSelected();
  }

  protected override onChangeSelectedEstablishments(): void {
    this.verifyEstablishmentSelected();

    this.selectGetEconomicGroupBankingAccounts();
  }
}
