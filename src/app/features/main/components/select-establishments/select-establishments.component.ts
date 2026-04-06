import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { SelectOption } from 'src/app/shared/models/select-options';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-select-establishments',
  templateUrl: './select-establishments.component.html',
  styleUrls: ['./select-establishments.component.scss'],
  standalone: true,
  imports: [
    SharedModule
  ],
})
export class SelectEstablishmentsComponent implements OnInit, OnDestroy {

  private $unsub = new Subject();
  @Input() establishments: SelectOption[] = [];
  @Input() selectedEstablishmentDocument: string ='';
  @Input() multiple: boolean = true;
  @Input() markFirst: boolean = false;
  @Output() selectedEstablishments = new EventEmitter<string[]>();

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.$unsub.next(false);
    this.$unsub.complete();
  }

  onEstablishmentChange(event: any) {

    if (!this.multiple) {
      this.selectedEstablishments.next(event.value);
    } else {
      this.selectedEstablishments.next((event as SelectOption[]).map(x => x.value));
    }
  }
}
