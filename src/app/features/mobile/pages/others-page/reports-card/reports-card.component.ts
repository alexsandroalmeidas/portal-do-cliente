import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { Router } from '@angular/router';

@Component({
  selector: 'app-others-reports-card',
  standalone: true,
  templateUrl: './reports-card.component.html',
  styleUrls: ['./reports-card.component.scss'],
  imports: [
    SharedModule
  ],
})
export class ReportsCardComponent implements OnInit {

  constructor(
    protected bottomSheet: MatBottomSheet,
    private router: Router,
    public dialog: MatDialog) {
  }

  ngOnInit() {
  }

  async goToReports() {
    await this.router.navigate(['/reports/mobile']);
  }
}