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

function adjustToBusinessDay(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();

  if (day === 6) d.setDate(d.getDate() + 2);
  if (day === 0) d.setDate(d.getDate() + 1);

  return d;
}

/* =========================
   DETAILS
========================= */

export const mockDetails: (ReceivableDetail & {
  documentNumber: string;
  establishmentCode: string;
})[] = mockSalesDetails.map((s) => {
  const paymentDate = adjustToBusinessDay(new Date(s.paymentDate));

  return {
    documentNumber: s.documentNumber,
    establishmentCode: s.documentNumber,

    bank: 341,
    agency: 1234,
    account: '123',

    paymentDate: paymentDate.toISOString(),

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

    sortingDate: paymentDate,

    releaseTypeDescription: '',
    releaseValue: 0,
    releaseDate: paymentDate,
    releaseDescription: '',

    originPix: 'QR',

    installmentNumber: 1,
    grossInstallmentValue: s.saleAmount,
    prepaymentFeeValue: 0,
  };
});

/* =========================
   RECEIVABLES
========================= */

export const mockReceivables: Receivable[] = mockDetails.map((d, i) => ({
  documentNumber: d.documentNumber,
  establishmentCode: d.establishmentCode,

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

  grossInstallmentValue: d.grossInstallmentValue,
  grossSaleValue: d.saleAmount,

  installmentNsu: d.nsu,
  installmentNumber: d.installmentNumber,
  installmentStatusId: 1,
  installmentsTotalNumber: 1,

  interchangeFeeValueTariff: 0,
  multiborderReducingValue: 0,

  mcc: 1234,

  netAmountInstallment: d.paymentAmount,
  netSaleValue: d.paymentAmount,

  nsu: d.nsu,

  paymentAccountNumber: 1,
  paymentDate: new Date(d.paymentDate),

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

export function buildReceivablesCalendar(
  items: Receivable[],
  adjustments: Adjustment[],
): ReceivableCalendar[] {
  const map = new Map<string, Receivable[]>();

  items.forEach((i) => {
    const key = i.sortingDate.toDateString();
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(i);
  });

  return Array.from(map.values()).map((group) => {
    const d = group[0].sortingDate;

    return {
      day: d.getDate(),
      month: d.getMonth() + 1,
      year: d.getFullYear(),
      yearMonthDay: d.toISOString(),

      sortingDate: d,
      paymentDate: group[0].paymentDate,

      amount: group.reduce((s, x) => s + x.paymentValue, 0),

      paymentStatus: group[0].paymentStatus,

      receivablesPrepaymentAmount: 0,
      receivablesCreditAmount: group.reduce((s, x) => s + x.paymentValue, 0),

      isCancelled: false,
      isAdjust: false,
      isPix: group.some((x) => x.isPix),

      adjustmentsCredits: [],
      adjustmentsDebits: [],
    };
  });
}

/* =========================
   SUMMARY (LEGADO PARA EFFECT)
========================= */

export function buildReceivablesSummary(
  items: Receivable[],
): SummaryCardReceivables {
  const totalAmount = items.reduce((s, d) => s + d.paymentValue, 0);

  return {
    totalAmount,
    totalCount: items.length,

    debitAmount: 0,
    debitCount: 0,
    debitPercent: '0',

    creditAmount: totalAmount,
    creditCount: items.length,
    creditPercent: '100',

    futureAmount: totalAmount,
    todayAmount: totalAmount,

    pixAmount: items
      .filter((d) => d.isPix)
      .reduce((s, d) => s + d.paymentValue, 0),

    pixPercent: '0',
  };
}

/* =========================
   SUMMARY REAL
========================= */

export function buildReceivablesSummaryFromCalendar(
  calendar: ReceivableCalendar[],
): SummaryCardReceivables {
  const today = new Date();

  const normalize = (d: Date) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate());

  const todayN = normalize(today);

  let todayAmount = 0;
  let futureAmount = 0;

  calendar.forEach((d) => {
    const date = normalize(d.sortingDate);

    if (date.getTime() === todayN.getTime()) {
      todayAmount += d.amount;
    }

    if (date.getTime() > todayN.getTime()) {
      futureAmount += d.amount;
    }
  });

  const totalAmount = calendar.reduce((s, d) => s + d.amount, 0);

  return {
    totalAmount,
    totalCount: calendar.length,

    debitAmount: 0,
    debitCount: 0,
    debitPercent: '0',

    creditAmount: totalAmount,
    creditCount: calendar.length,
    creditPercent: '100',

    futureAmount,
    todayAmount,

    pixAmount: calendar
      .filter((d) => d.isPix)
      .reduce((s, d) => s + d.amount, 0),

    pixPercent: '0',
  };
}

/* =========================
   EXPORTS
========================= */

export const mockAdjustments: Adjustment[] = [];

export const mockCalendar = buildReceivablesCalendar(mockReceivables, []);

export const mockSummary = buildReceivablesSummaryFromCalendar(mockCalendar);

export const mockLastUpdate: LastUpdateDateReceivables = {
  lastUpdateDate: new Date(),
};
