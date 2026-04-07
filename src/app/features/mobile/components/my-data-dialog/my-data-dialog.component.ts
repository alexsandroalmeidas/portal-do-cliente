import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';
import { Subject, take, takeUntil } from 'rxjs';
import { BottomSheetPanelBodyDirective } from 'src/app/features/mobile/components/bottom-sheet-panel/bottom-sheet-panel-body.directive';
import { BottomSheetPanelFooterDirective } from 'src/app/features/mobile/components/bottom-sheet-panel/bottom-sheet-panel-footer.directive';
import { BottomSheetPanelHeaderToolsDirective } from 'src/app/features/mobile/components/bottom-sheet-panel/bottom-sheet-panel-header-tools.directive';
import { BottomSheetPanelComponent } from 'src/app/features/mobile/components/bottom-sheet-panel/bottom-sheet-panel.component';
import { AuthStoreSelectors, CoreStoreSelectors } from 'src/app/root-store';
import { AppState } from 'src/app/root-store/state';
import { SharedModule } from 'src/app/shared/shared.module';
import { ChangePasswordBottomSheetComponent } from '../change-password-bottom-sheet/change-password-bottom-sheet.component';

@Component({
  selector: 'app-my-data-dialog',
  templateUrl: './my-data-dialog.component.html',
  styleUrls: ['./my-data-dialog.component.scss'],
  standalone: true,
  imports: [
    SharedModule,
    BottomSheetPanelComponent,
    BottomSheetPanelHeaderToolsDirective,
    BottomSheetPanelBodyDirective,
    BottomSheetPanelFooterDirective
  ]
})
export class MyDataDialogComponent implements OnInit, OnDestroy {
  private $unsub = new Subject();

  isAd = false;

  constructor(
    public dialog: MatDialog,
    private store$: Store<AppState>,
    private bottomSheet: MatBottomSheet,
    private bottomSheetRef: MatBottomSheetRef<MyDataDialogComponent>) {
  }

  ngOnInit() {

    this.subscribeAuthData();

    this.store$
      .pipe(
        select(CoreStoreSelectors.selectOverscrolling),
        takeUntil(this.$unsub)
      )
      .subscribe(overscrolling => {
        if (overscrolling) {
          this.onCancel(null);
        }
      });
  }

  ngOnDestroy(): void {
    this.$unsub.next(false);
    this.$unsub.complete();
  }

  onMyData() {
    this.bottomSheetRef.dismiss(true);
  }

  onCancel(ret: any) {
    this.bottomSheetRef.dismiss(ret);
  }

  onSignout() {
    this.bottomSheetRef.dismiss(false);
  }

  private subscribeAuthData() {
    this.store$
      .select(AuthStoreSelectors.selectAuthData)
      .pipe(takeUntil(this.$unsub))
      .subscribe((authData) => {
        this.isAd = authData?.isAd || false;
      });
  }


  openChangePasswordDialog() {
    const config: MatDialogConfig = {
      width: '80%',
      hasBackdrop: true,
      disableClose: true
    };

    const changePasswordBottomSheet = this.bottomSheet.open(ChangePasswordBottomSheetComponent, {
      panelClass: 'bottom-sheet-prepayment-panel',
      hasBackdrop: true,
      disableClose: true,
    });

    changePasswordBottomSheet
      .afterDismissed()
      .pipe(take(1))
      .subscribe(async data => {
      });
  }
}
