import { IdentityStoreActions, IdentityStoreSelectors } from '@/root-store/identity-store';
import { Role } from '@/root-store/identity-store/identity.models';
import { Component, Input, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { debounceTime, startWith, takeUntil } from 'rxjs/operators';
import { NavigationService } from 'src/app/shared/services/navigation.service';
import { BasePage } from '../../base.page';
import { AppState } from './../../../../../root-store/state';
import { SortableHeaderDirective } from './../../../../../shared/components/table/sort/sortable-header.directive';
import { TableService } from './../../../../../shared/components/table/table.service';
import { TablePagination } from './../../../../../shared/models/table.model';
import { SharedModule } from './../../../../../shared/shared.module';

@Component({
  templateUrl: './access-link-page.component.html',
  styleUrls: ['./access-link-page.component.scss'],
  standalone: true,
  imports: [SharedModule]
})
export class AccessLinkPageComponent extends BasePage implements OnInit, OnDestroy {

  private $destroy = new Subject<void>();

  @Input() roles!: Role[];
  @ViewChildren(SortableHeaderDirective) headers!: QueryList<SortableHeaderDirective>;

  tablePage = 1;
  itemsPerPage = 10;
  dataSource: Role[] = [];
  filteredItens: Role[] = [];
  filter = new FormControl('');

  columnsToDisplay = [
    'name',
    'description',
    'actions'
  ];

  constructor(
    private tableService: TableService,
    store$: Store<AppState>,
    navigationService: NavigationService) {
    super(store$, navigationService);
  }

  ngOnInit() {
    this.filter.valueChanges
      .pipe(
        debounceTime(500),
        startWith('')
      )
      .subscribe((text: any) => {
        this.onSearch(text);
      });

    this.store$
      .select(IdentityStoreSelectors.selectRoles)
      .pipe(takeUntil(this.$destroy))
      .subscribe(roles => {
        this.roles = roles;

        this.filteredItens = [...this.roles];
        this.onPaginate({ page: 1, itemsPerPage: this.itemsPerPage });
      });

    this.store$.dispatch(new IdentityStoreActions.ListClientRolesAction());
  }

  onPaginate(tablePagination: TablePagination): void {
    this.tablePage = tablePagination.page;
    this.dataSource = this.tableService.paginate(tablePagination, this.filteredItens);
  }

  onSort({ column, direction }: any) {
    this.filteredItens = this.tableService.sort({ column, direction }, this.headers, this.filteredItens);
    this.onPaginate({ page: 1, itemsPerPage: this.itemsPerPage });
  }

  onSearch(text: string) {
    if (!!this.headers) {
      this.headers.forEach(header => {
        header.direction = '';
      });
    }

    this.filteredItens = this.tableService.filter(text, this.roles);
    this.onPaginate({ page: 1, itemsPerPage: this.itemsPerPage });
  }

  onEdit(role: Role) {
  }

}
