import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Slide } from './slide';

@Component({
  selector: 'app-banner-carousel',
  templateUrl: './banner-carousel.component.html',
  styleUrls: ['./banner-carousel.component.scss']
})
export class BannerCarouselComponent implements OnInit, OnDestroy {

  private $unsub = new Subject();

  @Input() showIndicators = false;
  @Input() noWrap = true;
  @Input() isMobile = false;
  @Input() slides: Slide[] = [];
  @Input() bkColor: string = "";
  @Input() klass: string = "";

  constructor() { }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    this.$unsub.next(false);
    this.$unsub.complete();
  }
}
