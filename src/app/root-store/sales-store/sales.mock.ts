import {
  SalesCalendar,
  SalesDetail,
  SummaryCardSales,
  SummaryLastSales,
  LastUpdateDateSales,
} from './sales.models';

/* =========================
   CONFIG
========================= */

const ESTABLISHMENTS = [
  {
    documentNumber: '98765432000188',
    brands: ['Visa', 'Mastercard', 'Elo'],
  },
  {
    documentNumber: '12345678000199',
    brands: ['Mastercard', 'Elo'],
  },
];

/* =========================
   HELPERS
========================= */

let nsu = 1000;

function nextNSU() {
  return String(nsu++);
}

function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function getSettlement(type: string) {
  if (type === 'Pix') return 0;
  if (type === 'Débito') return 1;
  return 30;
}

/* =========================
   CALENDAR
========================= */

export const mockSalesCalendar: SalesCalendar[] = Array.from({
  length: 30,
}).map((_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - i);

  return {
    sortingDate: date,
    amount: 100 + i * 10,

    debitAmount: 30,
    debitCount: 1,

    creditAmount: 70,
    creditCount: 1,

    voucherAmount: 0,
    voucherCount: 0,

    pixAmount: 0,
    pixCount: 0,
  } as SalesCalendar;
});

/* =========================
   DETAILS
========================= */

export const mockDetails: SalesDetail[] = mockSalesCalendar.flatMap((d, i) =>
  ESTABLISHMENTS.map((e) => {
    const paymentType = ['Crédito', 'Débito', 'Pix'][i % 3];
    const settlement = getSettlement(paymentType);

    return {
      documentNumber: e.documentNumber,

      saleDate: d.sortingDate,
      paymentDate: addDays(d.sortingDate, settlement),

      saleAmount: d.amount,
      paymentAmount: d.amount * 0.95,

      cardBrand: e.brands[i % e.brands.length],

      authorizationCode: `AUTH-${i}`,
      nsu: nextNSU(),

      terminalNumber: `T-${i}`,
      discountFee: d.amount * 0.05,

      isCancelled: false,

      debitAmount: d.debitAmount,
      debitCount: d.debitCount,
      creditAmount: d.creditAmount,
      creditCount: d.creditCount,

      voucherAmount: 0,
      voucherCount: 0,

      pixAmount: 0,
      pixCount: 0,
      paymentType,

      isDebit: paymentType === 'Débito',
      isCredit: paymentType === 'Crédito',
      isPix: paymentType === 'Pix',
      isVoucher: false,
      isInstallments: false,
    } as SalesDetail;
  }),
);

/* =========================
   SUMMARY
========================= */

const totalAmount = mockDetails.reduce((sum, d) => sum + d.saleAmount, 0);
const totalCount = mockDetails.length;

// 🔥 AGRUPAMENTOS
const debit = mockDetails.filter((d) => d.isDebit);
const credit = mockDetails.filter((d) => d.isCredit);
const pix = mockDetails.filter((d) => d.isPix);
const voucher = mockDetails.filter((d) => d.isVoucher);

// 🔥 SOMAS
const debitAmount = debit.reduce((s, d) => s + d.saleAmount, 0);
const creditAmount = credit.reduce((s, d) => s + d.saleAmount, 0);
const pixAmount = pix.reduce((s, d) => s + d.saleAmount, 0);
const voucherAmount = voucher.reduce((s, d) => s + d.saleAmount, 0);

// 🔥 COUNTS
const debitCount = debit.length;
const creditCount = credit.length;
const pixCount = pix.length;
const voucherCount = voucher.length;

// 🔥 HELPERS
function percent(value: number, total: number) {
  if (!total) return '0';
  return ((value / total) * 100).toFixed(2);
}

export const mockSummary: SummaryCardSales = {
  totalAmount,
  totalCount,

  debitAmount,
  debitAmountPercent: percent(debitAmount, totalAmount),
  debitCount,
  debitPercent: percent(debitCount, totalCount),

  creditAmount,
  creditAmountPercent: percent(creditAmount, totalAmount),
  creditCount,
  creditPercent: percent(creditCount, totalCount),

  voucherAmount,
  voucherAmountPercent: percent(voucherAmount, totalAmount),
  voucherCount,
  voucherCountPercent: percent(voucherCount, totalCount),

  pixAmount,
  pixAmountPercent: percent(pixAmount, totalAmount),
  pixCount,
  pixCountPercent: percent(pixCount, totalCount),

  approvedCount: totalCount,
  approvedAmount: totalAmount,
};

/* =========================
   LAST SALES
========================= */

export const mockLastSales: SummaryLastSales[] = mockDetails.map((d) => ({
  documentNumber: d.documentNumber,
  saleDate: new Date(d.saleDate),
  saleAmount: d.saleAmount,
  paymentAmount: d.paymentAmount,
  cardBrand: d.cardBrand,
  paymentType: d.paymentType,
  authorizationCode: d.authorizationCode,
  nsu: Number(d.nsu),
  status: 'Aprovado',
  terminalNumber: d.terminalNumber,
  discountFee: d.discountFee,
  prepaymentFeeValue: 0,
  cancellationValue: 0,
  cardNumber: d.cardNumber, //'**** **** **** 1234',
  isCancelled: false,
}));

/* =========================
   LAST UPDATE
========================= */

export const mockLastUpdate: LastUpdateDateSales = {
  lastUpdateDate: new Date(),
};
