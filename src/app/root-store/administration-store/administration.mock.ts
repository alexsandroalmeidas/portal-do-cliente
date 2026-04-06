import {
  EconomicGroupRatesResponse,
  EconomicGroupReserveResponse,
  EconomicGroupBankingAccountsResponse,
} from './administration.models';

/* =========================
   MOCK RATES
========================= */

export const mockRatesResponse = {
  success: true,
  errors: [],
  result: {
    documentNumber: '12345678000199',
    pixBank: '341',
    pixRate: 1.2,
    pixMinRate: 0.5,
    pixDisabled: false,
    hasPrepayment: true,
    prepaymentRate: 2.5,
    idetp: 'ETP001',
    liquidationtime: 'D+1',
    isEntrePay: false,
    lastUpdateDate: new Date(),
    reserve: 1500,
    rates: [
      {
        cardBrand: 'Visa',
        prepaidDebit: 1.5,
        prepaidDebitPeriod: 1,
        prepaidCredit: 2.2,
        prepaidCreditPeriod: 2,
        cashCredit: 3.0,
        cashCreditPeriod: 30,

        installment02: 3.2,
        installment02Period: 30,
        installment03: 3.5,
        installment03Period: 60,
        installment04: 3.8,
        installment04Period: 90,
        installment05: 4.0,
        installment05Period: 120,
        installment06: 4.2,
        installment06Period: 150,
        installment07: 4.5,
        installment07Period: 180,
        installment08: 4.8,
        installment08Period: 210,
        installment09: 5.0,
        installment09Period: 240,
        installment10: 5.2,
        installment10Period: 270,
        installment11: 5.5,
        installment11Period: 300,
        installment12: 5.8,
        installment12Period: 330,
      },
    ],
  },
};

/* =========================
   MOCK RESERVE
========================= */

export const mockReserveResponse = {
  success: true,
  errors: [],
  result: {
    reserve: 1500,
  },
};

/* =========================
   MOCK BANKING ACCOUNTS
========================= */

export const mockBankingAccountsResponse = {
  success: true,
  errors: [],
  result: {
    documentNumber: '12345678000199',
    failureMessage: '',
    isSuccessful: true,
    bankingAccounts: [
      {
        bankCode: '341',
        bankName: 'Itaú',
        agency: '1234',
        account: '12345-6',

        elo: { debit: true, credit: true },
        visa: { debit: true, credit: true },
        master: { debit: true, credit: true },
        hiper: { debit: false, credit: false },
        amex: { debit: false, credit: true },

        hasElo: true,
        hasVisa: true,
        hasMaster: true,
        hasHiper: false,
        hasAmex: true,
        pix: true,
      },
    ],
  },
};

export const mockEstablishments = [
  {
    documentNumber: '12345678000199',
    companyName: 'Empresa Teste LTDA',
    email: 'teste@empresa.com',
    enableElectronicStatement: true,
    centralized: 'N',
    isHeadquarters: true,
    groupName: 'Grupo Teste',
    activeMfa: false,
    idZuri: 1,
    establishmentType: 'MATRIZ',
    uid: 'uid-123',
    isManager: true,
  },
  {
    documentNumber: '98765432000188',
    companyName: 'Filial Teste',
    email: 'filial@empresa.com',
    enableElectronicStatement: false,
    centralized: 'S',
    isHeadquarters: false,
    groupName: 'Grupo Teste',
    activeMfa: true,
    idZuri: 2,
    establishmentType: 'FILIAL',
    uid: 'uid-456',
    isManager: false,
  },
];
