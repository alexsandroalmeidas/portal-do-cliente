import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { Router } from '@angular/router';

@Component({
  selector: 'app-others-statements-card',
  standalone: true,
  templateUrl: './statements-card.component.html',
  styleUrls: ['./statements-card.component.scss'],
  imports: [
    SharedModule
  ],
})
export class StatementsCardComponent implements OnInit {

  constructor(
    protected bottomSheet: MatBottomSheet,
    private router: Router,
    public dialog: MatDialog) {
  }

  ngOnInit() {
  }

  async goToStatements() {
    await this.router.navigate(['/statements/mobile']);
  }
}