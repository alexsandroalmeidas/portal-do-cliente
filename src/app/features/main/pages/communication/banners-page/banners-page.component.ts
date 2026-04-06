import { CommunicationService } from '@/root-store/communication-store/communication.service';
import { ViewportScroller } from '@angular/common';
import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Slide } from '../../../../../shared/components/banner-carousel/slide';
import { Establishment } from './../../../../../root-store/administration-store/administration.models';
import {
  CommunicationStoreActions,
  CommunicationStoreSelectors
} from './../../../../../root-store/communication-store';
import { Banner } from './../../../../../root-store/communication-store/communication.models';
import { AppState } from './../../../../../root-store/state';
import { FormValidators } from './../../../../../shared/extras/form-validators';
import { SelectOption } from './../../../../../shared/models/select-options';
import { NotificationService } from './../../../../../shared/services/notification.service';
import { SharedModule } from './../../../../../shared/shared.module';
import { BannersListComponent } from './banners-list/banners-list.component';

@Component({
  selector: 'app-banners-page',
  templateUrl: './banners-page.component.html',
  styleUrls: ['./banners-page.component.scss'],
  standalone: true,
  imports: [BannersListComponent, SharedModule]
})
export class BannersPageComponent implements OnInit, OnDestroy {
  private $unsub = new Subject();
  hasPortalImage = false;
  hasAppImage = false;
  form!: FormGroup;

  @ViewChild('bannerBackgroundColor', { static: false })
  bannerBackgroundColor!: ElementRef;

  customersOptions: SelectOption[] = [];
  establishments!: Establishment[];
  submitted = false;
  banners: Banner[] = [];
  banner: Banner = null as any;
  slides: Slide[] = [];
  bkColor = '#f1f1f1';
  minDate = new Date();

  progressInfosPortal: any[] = [];
  progressInfosApp: any[] = [];

  previewPortal?: any;
  previewApp?: any;

  portalFile?: File;
  portalFileType: string = '';
  portalFileName: string = '';

  appFile?: File;
  appFileType?: string;
  appFileName?: string;

  @Input()
  requiredFileType!: string;

  fileName = '';
  uploadProgress!: number;
  uploadSub!: Subscription;

  initialDateMax: Date = null as any;
  finalDateMin: Date = this.minDate;

  get formControls() {
    return this.form.controls;
  }

