import { MedalliaService } from '@/shared/services/medallia.service';
import { Component, ViewContainerRef } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { saveAs } from 'file-saver';
import { filter, takeUntil } from 'rxjs';
import { AppState } from '../../../../root-store/state';
import {
  StatementsStoreActions,
  StatementsStoreSelectors,
} from '../../../../root-store/statements-store';
import { Statement } from '../../../../root-store/statements-store/statements.models';
import { NavigationService } from '../../../../shared/services/navigation.service';
import { SharedModule } from '../../../../shared/shared.module';
import { SidenavService } from '../../services/sidenav.service';
import { ToolbarService } from '../../services/toolbar.service';
import { MobileBasePage } from '../mobile-base.page';
import { ToolbarBackgroundComponent } from './../../components/toolbar-background/toolbar-background.component';
import { AddSchedulingStatementDialogComponent } from './components/add-scheduling-statement-dialog/add-scheduling-statement-dialog.component';

@Component({
  standalone: true,
  imports: [SharedModule, ToolbarBackgroundComponent],
  templateUrl: './statements-page.component.html',
  styleUrls: ['./statements-page.component.scss'],
})
export class StatementsPageComponent extends MobileBasePage {
  fileNameToDownload!: string;
  statements: Statement[] = [];

  get hasEnabledStatement() {
    return (
      (!Array.isEmpty(this.selectedEstablishments) &&
        this.selectedEstablishments?.some(
          (x) => x.enableElectronicStatement,
        )) ||
      false
    );
  }

  constructor(
    store$: Store<AppState>,
    bottomSheet: MatBottomSheet,
    viewContainerRef: ViewContainerRef,
    navigationService: NavigationService,
    toolbarService: ToolbarService,
    sidenavService: SidenavService,
    medalliaService: MedalliaService,
    router: Router,
  ) {
    super(
      store$,
      bottomSheet,
      viewContainerRef,
      navigationService,
      sidenavService,
      toolbarService,
      medalliaService,
      router,
    );

    this.subscribeStatementsFileTxt();
    this.subscribeStatementsFileXml();
    this.subscribeStatements();
  }

  override onChangeSelectedEstablishments() {
    this.selectStatements();
  }

  onAddStatementRequest() {
    const bottomSheetRef = this.bottomSheet.open(
      AddSchedulingStatementDialogComponent,
      {
        panelClass: 'bottom-sheet-panel',
        hasBackdrop: true,
        disableClose: true,
        data: {},
      },
    );

    bottomSheetRef
      .afterDismissed()
      .pipe(takeUntil(this.$unsub))
      .subscribe((range: { start: Date; end: Date }) => {
        const { start, end } = range;

        this.store$.dispatch(
          new StatementsStoreActions.AddSchedulingStatementAction({
            request: {
              initialDate: start.format(),
              finalDate: end.format(),
              uids: this.selectedEstablishmentsUids,
            },
          }),
        );
      });
  }

  subscribeStatementsFileTxt() {
    this.store$
      .select(StatementsStoreSelectors.selectStatementsFileTxt)
      .pipe(
        takeUntil(this.$unsub),
        filter((statementFile) => !!statementFile),
      )
      .subscribe((txt: Blob) => {
        saveAs(txt, `${this.fileNameToDownload}.txt`);
        this.store$.dispatch(
          new StatementsStoreActions.DownloadedStatementsFileTxtAction(),
        );
        this.fileNameToDownload = '';
      });
  }

  subscribeStatementsFileXml() {
    this.store$
      .select(StatementsStoreSelectors.selectStatementsFileXml)
      .pipe(
        takeUntil(this.$unsub),
        filter((statementFile) => !!statementFile),
      )
      .subscribe((xml: Blob) => {
        saveAs(xml, `${this.fileNameToDownload}.xml`);
        this.store$.dispatch(
          new StatementsStoreActions.DownloadedStatementsFileXmlAction(),
        );
        this.fileNameToDownload = '';
      });
  }

  subscribeStatements() {
    this.store$
      .select(StatementsStoreSelectors.selectStatements)
      .pipe(takeUntil(this.$unsub))
      .subscribe((statements: Statement[]) => {
        this.statements = statements || [];
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

  private selectStatements() {
    if (this.hasEnabledStatement) {
      this.store$.dispatch(
        new StatementsStoreActions.SelectStatementsAction({
          uids: this.selectedEstablishmentsUids,
        }),
      );
    }
  }
}
