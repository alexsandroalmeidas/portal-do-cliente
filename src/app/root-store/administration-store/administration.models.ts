export interface Establishment {
  documentNumber: string;
  companyName: string;
  email: string;
  enableElectronicStatement: boolean;
  centralized: string;
  isHeadquarters: boolean;
  groupName: string;
  activeMfa: boolean;
  idZuri: number;
  establishmentType: string;
  uid: string;
  isManager: boolean;
}

export interface AddPhoneNumberResponse {
  successMessage: string;
  failureMessage: string;
  email: string;
  isSuccessful: boolean;
}

export interface EconomicGroupPhoneNumberResponse {
  phoneNumber: string;
  successMessage: string;
  failureMessage: string;
  email: string;
  isSuccessful: boolean;
}

export interface EconomicGroupReserveResponse {
  reserve: number;
}

export interface EconomicGroupRatesResponse {
  documentNumber: string;
  pixBank: string;
  pixRate: number;
  pixMinRate: number;
  pixDisabled: boolean;
  hasPrepayment: boolean;
  prepaymentRate: number;
  rates: EconomicGroupRateResponse[];
  idetp: string;
  liquidationtime: string;
  isEntrePay: boolean;
  lastUpdateDate: Date;
  reserve: number;
}

export interface EconomicGroupRateResponse {
  cardBrand: string;
  prepaidDebit: number;
  prepaidDebitPeriod: number;
  prepaidCredit: number;
  prepaidCreditPeriod: number;
  cashCredit: number;
  cashCreditPeriod: number;
  installment02: number;
  installment02Period: number;
  installment03: number;
  installment03Period: number;
  installment04: number;
  installment04Period: number;
  installment05: number;
  installment05Period: number;
  installment06: number;
  installment06Period: number;
  installment07: number;
  installment07Period: number;
  installment08: number;
  installment08Period: number;
  installment09: number;
  installment09Period: number;
  installment10: number;
  installment10Period: number;
  installment11: number;
  installment11Period: number;
  installment12: number;
  installment12Period: number;
}

export interface EconomicGroupBankingAccountsResponse {
  documentNumber: string;
  failureMessage: string;
  isSuccessful: boolean;
  bankingAccounts: EconomicGroupBankingAccountResponse[];
}

export interface EconomicGroupBankingAccountResponse {
  bankCode: string;
  bankName: string;
  agency: string;
  account: string;
  elo: EconomicGroupBankingAccountCardBrandResponse;
  visa: EconomicGroupBankingAccountCardBrandResponse;
  master: EconomicGroupBankingAccountCardBrandResponse;
  hiper: EconomicGroupBankingAccountCardBrandResponse;
  amex: EconomicGroupBankingAccountCardBrandResponse;

  hasElo: boolean;
  hasVisa: boolean;
  hasMaster: boolean;
  hasHiper: boolean;
  hasAmex: boolean;
  pix: boolean;
}

export interface EconomicGroupBankingAccountCardBrandResponse {
  debit: boolean;
  credit: boolean;
}
