import { MedalliaService } from '@/shared/services/medallia.service';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import * as forms from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { isEmpty } from 'lodash';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AdministrationStoreSelectors } from '../../../../root-store/administration-store';
import { AppState } from '../../../../root-store/state';
import { SharedModule } from '../../../../shared/shared.module';
import { EstablishmentInfo } from './establishment-info';

@Component({
  templateUrl: './dialog-establishment-selector.component.html',
  styleUrls: ['./dialog-establishment-selector.component.scss'],
  standalone: true,
  imports: [SharedModule],
})
export class DialogEstablishmentSelectorComponent implements OnInit, OnDestroy {
  private $unsub = new Subject();

  displayedColumns: string[] = ['select', 'name', 'companyName', 'document'];
  fullData: EstablishmentInfo[] = []; // Todos os registros (20k)
  displayedData: EstablishmentInfo[] = []; // Dados exibidos na tabela
  selectedData: EstablishmentInfo[] = []; // Dados selecionados
  chunkSize: number = 10; // Tamanho do lote
  filterValue: string = ''; // Valor do filtro
  selection: { [key: number]: boolean } = {}; // Status dos checkboxes
  form!: forms.FormGroup;
  showCancel = true;

  constructor(
    private store$: Store<AppState>,
    private medalliaService: MedalliaService,
    private dialogRef: MatDialogRef<DialogEstablishmentSelectorComponent>,
    @Inject(MAT_DIALOG_DATA) data: any,
  ) {
    this.showCancel = data.showCancel;
  }

  ngOnInit() {
    this.subscribeEstablishments();

    this.store$
      .select(AdministrationStoreSelectors.selectSelectedEstablishmentsUids)
      .pipe(takeUntil(this.$unsub))
      .subscribe((selectedUids) => {
        if (!isEmpty(selectedUids) && !isEmpty(this.fullData)) {
          const selectedEstablishments: EstablishmentInfo[] = [];

          selectedUids.forEach((selectedUid) => {
            const establishments = this.fullData.filter(
              (customer) => customer.uid === selectedUid,
            );

            if (!isEmpty(establishments)) {
              establishments.forEach((customer) => {
                selectedEstablishments.push(customer);
                this.selectedData.push(customer);
                this.selection[customer.zuriId] = true;
              });
            }
          });

          this.updateDisplayedData();
        }
      });

    this.loadMore(); // Carregar os primeiros 10 registros
  }

  // Carregar mais dados no scroll
  loadMore() {
    const start = this.displayedData.length;
    const end = start + this.chunkSize;

    // Filtrar e carregar apenas novos itens
    const nextChunk = this.fullData
      .filter((item) => this.applyFilterToItem(item))
      .slice(start, end);

    this.displayedData = [...this.displayedData, ...nextChunk];
  }

  // Detectar scroll para carregar mais
  onScroll(event: Event) {
    const target = event.target as HTMLElement;
    this.loadMore();
  }

  // Aplicar filtro
  applyFilter(event: Event) {
    const value = (event.target as HTMLInputElement).value.toLowerCase();
    this.filterValue = value.replace(/[^a-zA-Z0-9\s]/g, '');
    this.resetDisplayedData();

    if (!this.filterValue) {
      this.updateDisplayedData();
    }
  }

  // Resetar dados exibidos ao alterar filtro
  resetDisplayedData() {
    this.displayedData = [];
    this.loadMore();
  }

  // Verificar se o item atende ao filtro
  applyFilterToItem(item: any): boolean {
    const searchStr =
      `${item.document} ${item.companyName} ${item.name}`.toLowerCase();
    return searchStr.includes(this.filterValue);
  }

  // Alterar status de seleção e mover para o topo
  onCheckChange(row: any, checked: boolean) {
    this.selection[row.zuriId] = checked;
    if (checked) {
      // Adicionar ao topo da lista
      this.selectedData = [
        row,
        ...this.selectedData.filter((item) => item.zuriId !== row.zuriId),
      ];
    } else {
      // Remover da lista selecionada
      this.selectedData = this.selectedData.filter(
        (item) => item.zuriId !== row.zuriId,
      );
    }

    if (!this.filterValue) {
      this.updateDisplayedData();
    }
  }

  // Atualizar lista exibida com itens selecionados no topo
  updateDisplayedData() {
    const unselectedData = this.fullData.filter(
      (item) => !this.selection[item.zuriId],
    );
    this.displayedData = [
      ...this.selectedData,
      ...unselectedData.slice(0, this.chunkSize),
    ];
  }

  // Selecionar ou desmarcar todos
  toggleSelectAll(event: any) {
    const checked = event.checked;

    this.displayedData.forEach((row) => {
      this.selection[row.zuriId] = checked;

      if (checked) {
        if (!this.selectedData.some((item) => item.zuriId === row.zuriId)) {
          this.selectedData.push(row);
        }
      } else {
        this.selectedData = [];
      }
    });

    this.updateDisplayedData();
  }

  // Verificar se todos estão selecionados
  isAllSelected(): boolean {
    return this.displayedData.every((row) => this.selection[row.zuriId]);
  }

  // trackBy para otimizar renderização
  trackByFn(index: number, item: any): number {
    return item.zuriId;
  }

  ngOnDestroy(): void {
    this.$unsub.next(false);
    this.$unsub.complete();
  }

  onSelectClick() {
    // this.medalliaService.loadMedalliaScript();
    this.dialogRef.close(this.selectedData);
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  private subscribeEstablishments() {
    this.store$
      .select(AdministrationStoreSelectors.selectEstablishments)
      .pipe(takeUntil(this.$unsub))
      .subscribe((allEstablishments) => {
        this.fullData = (allEstablishments || []).map((establishment) => {
          return {
            selected: this.selectedData.every(
              (e) => !!e && e.document === establishment.documentNumber,
            ),
            uid: establishment.uid,
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
            zuriId: establishment.idZuri,
          } as EstablishmentInfo;
        });
      });
  }
}
