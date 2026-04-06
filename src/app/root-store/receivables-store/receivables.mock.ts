import {
  Receivable,
  ReceivableDetail,
  ReceivableCalendar,
  SummaryCardReceivables,
  LastUpdateDateReceivables,
  Adjustment,
} from './receivables.models';

import { mockDetails as mockSalesDetails } from '../sales-store/sales.mock';

/* =========================
   HELPERS
========================= */

const toDateString = (d: Date) => d.toISOString();

/* =========================
   DETAILS
========================= */

export const mockDetails: (ReceivableDetail & { establishmentCode: string })[] =
  mockSalesDetails.map((s) => ({
    bank: 341,
    agency: 1234,
    account: '123',

    paymentDate: toDateString(s.paymentDate),

    saleAmount: s.saleAmount,
    paymentAmount: s.paymentAmount,
    paymentValue: s.paymentAmount,

    discountFee: s.discountFee,

    cardBrand: s.cardBrand,
    paymentType: s.paymentType,

    authorizationCode: s.authorizationCode,
    nsu: Number(s.nsu),

    paymentStatus: 'Pago',

    saleDate: new Date(s.saleDate),
    saleTime: '12:00',

    terminalNumber: s.terminalNumber,

    prepaymentFeeAmount: 0,

    isCancelled: false,
    isAdjust: false,
    isPix: s.isPix,

    adjustmentType: 0,
    adjustmentAccountingSection: '',

    sortingDate: new Date(s.paymentDate),

    releaseTypeDescription: '',
    releaseValue: 0,
    releaseDate: new Date(s.paymentDate),
    releaseDescription: '',

    originPix: 'QR',

    installmentNumber: 1,
    grossInstallmentValue: s.saleAmount,
    prepaymentFeeValue: 0,

    establishmentCode: s.documentNumber,
  }));

/* =========================
   RECEIVABLES
========================= */

export const mockReceivables: Receivable[] = mockDetails.map((d, i) => ({
  account: d.account,
  acquirerBranch: '0001',
  administrationFeeValue: d.discountFee,

  agency: d.agency,
  authorizationCode: d.authorizationCode,
  bank: d.bank,

  branchCodePayware: 1,
  captureMethodDescription: 'POS',
  captureMethodId: 1,

  cardBrandDescription: d.cardBrand,
  cardBrandId: 1,

  cardNumber: '**** **** **** 1234',
  commerceCodePayware: 1,

  country: 'BR',

  discountAmount: d.discountFee,
  discountInstallmentAmount: 0,

  envolopeId: 1,
  establishmentCode: d.establishmentCode,

  grossInstallmentValue: d.grossInstallmentValue,
  grossSaleValue: d.saleAmount,

  installmentNsu: d.nsu,
  installmentNumber: d.installmentNumber,
  installmentStatusId: 1,
  installmentsTotalNumber: 1,

  interchangeFeeValueTariff: 0,
  mcc: 1234,

  multiborderReducingValue: 0,

  netAmountInstallment: d.paymentAmount,
  netSaleValue: d.paymentAmount,

  nsu: d.nsu,

  paymentAccountNumber: 1,
  paymentDate: new Date(d.paymentDate!),

  paymentIdPayware: 1,
  paywareFinancialId: 1,

  prepaymentFeeValue: 0,
  prepaymentIdPayware: 0,
  prepaymentNetValue: 0,

  productDescription: 'Produto',
  productId: 1,

  productTypeDescription: 'Venda',
  productTypeId: 1,

  registerCode: 'REG-' + i,

  releaseTypeDescription: '',
  releaseTypeId: 1,

  requestCode: 'REQ-' + i,

  terminalNumber: d.terminalNumber,
  trace: i,

  transactionDate: d.saleDate,
  transactionId: i,

  transactionStatusDescription: d.paymentStatus,
  transactionStatusId: 1,

  transactionTypeDescription: d.paymentType,
  transactionTypeId: 1,

  valueInterchangeFeeInstallmentFee: 0,

  paymentValue: d.paymentValue,
  paymentStatus: d.paymentStatus,
  paymentType: d.paymentType,

  isCancelled: d.isCancelled,
  isAdjust: d.isAdjust,
  isPix: d.isPix,

  releaseType: 1,
  releaseValue: d.releaseValue,
  releaseDate: d.releaseDate,
  releaseDescription: d.releaseDescription,

  sortingDate: d.sortingDate,
}));

/* =========================
   CALENDAR
========================= */

export const mockCalendar: ReceivableCalendar[] = mockReceivables.map((r) => ({
  day: r.sortingDate.getDate(),
  month: r.sortingDate.getMonth() + 1,
  year: r.sortingDate.getFullYear(),
  yearMonthDay: r.sortingDate.toISOString(),

  amount: r.paymentValue,
  sortingDate: r.sortingDate,
  paymentStatus: r.paymentStatus,
  paymentDate: r.paymentDate,

  receivablesCreditAmount: r.paymentValue,
  receivablesPrepaymentAmount: 0,

  isCancelled: false,
  isAdjust: false,
  isPix: r.isPix,

  adjustmentsCredits: [],
  adjustmentsDebits: [],
}));

/* =========================
   SUMMARY
========================= */

const total = mockReceivables.reduce((s, d) => s + d.paymentValue, 0);

export const mockSummary: SummaryCardReceivables = {
  totalAmount: total,
  totalCount: mockReceivables.length,

  debitAmount: 0,
  debitCount: 0,
  debitPercent: '0',

  creditAmount: total,
  creditCount: mockReceivables.length,
  creditPercent: '100',

  futureAmount: total * 0.2,
  todayAmount: mockCalendar[0]?.amount || 0,

  pixAmount: total * 0.2,
  pixPercent: '20',
};

export const mockLastUpdate: LastUpdateDateReceivables = {
  lastUpdateDate: new Date(),
};

export const mockAdjustments: Adjustment[] = [];
