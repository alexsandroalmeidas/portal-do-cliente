
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { QuillEditorComponent } from 'ngx-quill';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AdministrationStoreSelectors } from './../../../../../root-store/administration-store';
import { Establishment } from './../../../../../root-store/administration-store/administration.models';
import { CommunicationStoreActions, CommunicationStoreSelectors } from './../../../../../root-store/communication-store';
import { Message } from './../../../../../root-store/communication-store/communication.models';
import { AppState } from './../../../../../root-store/state';
import { FormValidators } from './../../../../../shared/extras/form-validators';
import { SelectOption } from './../../../../../shared/models/select-options';
import { NotificationService } from './../../../../../shared/services/notification.service';
import { SharedModule } from './../../../../../shared/shared.module';
import { MessagesListComponent } from './messages-list/messages-list.component';

@Component({
  selector: 'app-messages-page',
  templateUrl: './messages-page.component.html',
  styleUrls: ['./messages-page.component.scss'],
  standalone: true,
  imports: [
    MessagesListComponent,
    SharedModule],
})
export class MessagesPageComponent implements OnInit, OnDestroy {
  private $unsub = new Subject();
  form!: FormGroup;

  customersOptions: SelectOption[] = [];
  establishments!: Establishment[];
  submitted = false;
  messages: Message[] = [];

  get formControls() {
    return this.form.controls;
  }

  @ViewChild('editorQuill', { static: true, }) editor!: QuillEditorComponent;

  constructor(
    private formBuilder: FormBuilder,
    private store$: Store<AppState>,
    private notificationService: NotificationService
  ) {
  }

  ngOnInit(): void {

    this.form = this.formBuilder.group({
      establishments: [null],
      allEstablishments: [false, [Validators.required]],
      title: [null, [Validators.required]],
      editor: [null, [Validators.required]],
      messageId: null,
      pushNotification: [false]
    });

    this.formControls['allEstablishments'].valueChanges.subscribe(
      (allEstablishments: boolean) => {
        if (!!allEstablishments) {
          this.formControls['establishments'].disable();
          this.formControls['establishments'].patchValue([]);
        }

        this.formControls['establishments'].enable();
      }
    );

    this.subscribeEstablishments();

    this.subscribeMessageInclusionRegistration();

    this.subscribeMessageUpdateRegistration();

    this.subscribeMessageNotified();

    this.subscribeMessageExclusionRegistration();

    this.subscribeMessages();

    this.selectListMessagesRegistration();
  }

  private subscribeEstablishments() {
    this.store$
      .select(AdministrationStoreSelectors.selectEstablishments)
      .pipe(takeUntil(this.$unsub))
      .subscribe(establishments => {
        this.establishments = establishments;

        if (!!this.establishments) {
          this.customersOptions = [...this.establishments
            .map(establishment => new SelectOption(`${establishment.documentNumber} - ${establishment.companyName}`, establishment.uid))];
        }
      });
  }

  private subscribeMessageInclusionRegistration() {
    this.store$
      .select(CommunicationStoreSelectors.selectMessageInclusionRegistration)
      .pipe(takeUntil(this.$unsub))
      .subscribe((message) => {
        if (!!message?.id) {
          this.notificationService.showSuccess('Mensagem salva com sucesso!');
          this.store$.dispatch(
            new CommunicationStoreActions.RegistrationMessageSuccessAction()
          );

          this.onClean();

          this.store$.dispatch(
            new CommunicationStoreActions.ListMessagesRegistrationAction()
          );
        }
      });
  }

  private subscribeMessageUpdateRegistration() {
    this.store$
      .select(CommunicationStoreSelectors.selectMessageUpdateRegistration)
      .pipe(takeUntil(this.$unsub))
      .subscribe((message) => {
        if (!!message?.id) {
          this.notificationService.showSuccess('Mensagem atualizada com sucesso!');
          this.store$.dispatch(
            new CommunicationStoreActions.RegistrationMessageSuccessAction()
          );

          this.onClean();

          this.store$.dispatch(
            new CommunicationStoreActions.ListMessagesRegistrationAction()
          );
        }
      });
  }

