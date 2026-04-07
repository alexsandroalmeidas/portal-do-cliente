import { SharedModule } from '@/shared/shared.module';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CheckMarkedComponent } from './../../../../../../../main/components/check-marked/check-marked.component';

@Component({
  selector: 'app-prepayments-scheduled-card',
  standalone: true,
  templateUrl: './scheduled-card.component.html',
  styleUrls: ['./scheduled-card.component.scss'],
  imports: [
    SharedModule,
    CheckMarkedComponent
  ]
})
export class PrepaymentScheduledCardComponent implements OnInit {

  @Input() hasSelectedEstablishment: boolean = false;
  @Input() documentNumberSelected: string = '';
  @Input() scheduledRate = 0;
  @Input() finalized = true;
  @Output() activate = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Output() edit = new EventEmitter();

  constructor(
    protected bottomSheet: MatBottomSheet,
    private router: Router,
    public dialog: MatDialog) {
  }

  ngOnInit() {
  }

  onActivateClick() {
    this.activate.next(true);
  }

  onCancelClick() {
    this.cancel.next(true);
  }

  onEditClick() {
    this.edit.next(true);
  }
}
