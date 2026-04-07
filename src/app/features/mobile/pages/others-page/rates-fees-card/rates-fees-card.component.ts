import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { Router } from '@angular/router';

@Component({
  selector: 'app-others-rates-fees-card',
  standalone: true,
  templateUrl: './rates-fees-card.component.html',
  styleUrls: ['./rates-fees-card.component.scss'],
  imports: [
    SharedModule
  ],
})
export class RatesFeesCardComponent implements OnInit {

  constructor(
    protected bottomSheet: MatBottomSheet,
    private router: Router,
    public dialog: MatDialog) {
  }

  ngOnInit() {
  }

  async goToRatesFees() {
    await this.router.navigate(['/rates-fees/mobile']);
  }
}