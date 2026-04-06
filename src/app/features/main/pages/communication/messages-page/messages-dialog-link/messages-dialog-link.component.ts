import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  QueryList,
  SimpleChanges,
  ViewChildren
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { debounceTime, startWith, takeUntil } from 'rxjs/operators';
import { CommunicationStoreActions, CommunicationStoreSelectors } from './../../../../../../root-store/communication-store';
import { MessageLink } from './../../../../../../root-store/communication-store/communication.models';
import { AppState } from './../../../../../../root-store/state';
import { SortableHeaderDirective } from './../../../../../../shared/components/table/sort/sortable-header.directive';
import { TableService } from './../../../../../../shared/components/table/table.service';
import { SharedModule } from './../../../../../../shared/shared.module';

@Component({
  selector: 'app-messages-dialog-link',
  templateUrl: './messages-dialog-link.component.html',
  styleUrls: ['./messages-dialog-link.component.scss'],
  standalone: true,
  imports: [SharedModule],
})
export class MessagesDialogLinkComponent implements OnInit, OnDestroy, OnChanges, AfterViewInit {

  private $unsub = new Subject();

  @Input() messageId!: number;

  linksMessages!: MessageLink[];
  filteredItens: MessageLink[] = [];
  filter = new FormControl('');

  pageStart: number = 0;
  pageEnd: number = 100;
  pageHeight: number = 30;
  pageBuffer: number = 100;

  @ViewChildren(SortableHeaderDirective)
  headers!: QueryList<SortableHeaderDirective>;

  constructor(
    public bsModalRef: BsModalRef,
    private tableService: TableService,
    private store$: Store<AppState>) {
  }

  ngOnInit(): void {
    this.filter.valueChanges
      .pipe(
        debounceTime(500),
        startWith('')
      )
      .subscribe((text: any) => {
        this.onSearch(text);
      });

    this.store$.dispatch(new CommunicationStoreActions.GetMessageRegistrationAction({ id: this.messageId }));
  }

  ngOnChanges(changes: SimpleChanges) {
    const itens: MessageLink[] = changes['linksMessages'].currentValue;
    this.filteredItens = [...itens];
  }

  onSearch(text: string) {
    if (!!this.headers) {
      this.headers.forEach(header => {
        header.direction = '';
      });
    }

    this.filteredItens = this.tableService.filter(text, this.linksMessages);
  }

  ngAfterViewInit(): void {

    this.store$.select(CommunicationStoreSelectors.selectMessageRegistration)
      .pipe(takeUntil(this.$unsub))
      .subscribe(mensagem => {

        if (!!mensagem && !!mensagem.links) {

          this.linksMessages = mensagem.links;

          this.filteredItens = [...this.linksMessages];
        }
      });
  }

  ngOnDestroy(): void {
    this.$unsub.next(false);
    this.$unsub.complete();
  }

  onCancelarClick(): void {
    this.bsModalRef.hide();
  }

  onScroll(event: any) {
    const scrollTop = event.target.scrollTop;
    const scrollHeight = event.target.scrollHeight;
    const offsetHeight = event.target.offsetHeight;
    const scrollPosition = scrollTop + offsetHeight;
    const scrollTreshold = scrollHeight - this.pageHeight;
    if (scrollPosition > scrollTreshold) {
      this.pageEnd += this.pageBuffer;
    }
  }

  onSort({ column, direction }: any) {
    this.filteredItens = this.tableService.sort({ column, direction }, this.headers, this.filteredItens);
  }
}
