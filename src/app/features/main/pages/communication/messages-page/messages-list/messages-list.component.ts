import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  SimpleChanges,
  TemplateRef,
  ViewChildren
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { debounceTime, startWith } from 'rxjs/operators';
import { MessagesDialogLinkComponent } from '../messages-dialog-link/messages-dialog-link.component';
import { CommunicationStoreActions } from './../../../../../../root-store/communication-store';
import { Message } from './../../../../../../root-store/communication-store/communication.models';
import { AppState } from './../../../../../../root-store/state';
import { TableService } from './../../../../../../shared/components/table';
import { SortableHeaderDirective } from './../../../../../../shared/components/table/sort';
import { TablePagination } from './../../../../../../shared/models/table.model';
import { SharedModule } from './../../../../../../shared/shared.module';

@Component({
  selector: 'app-messages-list',
  templateUrl: './messages-list.component.html',
  styleUrls: ['./messages-list.component.scss'],
  standalone: true,
  imports: [SharedModule],
})
export class MessagesListComponent implements OnInit, OnDestroy, OnChanges {

  private $unsub = new Subject();

  tablePage = 1;
  itemsPerPage = 10;
  dataSource: Message[] = [];
  filteredItens: Message[] = [];
  filter = new FormControl('');
  onClose!: Subject<any>;
  messageToDeleteTitle!: string;
  messageToDeleteId!: string;

  bsModalRef!: BsModalRef;

  columnsToDisplay = [
    'createdDate',
    'title',
    'listLinkedCnpjs',
    'pushNotification',
    'status',
    'action'
  ];

  @Input() itens!: Message[];
  @ViewChildren(SortableHeaderDirective) headers!: QueryList<SortableHeaderDirective>;
  @Output() editMessage = new EventEmitter<Message>();

  constructor(
    private tableService: TableService,
    private store$: Store<AppState>,
    private modalService: BsModalService) { }

  ngOnInit(): void {

    this.onClose = new Subject<any>();

    this.filter.valueChanges
      .pipe(
        debounceTime(500),
        startWith('')
      )
      .subscribe((text: any): void => {
        this.onSearch(text);
      });
  }

  ngOnDestroy(): void {
    this.$unsub.next(false);
    this.$unsub.complete();
  }

  ngOnChanges(changes: SimpleChanges) {
    const itens: Message[] = changes['itens']?.currentValue ?? [];

    this.filteredItens = [...itens];
    this.onPaginate({ page: 1, itemsPerPage: this.itemsPerPage } as TablePagination);
  }

  onSort({ column, direction }: any) {
    this.filteredItens = this.tableService.sort({ column, direction }, this.headers, this.filteredItens);
    this.onPaginate({ page: 1, itemsPerPage: this.itemsPerPage } as TablePagination);
  }

  onPaginate(tablePagination: TablePagination): void {
    this.tablePage = tablePagination.page;
    this.dataSource = this.tableService.paginate(tablePagination, this.filteredItens);
  }

  onSearch(text: string) {
    if (!!this.headers) {
      this.headers.forEach(header => {
        header.direction = '';
      });
    }

    this.filteredItens = this.tableService.filter(text, this.itens);
    this.onPaginate({ page: 1, itemsPerPage: this.itemsPerPage } as TablePagination);
  }

  onNotify(id: string) {
    this.store$.dispatch(new CommunicationStoreActions.NotifyRegistrationMessageAction({ id }));
  }

  onVisualize(id: number) {

    const initialState = {
      messageId: id
    };

    this.bsModalRef = this.modalService.show(MessagesDialogLinkComponent, { class: 'modal-dialog modal-lg', initialState });
  }

  onEdit(message: Message) {
    this.editMessage.emit(message);
  }

  onDeleteModal(templateDelete: TemplateRef<any>, row: any) {

    this.messageToDeleteTitle = row.titulo;
    this.messageToDeleteId = row.id;

    this.bsModalRef = this.modalService.show(templateDelete, { class: 'modal-dialog modal-md' });
  }

  onDelete() {

    const result = { id: this.messageToDeleteId };

    this.onClose.next(result);
    this.store$.dispatch(new CommunicationStoreActions.DeleteMessageRegistrationAction({ id: result.id }));
    this.bsModalRef.hide();
  }
}
