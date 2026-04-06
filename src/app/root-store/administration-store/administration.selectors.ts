import {
  createFeatureSelector,
  createSelector,
  MemoizedSelector,
} from '@ngrx/store';
import {
  EconomicGroupBankingAccountsResponse,
  EconomicGroupRatesResponse,
  EconomicGroupReserveResponse,
  Establishment,
} from './administration.models';
import { AdministrationState } from './administration.state';

export const selectAdministrationState =
  createFeatureSelector<AdministrationState>('administration');

export const selectEstablishments: MemoizedSelector<object, Establishment[]> =
  createSelector(
    selectAdministrationState,
    (state: AdministrationState): Establishment[] => state.establishments,
  );

export const selectSelectedEstablishment: MemoizedSelector<
  object,
  Establishment
> = createSelector(
  selectAdministrationState,
  (state: AdministrationState): Establishment => state.selectedEstablishment,
);

export const selectSelectedEstablishmentsUids: MemoizedSelector<
  object,
  string[]
> = createSelector(
  selectAdministrationState,
  (state: AdministrationState): string[] => state.selectedEstablishments,
);

export const selectSelectedEstablishments: MemoizedSelector<
  object,
  Establishment[]
> = createSelector(
  selectEstablishments,
  selectSelectedEstablishmentsUids,
  (
    allEstablishments: Establishment[],
    selectedUids: string[],
  ): Establishment[] => {
    return (allEstablishments || []).filter((c) =>
      (selectedUids || []).includes(c.uid),
    );
  },
);

export const selectIsManager: MemoizedSelector<object, boolean> =
  createSelector(
    selectEstablishments,
    selectSelectedEstablishmentsUids,
    (allEstablishments: Establishment[], selectedUids: string[]): boolean => {
      const allEstab = (allEstablishments || []).filter((c) =>
        (selectedUids || []).includes(c.uid),
      );
      return allEstab?.map((x) => x.isManager).firstOrDefault((x) => !!x);
    },
  );

export const selectEconomicGroupPhone: MemoizedSelector<object, string> =
  createSelector(
    selectAdministrationState,
    (state: AdministrationState): string => state.economicGroupPhone,
  );

export const selectGetEconomicGroupPhoneHasError: MemoizedSelector<
  object,
  string
> = createSelector(
  selectAdministrationState,
  (state: AdministrationState): string => state.getEconomicGroupPhoneError,
);

export const selectEconomicGroupRates: MemoizedSelector<
  object,
  EconomicGroupRatesResponse
> = createSelector(
  selectAdministrationState,
  (state: AdministrationState): EconomicGroupRatesResponse =>
    state.economicGroupRates,
);

export const selectGetEconomicGroupRatesHasError: MemoizedSelector<
  object,
  string
> = createSelector(
  selectAdministrationState,
  (state: AdministrationState): string => state.getEconomicGroupRatesError,
);

export const selectEconomicGroupBankingAccounts: MemoizedSelector<
  object,
  EconomicGroupBankingAccountsResponse
> = createSelector(
  selectAdministrationState,
  (state: AdministrationState): EconomicGroupBankingAccountsResponse =>
    state.economicGroupBankingAccounts,
);

export const selectGetEconomicGroupBankingAccountsHasError: MemoizedSelector<
  object,
  string
> = createSelector(
  selectAdministrationState,
  (state: AdministrationState): string =>
    state.getEconomicGroupBankingAccountsError,
);

export const selectEconomicGroupReserve: MemoizedSelector<
  object,
  EconomicGroupReserveResponse
> = createSelector(
  selectAdministrationState,
  (state: AdministrationState): EconomicGroupReserveResponse =>
    state.economicGroupReserve,
);

export const selectGetEconomicGroupReserveHasError: MemoizedSelector<
  object,
  string
> = createSelector(
  selectAdministrationState,
  (state: AdministrationState): string => state.getEconomicGroupReserveError,
);