  private subscribeMessageNotified() {
    this.store$
      .select(CommunicationStoreSelectors.selectMessageNotified)
      .pipe(takeUntil(this.$unsub))
      .subscribe((message) => {
        if (!!message?.id) {
          this.notificationService.showSuccess('Mensagem notificada com sucesso!');
          this.store$.dispatch(
            new CommunicationStoreActions.NotifiedRegistrationMessageSuccessAction()
          );

          this.store$.dispatch(
            new CommunicationStoreActions.ListMessagesRegistrationAction()
          );
        }
      });
  }

  private subscribeMessageExclusionRegistration() {
    this.store$
      .select(CommunicationStoreSelectors.selectMessageExclusionRegistration)
      .pipe(takeUntil(this.$unsub))
      .subscribe((message) => {
        if (!!message?.id) {
          this.notificationService.showSuccess('Mensagem excluída com sucesso!');
          this.store$.dispatch(
            new CommunicationStoreActions.RegistrationMessageSuccessAction()
          );

          this.store$.dispatch(
            new CommunicationStoreActions.ListMessagesRegistrationAction()
          );
        }
      });
  }

  private subscribeMessages() {
    this.store$
      .select(CommunicationStoreSelectors.selectMessages)
      .pipe(takeUntil(this.$unsub))
      .subscribe((messages) => {
        this.messages = messages || [];
      });
  }

  private selectListMessagesRegistration() {
    this.store$.dispatch(
      new CommunicationStoreActions.ListMessagesRegistrationAction()
    );
  }

  ngOnDestroy(): void {
    this.$unsub.next(false);
    this.$unsub.complete();
  }

  onSave() {
    this.submitted = true;

    const form = this.form.getRawValue();

    if (!form.allEstablishments &&
      (!!!form.establishments || form.establishments.length === 0)
    ) {
      this.formControls['establishments'].setErrors({ 'is-invalid': true });
    }

    FormValidators.checkFormValidations(this.form);

    if (!this.form.valid) {
      return;
    }

    this.submitted = false;

    let uids: string[] = form.establishments;
    let establishments: { email: string; uid: string }[] = [];

    if (!form.allEstablishments) {
      establishments = uids.map(uid => {
        const { email } = this.establishments.find(e => e.uid === uid)!;

        return {
          uid,
          email
        };
      });
    }

    if (!!form.messageId) {
      this.store$.dispatch(
        new CommunicationStoreActions.UpdateMessageAction({
          id: form.messageId,
          title: form.title,
          text: form.editor,
          establishments,
          pushNotification: form.pushNotification,
          allEstablishments: form.allEstablishments
        })
      );
    } else {
      this.store$.dispatch(
        new CommunicationStoreActions.RegisterMessageAction({
          title: form.title,
          text: form.editor,
          establishments,
          pushNotification: form.pushNotification,
          allEstablishments: form.allEstablishments
        })
      );
    }
  }

  onContentChanged(context: any) {
    if (context == null || context.html == null) {
      return;
    }

    // A HTML - focused version of https://stackoverflow.com/questions/42803413/how-can-i-set-character-limit-in-quill-editor
    // It does cause an error log in the console: 'The given range isn't in document.'
    // Still it's a simple and effective solution.
    if (context.html.length > 30) {
      let oldDelta = context['oldDelta'];
      if (oldDelta == null) {
        return;
      }
      context.editor.setContents(oldDelta.ops);
    }
  }

  onEdit(message: Message) {

    const establishments = message.links.map(lnk => {
      const { uid } = this.establishments.find(e => e.documentNumber === lnk.documentNumber)!;

      return uid;
    });

    this.form.patchValue({
      messageId: message.id,
      title: message.title,
      editor: message.text,
      establishments,
      pushNotification: message.pushNotification,
      allEstablishments: message.allEstablishments
    });

    window.scrollTo(0, 10);
  }

  onClean() {
    this.form.patchValue({
      messageId: null,
      title: null,
      editor: null,
      establishments: null,
      pushNotification: false,
      allEstablishments: false
    });
  }
}
