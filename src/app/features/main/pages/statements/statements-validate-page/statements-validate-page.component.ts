import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { saveAs } from 'file-saver';
import { Subject, takeUntil } from 'rxjs';
import { AppState } from './../../../../../root-store/state';
import {
  StatementsStoreActions,
  StatementsStoreSelectors,
} from './../../../../../root-store/statements-store';
import { NotificationService } from './../../../../../shared/services/notification.service';
import { SharedModule } from './../../../../../shared/shared.module';

@Component({
  templateUrl: './statements-validate-page.component.html',
  styleUrls: ['./statements-validate-page.component.scss'],
  standalone: true,
  imports: [SharedModule],
})
export class StatementsValidatePageComponent implements OnInit, OnDestroy {
  private $unsub = new Subject();
  progress!: number;
  message!: string;
  @Output() public onUploadFinished = new EventEmitter();
  fileName = '';

  constructor(
    private notificationService: NotificationService,
    private store$: Store<AppState>,
  ) {}

  ngOnInit() {
    this.store$
      .select(StatementsStoreSelectors.selectUploadStatementFileValidate)
      .pipe(takeUntil(this.$unsub))
      .subscribe((data) => {
        if (!!data) {
          saveAs(data, this.fileName.split('.')[0]);
        }

        this.store$.dispatch(
          new StatementsStoreActions.DownloadedStatementFileValidateExcelAction(),
        );
      });
  }

  ngOnDestroy(): void {
    this.$unsub.next(false);
    this.$unsub.complete();
  }

  uploadFile = (files: any) => {
    if (files.length === 0) {
      return;
    }

    var pattern = /text-*/;
    let fileToUpload = <File>files[0];

    if (!fileToUpload.type.match(pattern)) {
      this.notificationService.showWarning(
        'Only txt and xml files are allowed!',
      );
      return;
    }

    this.fileName = fileToUpload.name;
    this.store$.dispatch(
      new StatementsStoreActions.UploadStatementFileValidateAction({
        fileToUpload,
      }),
    );
  };
}
