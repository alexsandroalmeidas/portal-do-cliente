import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { saveAs } from 'file-saver';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { filter, takeUntil } from 'rxjs';
import { NavigationService } from 'src/app/shared/services/navigation.service';
import { BasePage } from '../base.page';
import { AppState } from './../../../../root-store/state';
import {
  StatementsStoreActions,
  StatementsStoreSelectors,
} from './../../../../root-store/statements-store';
import { Statement } from './../../../../root-store/statements-store/statements.models';
import { TableService } from './../../../../shared/components/table';
import { TablePagination } from './../../../../shared/models/table.model';
import { SharedModule } from './../../../../shared/shared.module';
import { DialogStatementsSchedulingComponent } from './dialog-statements-scheduling/dialog-statements-scheduling.component';

@Component({
  templateUrl: './statements-page.component.html',
  styleUrls: ['./statements-page.component.scss'],
  standalone: true,
  imports: [SharedModule],
})
export class StatementsPageComponent
  extends BasePage
  implements OnInit, OnDestroy
{
  bsModalRef!: BsModalRef;

  enabledStatement = true;
  fileNameToDownload = '';
  tablePage = 1;
  itemsPerPage = 10;
  statements: Statement[] = [];
  dataSource: Statement[] = [];
  columnsToDisplay = ['createdDate', 'period', 'documentNumber', 'action'];

  constructor(
    store$: Store<AppState>,
    private modalService: BsModalService,
    private tableService: TableService,
    navigationService: NavigationService,
  ) {
    super(store$, navigationService);

    // this.enabledStatement =
    //   this.selectedEstablishments?.some((x) => x.enableElectronicStatement) ||
    //   false;

    if (this.enabledStatement) {
      this.selectStatements();
    }
  }

  ngOnInit() {
    this.subscribeStatementsFileTxt();

    this.subscribeStatementsFileXml();

    this.subscribeStatements();
  }

  private selectStatements() {
    this.store$.dispatch(
      new StatementsStoreActions.SelectStatementsAction({
        uids: this.selectedEstablishmentsUids,
      }),
    );
  }

  private subscribeStatementsFileTxt() {
    this.store$
      .select(StatementsStoreSelectors.selectStatementsFileTxt)
      .pipe(
        takeUntil(this.$unsub),
        filter((statementFile) => !!statementFile),
      )
      .subscribe((txt) => {
        saveAs(txt, `${this.fileNameToDownload}.txt`);
        this.store$.dispatch(
          new StatementsStoreActions.DownloadedStatementsFileTxtAction(),
        );
        this.fileNameToDownload = '';
      });
  }

  private subscribeStatementsFileXml() {
    this.store$
      .select(StatementsStoreSelectors.selectStatementsFileXml)
      .pipe(
        takeUntil(this.$unsub),
        filter((statementFile) => !!statementFile),
      )
      .subscribe((xml) => {
        saveAs(xml, `${this.fileNameToDownload}.xml`);
        this.store$.dispatch(
          new StatementsStoreActions.DownloadedStatementsFileXmlAction(),
        );
        this.fileNameToDownload = '';
      });
  }

  private subscribeStatements() {
    this.store$
      .select(StatementsStoreSelectors.selectStatements)
      .pipe(takeUntil(this.$unsub))
      .subscribe((statements) => {
        this.statements = [...statements];
        this.onPaginate({ page: 1, itemsPerPage: this.itemsPerPage });
      });
  }

  onDownloadTxtClick(fileName: any) {
    this.fileNameToDownload = fileName;
    this.store$.dispatch(
      new StatementsStoreActions.SelectStatementsFileTxtAction({ fileName }),
    );
  }

  onDownloadXmlClick(fileName: any) {
    this.fileNameToDownload = fileName;
    this.store$.dispatch(
      new StatementsStoreActions.SelectStatementsFileXmlAction({ fileName }),
    );
  }

  onSchedulingClick() {
    const options: ModalOptions = {
      initialState: {},
      class: 'modal-dialog modal-lg customer-modal',
      backdrop: true,
      ignoreBackdropClick: true,
    };

    this.bsModalRef = this.modalService.show(
      DialogStatementsSchedulingComponent,
      options,
    );
  }

  onPaginate(tablePagination: TablePagination): void {
    this.tablePage = tablePagination.page;
    this.dataSource = this.tableService.paginate(
      tablePagination,
      this.statements,
    );
  }
}