  constructor(
    private formBuilder: FormBuilder,
    private store$: Store<AppState>,
    private notificationService: NotificationService,
    bsLocaleService: BsLocaleService,
    private scroller: ViewportScroller,
    private communicationService: CommunicationService,
    private sanitizer: DomSanitizer
  ) {
    bsLocaleService.use('pt-br');
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      url: [null],
      initialDate: [null, [Validators.required]],
      finalDate: [null],
      bannerId: null,
      filesPortal: null,
      filesApp: null,
      backgroundColor: '#232851'
    });

    this.form.setValidators([
      FormValidators.dateIsGreatherThenOrEquals('initialDate', 'finalDate')
    ]);

    this.onCleanClick();

    this.subscribeBannerInclusionRegistration();
    this.subscribeBannerUpdateRegistration();
    this.subscribeBannerExclusionRegistration();
    this.subscribeBanners();
    this.subscribeBanner();
    this.selectListBannersRegistration();
  }

  private selectListBannersRegistration() {
    this.store$.dispatch(new CommunicationStoreActions.ListBannersRegistrationAction());
  }

  private subscribeBannerInclusionRegistration() {
    this.store$
      .select(CommunicationStoreSelectors.selectBannerInclusionRegistration)
      .pipe(takeUntil(this.$unsub))
      .subscribe((banner) => {
        if (!!banner && banner.id > 0) {
          this.notificationService.showSuccess('Banner salvo com sucesso!');
          this.store$.dispatch(new CommunicationStoreActions.AddedBannerSuccessAction());

          this.onCleanClick();

          this.store$.dispatch(new CommunicationStoreActions.ListBannersRegistrationAction());
        }
      });
  }

  private subscribeBannerUpdateRegistration() {
    this.store$
      .select(CommunicationStoreSelectors.selectBannerUpdateRegistration)
      .pipe(takeUntil(this.$unsub))
      .subscribe((banner) => {
        if (!!banner && banner.id > 0) {
          this.notificationService.showSuccess('Banner atualizado com sucesso!');
          this.store$.dispatch(new CommunicationStoreActions.AddedBannerSuccessAction());

          this.onCleanClick();

          this.store$.dispatch(new CommunicationStoreActions.ListBannersRegistrationAction());
        }
      });
  }

  private subscribeBannerExclusionRegistration() {
    this.store$
      .select(CommunicationStoreSelectors.selectBannerExclusionRegistration)
      .pipe(takeUntil(this.$unsub))
      .subscribe((banner) => {
        if (!!banner && banner.id > 0) {
          this.notificationService.showSuccess('Banner excluído com sucesso!');
          this.store$.dispatch(new CommunicationStoreActions.AddedBannerSuccessAction());
          this.store$.dispatch(new CommunicationStoreActions.ListBannersRegistrationAction());
        }
      });
  }

  private subscribeBanners() {
    this.store$
      .select(CommunicationStoreSelectors.selectBanners)
      .pipe(takeUntil(this.$unsub))
      .subscribe((banners) => {
        if (!!banners) {
          this.banners = banners;
        }
      });
  }

  private subscribeBanner() {
    this.store$
      .select(CommunicationStoreSelectors.selectBanner)
      .pipe(takeUntil(this.$unsub))
      .subscribe((banner) => {
        if (!!banner) {
          document.body.scrollTop = 0;
          document.documentElement.scrollTop = 0;

          this.banner = banner;

          if (!!banner.portalImage) {
            this.communicationService
              .getBannerImage(banner.portalImage.fileName)
              .subscribe((blob: Blob) => {
                const objectUrl = URL.createObjectURL(blob);
                this.previewPortal = this.sanitizer.bypassSecurityTrustUrl(objectUrl);
              });
          }

          if (!!banner.appImage) {
            this.communicationService
              .getBannerImage(banner.appImage.fileName)
              .subscribe((blob: Blob) => {
                const objectUrl = URL.createObjectURL(blob);
                this.previewApp = this.sanitizer.bypassSecurityTrustUrl(objectUrl);
              });
          }

          let initialDate = new Date(banner.initialDate);
          const today = new Date();

          if (initialDate.date() <= today.date()) {
            initialDate = today;
          }

          let finalDate = null;

          if (!!banner.finalDate) {
            const fnalDate = new Date(banner.finalDate);

            if (fnalDate.date() <= today.date()) {
              finalDate = today;
            } else {
              finalDate = fnalDate;
            }
          }

          this.form.patchValue({
            bannerId: banner.id,
            url: banner.url,
            initialDate: initialDate,
            finalDate: finalDate,
            backgroundColor: banner.backgroundColor
          });

          this.previewPortal = null;
          this.hasPortalImage = false;

          this.previewApp = null;
          this.hasAppImage = false;

          if (!!banner.portalImage) {
            this.hasPortalImage = true;
            this.portalFileType = banner.portalImage.contentType;
            this.portalFileName = banner.portalImage.fileName;
          }

          if (!!banner.appImage) {
            this.hasAppImage = true;
            this.appFileType = banner.appImage.contentType;
            this.appFileName = banner.appImage.fileName;
          }

          this.onViewClick();
        }
      });
  }

  ngOnDestroy(): void {
    this.$unsub.next(false);
    this.$unsub.complete();
  }

  async onViewClick() {
    FormValidators.checkFormValidations(this.form);

    if (!this.form.valid) {
      return;
    }

    const data = this.form.getRawValue();
    this.slides = [];

    if (!!this.previewPortal) {
      this.slides.push({
        image: this.previewPortal,
        url: !!data.url ? data.url : '',
        backgroundColor: data.backgroundColor
      } as Slide);

      this.bkColor = data.backgroundColor;
    }

    return;
  }

  async onSaveClick() {
    this.submitted = true;

    const data = this.form.getRawValue();

    FormValidators.checkFormValidations(this.form);

    if (!this.form.valid) {
      return;
    }

    if (!this.hasPortalImage && !this.hasAppImage) {
      return;
    }

    this.submitted = false;

    const initialDate = !!data.initialDate
      ? new Date(data.initialDate).date().format()
      : new Date().date().format();

    const finalDate = !!data.finalDate
      ? new Date(data.finalDate).date().addDays(1).addSeconds(-1).format()
      : data.finalDate;

    const banner = {
      id: data.bannerId,
      url: data.url,
      initialDate: initialDate,
      finalDate: finalDate,
      backgroundColor: data.backgroundColor,
      portalFileType: this.portalFileType || '',
      portalFileName: this.portalFileName || '',
      appFileType: this.appFileType || '',
      appFileName: this.appFileName || '',
      portalFile: this.portalFile,
      appFile: this.appFile
    };

    if (!!data.bannerId) {
      this.store$.dispatch(new CommunicationStoreActions.UpdateBannerAction(banner));
    } else {
      this.store$.dispatch(new CommunicationStoreActions.AddBannerAction(banner));
    }
  }

  onContentChanged(context: any) {
    if (context == null || context.html == null) {
      return;
    }
    if (context.html.length > 100) {
      let oldDelta = context['oldDelta'];
      if (oldDelta == null) {
        return;
      }

      context.editor.setContents(oldDelta.ops);
    }
  }

  async onEditClick(banner: any) {
    this.store$.dispatch(
      new CommunicationStoreActions.GetBannerRegistrationAction({
        id: banner.id
      })
    );
  }

  async onCleanClick() {
    this.form.patchValue({
      bannerId: null,
      url: null,
      initialDate: null,
      finalDate: null,
      image: null,
      backgroundColor: '#232851',
      establishments: null
    });

    this.slides = [];
    this.previewPortal = null;
    this.previewApp = null;
    this.hasAppImage = false;
    this.hasPortalImage = false;
  }

  async onRemoveAppImageClick() {
    this.previewApp = null;
    this.hasAppImage = false;
  }

  async onRemovePortalImageClick() {
    this.previewPortal = null;
    this.hasPortalImage = false;
  }

  async selectFilesPortal(event: any) {
    const selectedFilesPortal = event.target.files[0];

    if (selectedFilesPortal) {
      const pattern = /image-*/;

      if (!selectedFilesPortal.type.match(pattern)) {
        this.notificationService.showWarning('Only jpg/jpeg and png files are allowed!');
        return;
      }

      this.progressInfosPortal = [];
      this.previewPortal = null;

      const reader = new FileReader();

      reader.onload = (e: any) => {
        this.hasPortalImage = true;
        this.previewPortal = e.target.result;

        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
          this.portalFile = input.files[0];
        }
      };

      reader.readAsDataURL(selectedFilesPortal);
    }
  }

  async selectFilesApp(event: any) {
    const selectedFilesApp = event.target.files[0];

    if (selectedFilesApp) {
      const pattern = /image-*/;

      if (!selectedFilesApp.type.match(pattern)) {
        this.notificationService.showWarning('Only jpg/jpeg and png files are allowed!');
        return;
      }

      this.progressInfosApp = [];
      this.previewApp = null;

      const reader = new FileReader();

      reader.onload = (e: any) => {
        this.hasAppImage = true;
        this.previewApp = e.target.result;

        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
          this.appFile = input.files[0];
        }
      };

      reader.readAsDataURL(selectedFilesApp);
    }
  }

  onInitialDateChange(event: any) {
    this.finalDateMin = event ? new Date(event) : this.minDate;
  }

  onFinalDateChange(event: any) {
    if (!!event) {
      this.initialDateMax = new Date(event);
    }
  }

  updateColorAlpha(alpha: any) {
    this.bannerBackgroundColor.nativeElement.style.opacity = alpha.target.value;
  }
}
