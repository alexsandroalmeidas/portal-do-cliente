import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { Store } from '@ngrx/store';
import { isEmpty } from 'lodash';
import { CarouselComponent } from 'ngx-bootstrap/carousel';
import { Subject } from 'rxjs';
import { TooltipComponent } from 'src/app/features/main/components/tooltip/tooltip.component';
import { BankingAccount } from './../../../../../../root-store/receivables-store/receivables.models';
import { AppState } from './../../../../../../root-store/state';
import { SharedModule } from './../../../../../../shared/shared.module';

@Component({
  selector: 'app-banking-accounts-carousel',
  templateUrl: './banking-accounts-carousel.html',
  styleUrls: ['./banking-accounts-carousel.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
  standalone: true,
  imports: [SharedModule, TooltipComponent]
})
export class BankingAccountsCarouselComponent implements OnInit, OnDestroy, OnChanges {
  @ViewChild(CarouselComponent) myCarousel!: CarouselComponent;

  private $unsub = new Subject();

  cards: {
    bank: number;
    agency: number;
    account: string;
    amount: number;
    isPix: boolean;
    originPix: string;
  }[] = [];
  slides: any = [[]];

  @Input() bankingAccounts: BankingAccount[] = [];
  @Input() selectedEstablishment!: string;

  activeSlideIndex = 0;
  itemsPerSlide = 2;
  singleSlideOffset = false;
  noWrap = false;
  showIndicators = false;

  get showCarousel() {
    return !isEmpty(this.cards);
  }

  constructor(private store$: Store<AppState>, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.cards = [];
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.cards = [];

    let bankingAccounts = Array.from<BankingAccount>(
      changes['bankingAccounts']?.currentValue ?? []
    );

    bankingAccounts?.forEach((x) => this.cards.push(x));

    this.slides = this.chunk(this.cards, 2);

    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
    this.$unsub.next(false);
    this.$unsub.complete();
  }

  identify(index: any, item: any) {
    return `${item.account}${item.agency}${item.bank}`;
  }

  carouselItemActive(index: number) {
    return index === 0 || index === 1 ? 'active' : '';
  }

  chunk(arr: any, chunkSize: any) {
    let arrReturn = [];

    for (let i = 0, len = arr.length; i < len; i += chunkSize) {
      arrReturn.push(arr.slice(i, i + chunkSize));
    }

    return arrReturn;
  }
}
