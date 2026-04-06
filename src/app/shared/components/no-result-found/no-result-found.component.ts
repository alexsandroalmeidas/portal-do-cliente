import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-no-result-found',
  templateUrl: './no-result-found.component.html',
  styleUrls: ['./no-result-found.component.scss']
})
export class NoResultFoundComponent implements OnInit {

  @Input()
  withCard = true;

  @Input()
  customMessage!: string;

  noResultFound!: string;

  constructor() {
  }

  ngOnInit() {
    this.noResultFound = (!!this.customMessage ? this.customMessage : 'Não foi encontrado nenhum resultado.');
  }

}
