import { environment } from '@/environments/environment';
import { IdentityStoreActions, IdentityStoreSelectors } from '@/root-store/identity-store';
import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { isEmpty } from 'lodash';
import { Subject, takeUntil } from 'rxjs';
import {
  AdministrationStoreActions,
  AdministrationStoreSelectors
} from 'src/app/root-store/administration-store';
import { Establishment } from 'src/app/root-store/administration-store/administration.models';
import { MfaStoreSelectors } from 'src/app/root-store/mfa-store';
import { AppState } from '../../../root-store/state';
import { NavigationService } from '../../../shared/services/navigation.service';

@Component({ template: '' })
export abstract class BasePage implements OnDestroy {
  protected $unsub = new Subject();
  private establishments: Establishment[] = [];
  protected selectedEstablishmentsUids: string[] = [];
  protected selectedEstablishments: Establishment[] = [];
  protected hasPunctualPermission = false;
  protected hasBannersPermission = false;
  protected verificationCompleted = false;

  public bannerUrl: string = environment.prepaymentLink;

  protected get hasSelectedEstablishments() {
    return !Array.isEmpty(this.selectedEstablishmentsUids);
  }

  constructor(protected store$: Store<AppState>, protected navigationService: NavigationService) {
    this.subscribeSelectedEstablishments();
    this.subscribeEstablishments();
    this.subscribePunctualPrepaymentPermission();
    this.subscribeBannersPermission();
    this.subscribeVerificationCompleted();
  }

  protected onChangeSelectedEstablishments(): void {}

  ngOnDestroy(): void {
    this.$unsub.next(false);
    this.$unsub.complete();
  }

  private subscribePunctualPrepaymentPermission() {
    this.store$
      .select(IdentityStoreSelectors.selectPunctualPrepaymentPermission)
      .pipe(takeUntil(this.$unsub))
      .subscribe((punctualPermission: boolean) => {
        this.hasPunctualPermission = punctualPermission || false;
      });
  }

  private subscribeBannersPermission() {
    this.store$
      .select(IdentityStoreSelectors.selectBannersPermission)
      .pipe(takeUntil(this.$unsub))
      .subscribe((bannersPermission: boolean) => {
        this.hasBannersPermission = bannersPermission || false;
      });
  }

  private subscribeSelectedEstablishments() {
    this.store$
      .select(AdministrationStoreSelectors.selectSelectedEstablishments)
      .pipe(takeUntil(this.$unsub))
      .subscribe((selectedEstablishments: Establishment[]) => {
        const selectedEstablishmentDocuments = selectedEstablishments.map((c) => c.documentNumber);
        const selectedEstablishmentsUids = selectedEstablishments.map((c) => c.uid);
        const selectedEstablishmentIdZuri = selectedEstablishments.map((c) => c.idZuri);
        const selectedEstablishmentEstablishmentType = selectedEstablishments.map(
          (c) => c.establishmentType
        );

        const uidsChanged = [
          ...this.selectedEstablishmentsUids.differenceWith(selectedEstablishmentsUids),
          ...selectedEstablishmentsUids.differenceWith(this.selectedEstablishmentsUids)
        ];

        const selectedEstablishmentsDocuments = selectedEstablishmentDocuments || [];
        this.selectedEstablishments = selectedEstablishments || [];
        this.selectedEstablishmentsUids = selectedEstablishmentsUids || [];

        if (uidsChanged.length) {
          this.onChangeSelectedEstablishments();
          this.selectListUserPermissions();
          this.selectGetEconomicGroupReserve();
        }

        (window as any).uids = this.selectedEstablishmentsUids.toString();
        (window as any).cnpj = selectedEstablishmentsDocuments.toString();
        (window as any).idZuri = selectedEstablishmentIdZuri.toString();
        (window as any).tipoEstabelecimento = selectedEstablishmentEstablishmentType.toString();

        if (!isEmpty(this.selectedEstablishments)) {
          const activeMfa = this.selectedEstablishments.some((x) => x.activeMfa);
          (window as any).statusMfa = activeMfa ? 'Ativo' : 'Não Ativo';
        }
      });
  }

  private selectGetEconomicGroupReserve() {
    this.store$.dispatch(
      new AdministrationStoreActions.GetEconomicGroupReserveAction({
        uids: this.selectedEstablishmentsUids
      })
    );
  }

  private selectListUserPermissions() {
    this.store$.dispatch(
      new IdentityStoreActions.ListUserPermissionsAction({
        selectedEstablishments: this.selectedEstablishmentsUids
      })
    );
  }

  private subscribeEstablishments() {
    this.store$
      .select(AdministrationStoreSelectors.selectEstablishments)
      .pipe(takeUntil(this.$unsub))
      .subscribe((establishments: Establishment[]) => {
        this.establishments = [...(establishments || [])];
      });
  }

  private subscribeVerificationCompleted() {
    this.store$
      .select(MfaStoreSelectors.selectVerificationCompleted)
      .pipe(takeUntil(this.$unsub))
      .subscribe((verificationCompleted: boolean) => {
        this.verificationCompleted = verificationCompleted;
      });
  }
}
