import { MedalliaService } from '@/shared/services/medallia.service';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { select, Store } from '@ngrx/store';
import { isEmpty } from 'lodash';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { EstablishmentInfo } from 'src/app/features/main/components/dialog-establishment-selector/establishment-info';
import { CoreStoreSelectors } from 'src/app/root-store';
import { AppState } from 'src/app/root-store/state';
import { Establishment } from '../../../../root-store/administration-store/administration.models';
import { SharedModule } from '../../../../shared/shared.module';
import { BottomSheetPanelBodyDirective } from '../bottom-sheet-panel/bottom-sheet-panel-body.directive';
import { BottomSheetPanelFooterDirective } from '../bottom-sheet-panel/bottom-sheet-panel-footer.directive';
import { BottomSheetPanelHeaderToolsDirective } from '../bottom-sheet-panel/bottom-sheet-panel-header-tools.directive';
import { BottomSheetPanelComponent } from '../bottom-sheet-panel/bottom-sheet-panel.component';

@Component({
  selector: 'app-establishment-select-dialog',
  standalone: true,
  templateUrl: './establishment-select-dialog.component.html',
  styleUrls: ['./establishment-select-dialog.component.scss'],
  imports: [
    SharedModule,
    BottomSheetPanelComponent,
    BottomSheetPanelHeaderToolsDirective,
    BottomSheetPanelBodyDirective,
    BottomSheetPanelFooterDirective
  ],
})
export class EstablishmentSelectDialogComponent implements OnInit, OnDestroy {
  private $unsub = new Subject();

  filterEstablishmentsControl: FormControl;

  filteredEstablishments: EstablishmentInfo[] = [];
  dataEstablishments: EstablishmentInfo[] = [];
  selectedEstablishmentsUids: string[];
  allEstablishmentsSelected: boolean = false;
  enableAllEstablishments: boolean = true;
  enableSelectedAllEstablishments: boolean = true;
  selectedMoreThanOne: boolean = true;

  constructor(
    private store$: Store<AppState>,
    private medalliaService: MedalliaService,
    private bottomSheetRef: MatBottomSheetRef<EstablishmentSelectDialogComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: {
      establishments: Establishment[],
      selectedEstablishmentsUids: string[],
      enableSelectedAllEstablishments: boolean,
      selectedMoreThanOne: boolean
    }) {

    this.filterEstablishmentsControl = new FormControl();

    this.selectedEstablishmentsUids = [...data?.selectedEstablishmentsUids || []];
    this.allEstablishmentsSelected = this.data.establishments.length === this.selectedEstablishmentsUids.length;
    this.enableSelectedAllEstablishments = data?.enableSelectedAllEstablishments ?? true;
    this.enableAllEstablishments = this.enableSelectedAllEstablishments;
    this.selectedMoreThanOne = data?.selectedMoreThanOne ?? true;

    const dataEstablishments = [...data?.establishments || []];

    if (!isEmpty(dataEstablishments)) {
      this.dataEstablishments = dataEstablishments
        .map(establishment => {
          return {
            uid: establishment.uid,
            zuriId: establishment.idZuri,
            selected: this.selectedEstablishmentsUids.includes(establishment.uid),
            name: establishment.groupName.length > 25 ? establishment.groupName.slice(0, 24) + '...' : establishment.groupName,
            nameFull: establishment.groupName,
            document: establishment.documentNumber.length > 14 ? establishment.documentNumber.slice(0, 14) : establishment.documentNumber,
            document15: establishment.documentNumber.length > 14 ? establishment.documentNumber : (0 + establishment.documentNumber),
            companyName: establishment.companyName.length > 25 ? establishment.companyName.slice(0, 24) + '...' : establishment.companyName,
            companyNameFull: establishment.companyName,
            customerName: establishment.companyName.slice(0, 30),

            documentFormatted: establishment.documentNumber.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5"),
            documentFormatted15: (0 + establishment.documentNumber).replace(/^(\d{3})(\d{3})(\d{3})(\d{4})(\d{2})/, "0$1.$2.$3/$4-$5")
          } as EstablishmentInfo
        });
    }

    this.orderFilteredEstablishments(this.dataEstablishments);
  }

  private orderFilteredEstablishments(establishments: EstablishmentInfo[]) {
    this.filteredEstablishments = establishments.sort((a, b) => {
      return (a.selected === b.selected) ? 0 : a.selected ? -1 : 1;
    });
  }

  ngOnInit(): void {

    this.store$
      .pipe(
        select(CoreStoreSelectors.selectOverscrolling),
        takeUntil(this.$unsub)
      )
      .subscribe(overscrolling => {
        if (overscrolling
          && !!this.selectedEstablishmentsUids
          && this.selectedEstablishmentsUids.length >= 1) {
          this.onClose();
        }
      });

    this.filterEstablishmentsControl.valueChanges
      .pipe(
        takeUntil(this.$unsub),
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe((filter: string) => {
        this.orderFilteredEstablishments(this.dataEstablishments);

        if (filter) {
          const term = filter.toUpperCase();

          this.filteredEstablishments = this.filteredEstablishments
            .filter(e => {
              return e.companyName.toUpperCase().includes(term)
                || e.document.toUpperCase().includes(term);
            });
        }

        this.enableAllEstablishments = !filter || (!isEmpty(this.filteredEstablishments) && this.filteredEstablishments.length > 3);

        if (!this.enableSelectedAllEstablishments) {
          this.enableAllEstablishments = this.enableSelectedAllEstablishments;
        }
      });
  }

  ngOnDestroy(): void {
    this.$unsub.next(false);
    this.$unsub.complete();
  }

  disableSelected(uid: string) {
    return !this.selectedMoreThanOne
      && (!!this.selectedEstablishmentsUids
        && this.selectedEstablishmentsUids.length >= 1
        && !this.selectedEstablishmentsUids.includes(uid));
  }

  onAllEstablishmentsToglleSelect() {
    this.allEstablishmentsSelected = !this.allEstablishmentsSelected;
    this.selectedEstablishmentsUids = [];

    if (this.allEstablishmentsSelected) {
      this.selectedEstablishmentsUids = [...this.dataEstablishments || []].map(e => e.uid);
    }
  }

  onChangeEstablishmentSelection(establishment: EstablishmentInfo) {
    const selected = this.selectedEstablishmentsUids.includes(establishment.uid);

    this.selectedEstablishmentsUids = this.selectedEstablishmentsUids
      .filter(e => e !== establishment.uid);

    if (!selected) {
      this.selectedEstablishmentsUids.push(establishment.uid);
    }

    this.allEstablishmentsSelected = this.data.establishments.length === this.selectedEstablishmentsUids.length;
  }

  onSelectEstablishments() {
    this.onClose();
  }

  onClose() {

    this.medalliaService.loadMedalliaScript();
    this.bottomSheetRef.dismiss(this.selectedEstablishmentsUids);
  }
}
