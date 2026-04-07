import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CheckMarkedComponent } from 'src/app/features/main/components/check-marked/check-marked.component';
import { PrepaymentsUnAvailableCardComponent } from 'src/app/features/mobile/components/prepayments-unavailable-card/prepayments-unavailable-card.component';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-prepayments-punctual-card',
  standalone: true,
  templateUrl: './punctual-card.component.html',
  styleUrls: ['./punctual-card.component.scss'],
  imports: [
    SharedModule,
    PrepaymentsUnAvailableCardComponent,
    CheckMarkedComponent
  ]
})
export class PrepaymentPunctualCardComponent implements OnInit {

  @Input() available: boolean = true;
  @Input() hasSelectedEstablishment: boolean = false;
  @Input() documentNumberSelected: string = '';
  @Input() rate: number = 0;
  @Input() prepaymentEstablishmentsSelected: string = null as any;
  @Input() punctualRate = 0;
  @Input() finalized = false;
  @Input() prepaymentsAvailable = false;
  @Output() requestClick = new EventEmitter<boolean>();

  constructor(
    protected bottomSheet: MatBottomSheet,
    private router: Router,
    public dialog: MatDialog) {
  }

  ngOnInit() {
  }

  async goToRequest() {
    await this.router.navigate(
      ['/prepayments/mobile/punctual'],
      {
        queryParams: {
          uid: this.documentNumberSelected
        }
      });
  }

  async onRequestClick() {
    this.requestClick.emit(true);
  }
}
