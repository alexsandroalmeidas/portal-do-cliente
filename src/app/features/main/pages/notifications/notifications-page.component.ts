import { CommunicationService } from '@/root-store/communication-store/communication.service';
import { AfterViewInit, Component, OnChanges, OnDestroy, OnInit, QueryList, SimpleChanges, ViewChildren } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { isEmpty } from 'lodash';
import { distinctUntilChanged, forkJoin, map, takeUntil } from 'rxjs';
import { AdministrationStoreSelectors } from 'src/app/root-store/administration-store';
import { CommunicationStoreActions, CommunicationStoreSelectors } from 'src/app/root-store/communication-store';
import { Banner, Notification } from 'src/app/root-store/communication-store/communication.models';
import { AppState } from 'src/app/root-store/state';
import { Slide } from 'src/app/shared/components/banner-carousel/slide';
import { FilterSelection as PeriodFilterSelection } from 'src/app/shared/components/period-filter';
import { SortableHeaderDirective, SortEvent, TableService } from 'src/app/shared/components/table';
import { SelectOption } from 'src/app/shared/models/select-options';
import { TablePagination } from 'src/app/shared/models/table.model';
import { NavigationService } from 'src/app/shared/services/navigation.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { SelectEstablishmentsComponent } from '../../components/select-establishments/select-establishments.component';
import { BasePage } from '../base.page';
import { NotificationsViewPageComponent } from './notifications-view/notifications-view-page.component';

@Component({
  templateUrl: './notifications-page.component.html',
  styleUrls: ['./notifications-page.component.scss'],
  standalone: true,
  imports: [
    SharedModule,
    SelectEstablishmentsComponent,
    NotificationsViewPageComponent
  ],
})
export class NotificationsPageComponent extends BasePage implements OnInit, OnDestroy, OnChanges, AfterViewInit {

  notificationsEstablishments: string[] = [];
  establishmentsSelected: string = null as any;
  establishmentsToSelect: SelectOption[] = [];
  slides: Slide[] = [];
  id = 0;
  notificationView: Notification = null as any;
  notifications!: Notification[];
  safeHtml!: SafeHtml;

  filteredItems: Notification[] = [];
  dataSource: Notification[] = [];
  columnsToDisplay = [
    'createdDate',
    'title',
    'actions'
  ];
  tablePage = 1;
  itemsPerPage = 10;
  maxSize = 5;
  page?: number;
  periodInitialValue!: PeriodFilterSelection;
  periodFilter = null as any;
  customInitialDate!: string;
  customFinalDate!: string;

  get getId() {
    return this.id;
  }

  get isView() {
    return this.getId > 0;
  }

  @ViewChildren(SortableHeaderDirective) headers!: QueryList<SortableHeaderDirective>;

  constructor(
    store$: Store<AppState>,
    navigationService: NavigationService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    protected router: Router,
    private tableService: TableService,
    private notificationService: NotificationService,
    private communicationService: CommunicationService,
    private sanitizer: DomSanitizer) {

    super(store$, navigationService);
  }

  ngOnInit() {

    this.subscribeActiveBanners();
    this.subscribeEstablishmentsToSelect();
    this.subscribeNotification();
    this.subscribeNotifications();
    this.subscribeNotificationDeleted();

    this.route.queryParamMap.pipe(map((paramMap: ParamMap) => {
      return paramMap.get('id');
    }), distinctUntilChanged()).subscribe((val: any) => {

      this.id = val;

      if (!!val) {
        this.selectGetNotification();
        this.store$.dispatch(new CommunicationStoreActions.MarkNotificationReadAction({ id: this.id }));
        this.store$.dispatch(new CommunicationStoreActions.ListNotificationsAction());
      }
    });
  }

  ngAfterViewInit(): void {
    this.verifyEstablishmentSelected();
    this.selectListNotifications();
  }

  ngOnChanges(changes: SimpleChanges) {

    const itens: string = changes['notifications'].currentValue;

    this.subscribeNotifications();
  }

  async onSelectedEstablishmentsClick(event: any) {
    this.establishmentsSelected = event;
    this.filterItems();
  }

  private filterItems() {

    if (!!this.notifications) {
      const selectedEstablishment = this.selectedEstablishments.filter(x => x.uid == this.establishmentsSelected)[0];
      this.filteredItems = [...this.notifications.filter(p => selectedEstablishment.documentNumber === p.documentNumber)];
      this.onPaginate({ page: 1, itemsPerPage: this.itemsPerPage });
    } else {
      this.filteredItems = [];
    }
  }

