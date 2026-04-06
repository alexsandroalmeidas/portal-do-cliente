import { PortalModule } from '@angular/cdk/portal';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CdkTableModule } from '@angular/cdk/table';
import { CommonModule, DecimalPipe, registerLocaleData } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import ptBr from '@angular/common/locales/pt';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter,
} from '@angular/material-moment-adapter';
import { MatBadgeModule } from '@angular/material/badge';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import {
  DateAdapter,
  MatDateFormats,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import {
  DefaultMatCalendarRangeStrategy,
  MatDatepickerModule,
  MAT_DATE_RANGE_SELECTION_STRATEGY,
} from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { CalendarModule } from 'angular-calendar';
import { TableVirtualScrollModule } from 'ng-table-virtual-scroll';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { BsDatepickerModule, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ptBrLocale } from 'ngx-bootstrap/locale';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { QuillModule } from 'ngx-quill';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { ToastrModule } from 'ngx-toastr';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import Quill from 'quill';
import ImageResize from 'quill-image-resize-module';
import { BannerCarouselComponent } from './components/banner-carousel/banner-carousel.component';
import { CodeInputComponent } from './components/code-input/code-input.component';
import { CodeInputComponentConfigToken } from './components/code-input/code-input.component.config';
import { DateFilterComponent } from './components/date-filter/date-filter.component';
import { EstablishmentsNotFoundComponent } from './components/establishments-not-found/establishments-not-found.component';
import { InlineFilterComponent } from './components/inline-filter/inline-filter.component';
import { NoResultFoundComponent } from './components/no-result-found/no-result-found.component';
import {
  CustomPeriodSelectorDialogComponent,
  PeriodFilterComponent,
} from './components/period-filter';
import { SelectFilterComponent } from './components/select-filter/select-filter.component';
import { SortableHeaderDirective } from './components/table';
import { TableService } from './components/table/table.service';
import { ViewByFilterComponent } from './components/view-by-filter';
import { UppercaseInputDirective } from './directives/uppercase-input.directive';
import { AuthorizedGuard } from './guards/authorized.guard';
import { UnauthorizedGuard } from './guards/unauthorized.guard';
import { ClientIpInterceptor } from './interceptors/client-ip-interceptor';
import { HttpAuthInterceptor } from './interceptors/http-auth.interceptor';
import { HttpLoadingInterceptor } from './interceptors/http-loading.interceptor';
import { HttpTokenInterceptor } from './interceptors/http-token.interceptor';
import { DateRangePipe } from './pipes/date-range.pipe';
import { DisplayLimitPipe } from './pipes/display-limit.pipe';
import { FloatPipe } from './pipes/float.pipe';
import { HiddenValuePipe } from './pipes/hidden-value.pipe';
import { ReferenceDayPipe } from './pipes/reference-day.pipe';
import { SufixPipe } from './pipes/sufix.pipe';
import { CookieService } from './services/cookie.service';
import { LocalStorageService } from './services/local-storage.service';
import { LoggingService } from './services/logging.service';
import { NotificationService } from './services/notification.service';
import { ScriptService } from './services/script-service';
import { SessionStorageService } from './services/session-storage.service';
import { TitleService } from './services/title.service';
import { UiService } from './services/ui-service';
import { CustomNgxUiLoaderModule } from '../ngx-ui-loader.module';

Quill.register('modules/imageResize', ImageResize);

registerLocaleData(ptBr, 'pt');
defineLocale('pt-br', ptBrLocale);

const { parse, display } = MAT_MOMENT_DATE_FORMATS;

const MomentFormats: MatDateFormats = {
  parse: {
    ...parse,
    dateInput: 'L',
  },
  display: {
    ...display,
    dateInput: 'L',
  },
};

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    TranslateModule,
    RouterModule,

    NgxUiLoaderModule,
    NgxMaskDirective,
    NgxMaskPipe,
    NgSelectModule,

    ButtonsModule.forRoot(),
    CarouselModule.forRoot(),
    CollapseModule.forRoot(),
    BsDropdownModule.forRoot(),
    BsDatepickerModule.forRoot(),
    ModalModule.forRoot(),
    PaginationModule.forRoot(),
    TabsModule.forRoot(),
    AccordionModule.forRoot(),
    ProgressbarModule.forRoot(),

    QuillModule.forRoot({
      modules: {
        syntax: false,
        imageResize: {},
      },
    }),

    // Angular CDK Modules
    CdkTableModule,

    // Angular Material Modules
    MatBottomSheetModule,
    MatListModule,
    MatTableModule,
    MatSortModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatBadgeModule,
    MatChipsModule,
    MatSidenavModule,
    MatToolbarModule,
    MatTooltipModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    MatButtonToggleModule,
    MatRadioModule,
    MatProgressBarModule,
    MatDialogModule,
    ScrollingModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    MatStepperModule,
    MatMenuModule,

    PortalModule,

    PopoverModule.forRoot(),

    // 3rd party modules
    TableVirtualScrollModule,
    NgScrollbarModule,
    CalendarModule,

    ToastrModule.forRoot({
      ///https://ngx-toastr.vercel.app/
      positionClass: 'toast-top-center',
      preventDuplicates: true,
      enableHtml: true,
      disableTimeOut: true,
      closeButton: true,
    }),
  ],
  declarations: [
    // Project components
    InlineFilterComponent,
    SelectFilterComponent,
    PeriodFilterComponent,
    DateFilterComponent,
    ViewByFilterComponent,
    CustomPeriodSelectorDialogComponent,
    EstablishmentsNotFoundComponent,
    NoResultFoundComponent,
    BannerCarouselComponent,

    // Project directives
    UppercaseInputDirective,
    SortableHeaderDirective,

    // Project pipes
    DateRangePipe,
    SufixPipe,
    HiddenValuePipe,
    DisplayLimitPipe,
    FloatPipe,
    ReferenceDayPipe,

    // Angular Code Input
    CodeInputComponent,
  ],
  exports: [
    // Angular Modules
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,

    // 3rd Party Modules
    TranslateModule,

    NgxUiLoaderModule,
    NgxMaskDirective,
    NgxMaskPipe,
    NgSelectModule,

    // Bootstrap Modules
    ButtonsModule,
    CarouselModule,
    CollapseModule,
    BsDropdownModule,
    BsDatepickerModule,
    PaginationModule,
    TabsModule,
    AccordionModule,
    ProgressbarModule,

    // Angular CDK Modules
    CdkTableModule,

    // Angular Material Modules
    MatBottomSheetModule,
    MatListModule,
    MatTableModule,
    MatSortModule,
    MatCardModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    MatBadgeModule,
    MatChipsModule,
    MatSidenavModule,
    MatToolbarModule,
    MatTooltipModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    MatButtonToggleModule,
    MatRadioModule,
    MatProgressBarModule,
    MatDialogModule,
    ScrollingModule,
    TableVirtualScrollModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    MatStepperModule,
    PortalModule,
    MatMenuModule,
    PopoverModule,

    CalendarModule,
    ToastrModule,
    QuillModule,
    NgScrollbarModule,

    // Project components
    InlineFilterComponent,
    SelectFilterComponent,
    PeriodFilterComponent,
    DateFilterComponent,
    ViewByFilterComponent,
    EstablishmentsNotFoundComponent,
    NoResultFoundComponent,
    BannerCarouselComponent,

    // Project directives
    UppercaseInputDirective,
    SortableHeaderDirective,

    // Project pipes
    DateRangePipe,
    SufixPipe,
    HiddenValuePipe,
    DisplayLimitPipe,
    FloatPipe,
    ReferenceDayPipe,

    // Angular Code Input
    CodeInputComponent,
  ],
  providers: [
    provideNgxMask(),
    AuthorizedGuard,
    NotificationService,
    CookieService,
    SessionStorageService,
    LocalStorageService,
    UnauthorizedGuard,
    UiService,
    TitleService,
    HttpAuthInterceptor,
    ClientIpInterceptor,
    HttpTokenInterceptor,
    HttpLoadingInterceptor,
    TableService,
    BsLocaleService,
    JwtHelperService,
    LoggingService,
    ScriptService,
    DecimalPipe,
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: false } },
    { provide: MAT_DATE_FORMATS, useValue: MomentFormats },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    {
      provide: MAT_DATE_RANGE_SELECTION_STRATEGY,
      useClass: DefaultMatCalendarRangeStrategy,
    },
    { provide: CodeInputComponentConfigToken, useValue: {} },
  ],
})
export class SharedModule {}
