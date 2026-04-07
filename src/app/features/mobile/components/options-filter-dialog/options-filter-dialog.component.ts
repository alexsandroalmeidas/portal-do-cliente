import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { select, Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { CoreStoreSelectors } from '../../../../root-store';
import { AppState } from '../../../../root-store/state';
import { SharedModule } from '../../../../shared/shared.module';
import { BottomSheetPanelBodyDirective } from '../bottom-sheet-panel/bottom-sheet-panel-body.directive';
import { BottomSheetPanelFooterDirective } from '../bottom-sheet-panel/bottom-sheet-panel-footer.directive';
import { BottomSheetPanelHeaderToolsDirective } from '../bottom-sheet-panel/bottom-sheet-panel-header-tools.directive';
import { BottomSheetPanelComponent } from '../bottom-sheet-panel/bottom-sheet-panel.component';


@Component({
  selector: 'app-options-filter-dialog',
  standalone: true,
  templateUrl: './options-filter-dialog.component.html',
  styleUrls: ['./options-filter-dialog.component.scss'],
  imports: [
    SharedModule,
    BottomSheetPanelComponent,
    BottomSheetPanelHeaderToolsDirective,
    BottomSheetPanelBodyDirective,
    BottomSheetPanelFooterDirective
  ],
})
export class OptionsFilterDialogComponent implements OnInit, OnDestroy {
  private $unsub = new Subject();

  options: { selected: boolean; option: string; }[];

  get title() {
    return this.data?.title;
  }

  constructor(
    private store$: Store<AppState>,
    private bottomSheetRef: MatBottomSheetRef<OptionsFilterDialogComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: {
      title: string;
      options: string[];
      selected: string[];
      iconMap: { [key: string]: string }
    }) {

    this.options = this.data.options.map(option => {
      return {
        selected: this.data.selected.some(t => t === option),
        option: option
      };
    });
  }

  ngOnInit(): void {
    this.store$
      .pipe(
        select(CoreStoreSelectors.selectOverscrolling),
        takeUntil(this.$unsub)
      )
      .subscribe(overscrolling => {
        if (overscrolling) {
          this.bottomSheetRef.dismiss();
        }
      });
  }

  ngOnDestroy(): void {
    this.$unsub.next(false);
    this.$unsub.complete();
  }

  getIcon(option: string) {
    if (this.data.iconMap && option in this.data.iconMap) {
      return this.data.iconMap[option];
    }

    return '';
  }

  onSelectOption(index: number) {
    const option = this.options.at(index);

    if (option) {
      this.options.putAt(index, {
        ...option,
        selected: !option.selected
      });
    }
  }

  onClose() {
    const selectedOptions = this.options
      .filter(option => option.selected)
      .map(option => option.option);

    this.bottomSheetRef.dismiss(selectedOptions);
  }
}
