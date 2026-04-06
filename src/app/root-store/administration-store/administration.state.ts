import {
  EconomicGroupBankingAccountsResponse,
  EconomicGroupRatesResponse,
  EconomicGroupReserveResponse,
  Establishment,
} from './administration.models';

export interface AdministrationState {
  establishments: Establishment[];
  selectedEstablishment: Establishment;
  selectedEstablishments: string[];
  economicGroupPhone: string;
  economicGroupRates: EconomicGroupRatesResponse;
  economicGroupReserve: EconomicGroupReserveResponse;
  getEconomicGroupReserveError?: any;
  getEconomicGroupPhoneError?: any;
  getEconomicGroupRatesError?: any;
  economicGroupBankingAccounts: EconomicGroupBankingAccountsResponse;
  getEconomicGroupBankingAccountsError?: any;
}

export const initialState: AdministrationState = {
  selectedEstablishments: [],
  establishments: [],
  selectedEstablishment: null as any,
  economicGroupPhone: null as any,
  economicGroupRates: null as any,
  economicGroupReserve: null as any,
  getEconomicGroupReserveError: null as any,
  getEconomicGroupPhoneError: null as any,
  getEconomicGroupRatesError: null as any,
  economicGroupBankingAccounts: null as any,
  getEconomicGroupBankingAccountsError: null as any,
};
