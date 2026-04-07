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

function isWeekend(date: Date): boolean {
  const day = date.getDay(); // 0 = domingo, 6 = sábado
  return day === 0 || day === 6;
}

function generateBusinessDays(totalDays: number) {
  const result: { date: Date; amount: number }[] = [];

  let i = 0;
  let cursor = new Date();

  while (result.length < totalDays) {
    const current = new Date(cursor);
    current.setDate(cursor.getDate() - i);

    if (!isWeekend(current)) {
      result.push({
        date: current,
        amount: 100 + result.length * 10,
      });
    }

    i++;
  }

  return result;
}

const baseDates = generateBusinessDays(30);

/* =========================
   CALENDAR
========================= */

export function buildCalendar(details: SalesDetail[]): SalesCalendar[] {
  const map = new Map<string, SalesCalendar>();

  details.forEach((d) => {
    const date = new Date(d.saleDate);
    const key = date.toDateString();

    if (!map.has(key)) {
      map.set(key, {
        day: date.getDate(),
        month: date.getMonth() + 1,
        year: date.getFullYear(),
        yearMonthDay: date.toISOString(),

        paymentStatus: 'Pago',
        amount: 0,
        sortingDate: date,

        isCancelled: false,

        debitAmount: 0,
        debitCount: 0,

        prepaidDebitAmount: 0,
        prepaidDebitCount: 0,

        creditAmount: 0,
        creditCount: 0,

        internationalCreditAmount: 0,
        internationalCreditCount: 0,

        prepaidCreditAmount: 0,
        prepaidCreditCount: 0,

        voucherAmount: 0,
        voucherCount: 0,

        installmentsAmount: 0,
        installmentsCount: 0,

        pixAmount: 0,
        pixCount: 0,

        isDebit: false,
        isPrepaidDebit: false,
        isCredit: false,
        isPrepaidCredit: false,
        isInternationalCredit: false,
        isVoucher: false,
        isPix: false,
        isInstallments: false,
      });
    }

    const item = map.get(key)!;

    // 🔥 TOTAL
    item.amount += d.saleAmount;

    // 🔥 DEBIT
    if (d.isDebit) {
      item.debitAmount += d.saleAmount;
      item.debitCount++;
      item.isDebit = true;
    }

    // 🔥 CREDIT
    if (d.isCredit) {
      item.creditAmount += d.saleAmount;
      item.creditCount++;
      item.isCredit = true;
    }

    // 🔥 PIX
    if (d.isPix) {
      item.pixAmount += d.saleAmount;
      item.pixCount++;
      item.isPix = true;
    }

    // 🔥 VOUCHER
    if (d.isVoucher) {
      item.voucherAmount += d.saleAmount;
      item.voucherCount++;
      item.isVoucher = true;
    }
  });

  return Array.from(map.values()).sort(
    (a, b) => a.sortingDate.getTime() - b.sortingDate.getTime(),
  );
}

// export const mockSalesCalendar: SalesCalendar[] = Array.from({
//   length: 30,
// }).map((_, i) => {
//   const date = new Date();
//   date.setDate(date.getDate() - i);

//   return {
//     sortingDate: date,
//     amount: 100 + i * 10,

//     debitAmount: 30,
//     debitCount: 1,

//     creditAmount: 70,
//     creditCount: 1,

//     voucherAmount: 0,
//     voucherCount: 0,

//     pixAmount: 0,
//     pixCount: 0,
//   } as SalesCalendar;
// });

/* =========================
   DETAILS
========================= */

export const mockDetails: SalesDetail[] = baseDates.flatMap((d, i: number) =>
  ESTABLISHMENTS.map((e) => {
    const paymentType = ['Crédito', 'Débito', 'Pix'][i % 3];
    const settlement = getSettlement(paymentType);

    return {
      documentNumber: e.documentNumber,

      saleDate: d.date,
      paymentDate: addDays(d.date, settlement),

      saleAmount: d.amount,
      paymentAmount: d.amount * 0.95,

      cardBrand: e.brands[i % e.brands.length],

      authorizationCode: `AUTH-${i}`,
      nsu: nextNSU(),

      terminalNumber: `T-${i}`,
      discountFee: d.amount * 0.05,

      isCancelled: false,

      paymentType,

      isDebit: paymentType === 'Débito',
      isCredit: paymentType === 'Crédito',
      isPix: paymentType === 'Pix',
      isVoucher: false,
      isInstallments: false,

      debitAmount: 0,
      debitCount: 0,
      creditAmount: 0,
      creditCount: 0,
      voucherAmount: 0,
      voucherCount: 0,
      pixAmount: 0,
      pixCount: 0,
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
  debitCountPercent: percent(debitCount, totalCount),

  creditAmount,
  creditAmountPercent: percent(creditAmount, totalAmount),
  creditCount,
  creditCountPercent: percent(creditCount, totalCount),

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

/* =========================
   EXCEL HELPERS
========================= */

function buildCsv(content: any[]): string {
  if (!content.length) return '';

  const headers = Object.keys(content[0]).join(',');

  const rows = content.map((item) =>
    Object.values(item)
      .map((v) => `"${v ?? ''}"`)
      .join(','),
  );

  return [headers, ...rows].join('\n');
}

export function buildSalesDetailExcelBlob(data: any[]): Blob {
  const csv = buildCsv(data);

  return new Blob([csv], {
    type: 'application/vnd.ms-excel',
  });
}

export function buildSalesCalendarExcelBlob(data: any[]): Blob {
  const csv = buildCsv(data);

  return new Blob([csv], {
    type: 'application/vnd.ms-excel',
  });
}
