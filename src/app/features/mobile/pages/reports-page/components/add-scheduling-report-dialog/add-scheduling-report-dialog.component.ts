import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { MatChipEditedEvent, MatChipInputEvent } from '@angular/material/chips';
import { select, Store } from '@ngrx/store';
import { Moment } from 'moment';
import { Subject, takeUntil } from 'rxjs';
import {
  EquipmentChip,
  MovementType,
  MovementTypeDescription
} from '../../../../../../root-store/reports-store/reports.models';
import { SharedModule } from '../../../../../../shared/shared.module';
import { BottomSheetPanelBodyDirective } from '../../../../components/bottom-sheet-panel/bottom-sheet-panel-body.directive';
import { BottomSheetPanelFooterDirective } from '../../../../components/bottom-sheet-panel/bottom-sheet-panel-footer.directive';
import { BottomSheetPanelHeaderToolsDirective } from '../../../../components/bottom-sheet-panel/bottom-sheet-panel-header-tools.directive';
import { BottomSheetPanelComponent } from '../../../../components/bottom-sheet-panel/bottom-sheet-panel.component';
import { CoreStoreSelectors } from './../../../../../../root-store';
import { AppState } from './../../../../../../root-store/state';

@Component({
  selector: 'app-add-scheduling-report-dialog',
  templateUrl: './add-scheduling-report-dialog.component.html',
  styleUrls: ['./add-scheduling-report-dialog.component.scss'],
  standalone: true,
  imports: [
    SharedModule,
    BottomSheetPanelComponent,
    BottomSheetPanelHeaderToolsDirective,
    BottomSheetPanelBodyDirective,
    BottomSheetPanelFooterDirective
  ]
})
export class AddSchedulingReportDialogComponent implements OnInit, OnDestroy {
  private $unsub = new Subject();

  form!: UntypedFormGroup;

  movementTypes = MovementTypeDescription as { [key: string]: string };
  movementTypesOptions = Object.keys(this.movementTypes).map((key, index) => {
    return {
      value: index + 1,
      label: this.movementTypes[key]
    };
  });

  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  equipmentsChips: EquipmentChip[] = [];
  showEquipments = false;

  constructor(
    private store$: Store<AppState>,
    private fb: UntypedFormBuilder,
    private bottomSheetRef: MatBottomSheetRef<AddSchedulingReportDialogComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: {}
  ) {}

  ngOnInit() {
    this.store$
      .pipe(select(CoreStoreSelectors.selectOverscrolling), takeUntil(this.$unsub))
      .subscribe((overscrolling) => {
        if (overscrolling) {
          this.onCancel();
        }
      });

    this.form = this.fb.group({
      range: this.fb.group(
        {
          start: [null, Validators.required],
          end: [null, Validators.required]
        },
        { validators: this.movementRangeValidator() }
      ),
      movementType: [1, Validators.required]
    });

    this.form
      .get('movementType')!
      .valueChanges.pipe(takeUntil(this.$unsub))
      .subscribe((movementType) => {
        this.form.get('range')!.updateValueAndValidity();
        this.showEquipments = movementType === 3;
      });
  }

  ngOnDestroy(): void {
    this.$unsub.next(false);
    this.$unsub.complete();
  }

  onCancel() {
    this.bottomSheetRef.dismiss();
  }

  onSend() {
    if (this.form.invalid) {
      return;
    }

    const form = this.form.getRawValue() as {
      range: { start: Moment; end: Moment };
      movementType: MovementType;
      equipments: EquipmentChip[];
    };
    const { range, movementType } = form;
    const { start, end } = range;

    let equipments: string[] = [];
    if (!!this.equipmentsChips && (this.equipmentsChips || []).length) {
      equipments = this.equipmentsChips.map((c) => c.name);
    }

    this.bottomSheetRef.dismiss({
      range: {
        start: start.toDate().date(),
        end: end.toDate().date().addDays(1).addSeconds(-1)
      },
      movementType,
      equipments
    });
  }

  private readonly movementRangeLimits: Record<MovementType, number> = {
    [MovementType.Sales]: 90,
    [MovementType.Receivables]: 90,
    [MovementType.AllCards]: 30
  };

  private movementRangeValidator() {
    return (group: AbstractControl) => {
      const start = group.get('start')?.value;
      const end = group.get('end')?.value;

      if (!start || !end) {
        return null;
      }

      const parent = group.parent;
      if (!parent) {
        return null;
      }

      const movementType = parent.get('movementType')?.value as MovementType;

      const maxDays = this.movementRangeLimits[movementType];

      if (!maxDays) {
        return null;
      }

      const startDate = new Date(start);
      const endDate = new Date(end);

      const diffInDays = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);

      return diffInDays > maxDays
        ? {
            maxRangeExceeded: {
              maxDays,
              selectedDays: Math.ceil(diffInDays)
            }
          }
        : null;
    };
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our equipment
    if (value) {
      this.equipmentsChips.push({ name: value });
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  remove(equipment: EquipmentChip): void {
    const index = this.equipmentsChips.indexOf(equipment);

    if (index >= 0) {
      this.equipmentsChips.splice(index, 1);
    }
  }

  edit(equipment: EquipmentChip, event: MatChipEditedEvent) {
    const value = event.value.trim();

    // Remove equipment if it no longer has a name
    if (!value) {
      this.remove(equipment);
      return;
    }

    // Edit existing fruit
    const index = this.equipmentsChips.indexOf(equipment);
    if (index >= 0) {
      this.equipmentsChips[index].name = value;
    }
  }
}