  protected override onChangeSelectedEstablishments(): void {
    this.verifyEstablishmentSelected();
    this.selectListNotifications();
  }

  private verifyEstablishmentSelected() {
    if (!this.establishmentsSelected) {
      this.establishmentsSelected = this.selectedEstablishmentsUids.firstOrDefault(x => !!x);
    } else {

      if (!isEmpty(this.selectedEstablishmentsUids) && this.selectedEstablishmentsUids.length === 1) {
        const firstEstablishment: string = this.selectedEstablishmentsUids.firstOrDefault(x => !!x);

        if (firstEstablishment !== this.establishmentsSelected) {
          this.establishmentsSelected = firstEstablishment;
        }
      }
    }

    this.filterItems();
  }

  private subscribeActiveBanners() {
    this.store$
      .select(CommunicationStoreSelectors.selectActiveBanners)
      .pipe(takeUntil(this.$unsub))
      .subscribe((banners: Banner[]) => {
        const bannerRequests = (banners || [])
          .filter((x: Banner) => !!x.portalImage)
          .map((banner: Banner) =>
            this.communicationService.getBannerImage(banner?.portalImage?.fileName ?? '')
              .pipe(
                map((blob: Blob) => {
                  const objectUrl = URL.createObjectURL(blob);
                  return {
                    url: banner.url,
                    id: banner.id,
                    image: this.sanitizer.bypassSecurityTrustUrl(objectUrl),
                    backgroundColor: banner.backgroundColor,
                  };
                })
              )
          );

        // Aguarda todas as requisições serem concluídas antes de atualizar `this.slides`
        forkJoin(bannerRequests)
          .pipe(takeUntil(this.$unsub))
          .subscribe((slides: any) => {
            this.slides = slides;
          });
      });
  }

  private subscribeEstablishmentsToSelect() {
    this.store$
      .select(AdministrationStoreSelectors.selectSelectedEstablishments)
      .pipe(takeUntil(this.$unsub))
      .subscribe(establishments => {
        if (!!establishments) {
          this.establishmentsToSelect = [...establishments
            .map(establishment => new SelectOption(`${establishment.documentNumber} - ${establishment.companyName}`, establishment.uid))];
        }
      });
  }

  private selectGetNotification() {
    this.store$.dispatch(new CommunicationStoreActions.GetNotificationAction({ id: this.getId }));
  }

  private selectListNotifications() {
    this.store$.dispatch(new CommunicationStoreActions.ListNotificationsAction());
  }

  private subscribeNotification() {
    this.store$
      .select(CommunicationStoreSelectors.selectNotification)
      .pipe(takeUntil(this.$unsub))
      .subscribe((notification: Notification) => {
        this.notificationView = notification;
      });
  }

  private subscribeNotificationDeleted() {

    this.store$
      .select(CommunicationStoreSelectors.selectNotificationDeleted)
      .pipe(takeUntil(this.$unsub))
      .subscribe((notificationDeleted: boolean) => {
        if (notificationDeleted) {
          this.notificationService.showSuccess('Notificação excluída com sucesso!');
        }
      });
  }

  private subscribeNotifications() {
    this.store$
      .select(CommunicationStoreSelectors.selectNotifications)
      .pipe(takeUntil(this.$unsub))
      .subscribe((notification: Notification[]) => {
        this.notifications = notification;
        this.filteredItems = [...this.notifications];
        this.onPaginate({ page: 1, itemsPerPage: this.itemsPerPage });
      });
  }

  onPaginate(tablePagination: TablePagination): void {
    this.tablePage = tablePagination.page;
    this.dataSource = this.tableService.paginate(tablePagination, this.filteredItems);
  }

  onSort({ column, direction }: SortEvent) {
    this.filteredItems = this.tableService.sort({ column, direction }, this.headers, this.filteredItems);
    this.onPaginate({ page: 1, itemsPerPage: this.itemsPerPage });
  }

  onPeriodChange(period: any) {
    if (!!period) {
      this.periodFilter = period;
      this.selectListNotifications();
    }
  }

  async onViewClick(id: number) {
    this.id = id;
    await this.router.navigate(
      ['/notifications'],
      {
        queryParams: {
          id: id,
        }
      });
  }

  async onDelete(notification: any) {
    this.store$.dispatch(new CommunicationStoreActions.DeleteNotificationAction({ id: notification.id, documentNumber: this.establishmentsSelected }));
    this.selectListNotifications();
  }

  async goToReports() {
    await this.router.navigate(['/reports']);
  }
}