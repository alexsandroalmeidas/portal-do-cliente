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
  ViewChildren,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import moment from 'moment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { debounceTime, startWith } from 'rxjs/operators';
import { CommunicationStoreActions } from './../../../../../../root-store/communication-store';
import { Banner } from './../../../../../../root-store/communication-store/communication.models';
import { AppState } from './../../../../../../root-store/state';
import {
  SortableHeaderDirective,
  TableService,
} from './../../../../../../shared/components/table';
import { TablePagination } from './../../../../../../shared/models/table.model';
import { SharedModule } from './../../../../../../shared/shared.module';

@Component({
  selector: 'app-banners-list',
  templateUrl: './banners-list.component.html',
  styleUrls: ['./banners-list.component.scss'],
  standalone: true,
  imports: [SharedModule],
})
export class BannersListComponent implements OnInit, OnDestroy, OnChanges {
  private $unsub = new Subject();

  tablePage = 1;
  itemsPerPage = 10;
  dataSource: Banner[] = [];
  filteredItems: Banner[] = [];
  filter = new FormControl('');
  bannerToDeleteTitle!: string;
  bannerToDeleteId!: string;

  onClose!: Subject<any>;
  bsModalRef!: BsModalRef;
  safeHtml!: SafeHtml;

  columnsToDisplay = ['createdDate', 'initialDate', 'finalDate', 'action'];

  @Input() items!: Banner[];
  @Output() editBanner = new EventEmitter<Banner>();

  @ViewChildren(SortableHeaderDirective)
  headers!: QueryList<SortableHeaderDirective>;

  constructor(
    private tableService: TableService,
    private store$: Store<AppState>,
    private modalService: BsModalService,
    private sanitizer: DomSanitizer,
  ) {}

  ngOnInit(): void {
    this.onClose = new Subject<any>();

    this.filter.valueChanges
      .pipe(debounceTime(500), startWith(''))
      .subscribe((text: any) => {
        this.onSearch(text);
      });
  }

  ngOnDestroy(): void {
    this.$unsub.next(false);
    this.$unsub.complete();
  }

  ngOnChanges(changes: SimpleChanges) {
    const items: Banner[] = changes['items']?.currentValue ?? [];

    this.filteredItems = [...items];
    this.onPaginate({
      page: 1,
      itemsPerPage: this.itemsPerPage,
    } as TablePagination);
  }

  onPaginate(tablePagination: TablePagination): void {
    this.tablePage = tablePagination.page;
    this.dataSource = this.tableService.paginate(
      tablePagination,
      this.filteredItems,
    );
  }

  onSort({ column, direction }: any) {
    this.filteredItems = this.tableService.sort(
      { column, direction },
      this.headers,
      this.filteredItems,
    );
    this.onPaginate({
      page: 1,
      itemsPerPage: this.itemsPerPage,
    } as TablePagination);
  }

  onSearch(text: string) {
    if (!!this.headers) {
      this.headers.forEach((header) => {
        header.direction = '';
      });
    }

    this.filteredItems = this.tableService.filter(text, this.items);
    this.onPaginate({
      page: 1,
      itemsPerPage: this.itemsPerPage,
    } as TablePagination);
  }

  onEdit(banner: Banner) {
    this.editBanner.emit(banner);
  }

  onDeleteModal(templateDelete: TemplateRef<any>, row: any) {
    this.bannerToDeleteTitle = row.title;
    this.bannerToDeleteId = row.id;

    this.bsModalRef = this.modalService.show(templateDelete, {
      class: 'modal-dialog modal-md',
    });
  }

  onDelete() {
    const result = { id: this.bannerToDeleteId };

    this.onClose.next(result);
    this.store$.dispatch(
      new CommunicationStoreActions.DeleteBannerRegistrationAction({
        id: result.id,
      }),
    );
    this.bsModalRef.hide();
  }

  byPassTitle(title: any) {
    if (!!title) {
      this.safeHtml = this.sanitizer.bypassSecurityTrustHtml(title);
    }

    return this.safeHtml;
  }

  verifyFinalDate(finalDate: Date) {
    if (finalDate !== null) {
      return moment(finalDate).diff(moment(), 'days') < 0;
    }

    return false;
  }
}
