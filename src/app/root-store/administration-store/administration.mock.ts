/* =========================
   MOCK RATES DATABASE
========================= */

function emptyRates(cardBrand: string) {
  return {
    cardBrand,
    prepaidDebit: 0,
    prepaidDebitPeriod: 0,
    prepaidCredit: 0,
    prepaidCreditPeriod: 0,
    cashCredit: 0,
    cashCreditPeriod: 0,
    installment02: 0,
    installment02Period: 0,
    installment03: 0,
    installment03Period: 0,
    installment04: 0,
    installment04Period: 0,
    installment05: 0,
    installment05Period: 0,
    installment06: 0,
    installment06Period: 0,
    installment07: 0,
    installment07Period: 0,
    installment08: 0,
    installment08Period: 0,
    installment09: 0,
    installment09Period: 0,
    installment10: 0,
    installment10Period: 0,
    installment11: 0,
    installment11Period: 0,
    installment12: 0,
    installment12Period: 0,
  };
}

function filledRates(cardBrand: string) {
  return {
    cardBrand,
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
  };
}

export const mockRatesDatabase = [
  /* =========================
     CNPJ 1 (ZERADO - IGUAL AO BACKEND)
  ========================= */
  {
    documentNumber: '00225434000190',

    pixBank: 'FXP',
    pixRate: 0.9,
    pixMinRate: 0,
    pixDisabled: false,

    prepaymentRate: 0,
    hasPrepayment: false,

    reserve: 0,
    idetp: '',
    liquidationtime: '',
    isEntrePay: false,

    lastUpdateDate: new Date(),

    rates: [
      emptyRates('Visa'),
      emptyRates('Mastercard'),
      emptyRates('Elo'),
      emptyRates('Hipercard'),
      emptyRates('American Express'),
    ],
  },

  /* =========================
     CNPJ 2 (COM TAXAS)
  ========================= */
  {
    documentNumber: '12345678000199',

    pixBank: '341',
    pixRate: 1.2,
    pixMinRate: 0.5,
    pixDisabled: false,

    prepaymentRate: 2.5,
    hasPrepayment: true,

    reserve: 1500,
    idetp: 'ETP001',
    liquidationtime: 'D+1',
    isEntrePay: false,

    lastUpdateDate: new Date(),

    rates: [
      filledRates('Visa'),
      filledRates('Mastercard'),
      filledRates('Elo'),
      filledRates('Hipercard'),
      filledRates('American Express'),
    ],
  },
];

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
   MOCK BANKING DATABASE
========================= */

export const mockBankingAccountsDatabase = [
  /* =========================
     CNPJ 1
  ========================= */
  {
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

  /* =========================
     CNPJ 2 (DIFERENTE)
  ========================= */
  {
    documentNumber: '98765432000188',
    failureMessage: '',
    isSuccessful: true,
    bankingAccounts: [
      {
        bankCode: '1',
        bankName: 'Banco do Brasil',
        agency: '5678',
        account: '98765-0',

        elo: { debit: false, credit: true },
        visa: { debit: true, credit: false },
        master: { debit: true, credit: true },
        hiper: { debit: true, credit: false },
        amex: { debit: false, credit: false },

        hasElo: true,
        hasVisa: true,
        hasMaster: true,
        hasHiper: true,
        hasAmex: false,
        pix: true,
      },
      {
        bankCode: '033',
        bankName: 'Santander',
        agency: '9999',
        account: '11111-1',

        elo: { debit: true, credit: false },
        visa: { debit: true, credit: true },
        master: { debit: false, credit: true },
        hiper: { debit: false, credit: false },
        amex: { debit: false, credit: true },

        hasElo: true,
        hasVisa: true,
        hasMaster: true,
        hasHiper: false,
        hasAmex: true,
        pix: false,
      },
    ],
  },
];

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

export const mockEconomicGroupPhonesDatabase = [
  {
    email: 'teste@empresa.com',
    phoneNumber: '51999999999',
    successMessage: 'Telefone encontrado com sucesso',
    failureMessage: '',
    isSuccessful: true,
  },
  {
    email: 'filial@empresa.com',
    phoneNumber: '51988888888',
    successMessage: 'Telefone encontrado com sucesso',
    failureMessage: '',
    isSuccessful: true,
  },
];
