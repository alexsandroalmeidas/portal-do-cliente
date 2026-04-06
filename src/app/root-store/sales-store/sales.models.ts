export interface Transaction {
  account: string;
  acquirerBranch: string;
  administrationFeeValue: number;
  agency: number;
  authorizationCode: string;
  bank: number;
  branchCodePayware: number;
  captureMethodDescription: string;
  captureMethodId: number;
  cardBrandDescription: string;
  cardBrandId: number;
  cardNumber: string;
  commerceCodePayware: number;
  country: string;
  discountAmount: number;
  discountInstallmentAmount: number;
  envolopeId: number;
  establishmentCode: string;
  grossInstallmentValue: number;
  grossSaleValue: number;
  installmentNsu: number;
  installmentNumber: number;
  installmentStatusId: number;
  installmentsTotalNumber: number;
  interchangeFeeValueTariff: number;
  mcc: number;
  multiborderReducingValue: number;
  netAmountInstallment: number;
  netSaleValue: number;
  nsu: number;
  paymentAccountNumber: number;
  paymentDate: Date;
  paymentIdPayware: number;
  paywareFinancialId: number;
  prepaymentFeeValue: number;
  prepaymentIdPayware: number;
  prepaymentNetValue: number;
  productDescription: string;
  productId: number;
  productTypeDescription: string;
  productTypeId: number;
  registerCode: string;
  releaseTypeDescription: string;
  releaseTypeId: number;
  requestCode: string;
  terminalNumber: string;
  trace: number;
  transactionDate: Date;
  saleDate: Date;
  transactionId: number;
  transactionStatusDescription: string;
  transactionStatusId: number;
  transactionTypeDescription: string;
  transactionTypeId: number;
  userCodeStatus?: number;
  valueInterchangeFeeInstallmentFee: number;
  paymentValue: number;
  paymentStatus: string;
  paymentType: string;

  isCancelled: boolean;
  cancellationDate?: Date;
  cancellationValue: number;

  // Campo apenas usado na tela
  sortingDate: Date;

  isDebit: boolean;
  isPrepaidDebit: boolean;
  isCredit: boolean;
  isPrepaidCredit: boolean;
  isVoucher: boolean;
  isPix: boolean;
  isInstallments: boolean;
}

export interface SummaryCardSales {
  totalAmount: number;
  totalCount: number;
  debitAmount: number;
  debitAmountPercent: string;
  debitCount: number;
  debitPercent: string;
  creditAmount: number;
  creditAmountPercent: string;
  creditCount: number;
  creditPercent: string;
  voucherAmount: number;
  voucherAmountPercent: string;
  voucherCount: number;
  voucherCountPercent: string;
  approvedCount: number;
  approvedAmount: number;
  pixAmount: number;
  pixAmountPercent: string;
  pixCount: number;
  pixCountPercent: string;
}

export interface SalesWeeklySummary {
  date: Date;
  totalAmount: number;
  totalCount: number;
}

export interface SalesCalendar {
  day: number;
  month: number;
  year: number;
  yearMonthDay: string;
  paymentStatus: string;
  amount: number;
  sortingDate: Date;
  paymentDate?: Date;
  isCancelled: boolean;
  debitAmount: number;
  debitCount: number;
  prepaidDebitAmount: number;
  prepaidDebitCount: number;
  creditAmount: number;
  creditCount: number;
  internationalCreditAmount: number;
  internationalCreditCount: number;
  prepaidCreditAmount: number;
  prepaidCreditCount: number;
  voucherAmount: number;
  voucherCount: number;
  installmentsAmount: number;
  installmentsCount: number;
  pixAmount: number;
  pixCount: number;
  isDebit: boolean;
  isPrepaidDebit: boolean;
  isCredit: boolean;
  isPrepaidCredit: boolean;
  isInternationalCredit: boolean;
  isVoucher: boolean;
  isPix: boolean;
  isInstallments: boolean;
}

export interface SalesDetail {
  documentNumber: string;
  saleDate: Date | string;
  paymentDate: Date;
  saleAmount: number;
  paymentAmount: number;
  cardBrand: string;
  paymentType: string;
  authorizationCode: string;
  nsu: string;
  status: string;
  terminalNumber: string;
  discountFee: number;
  prepaymentFeeValue: number;
  cancellationDate?: Date;
  cancellationValue: number;
  cardNumber: string;
  isCancelled: boolean;
  debitAmount: number;
  debitCount: number;
  prepaidDebitAmount: number;
  prepaidDebitCount: number;
  creditAmount: number;
  creditCount: number;
  prepaidCreditAmount: number;
  prepaidCreditCount: number;
  internationalCreditAmount: number;
  internationalCreditCount: number;
  voucherAmount: number;
  voucherCount: number;
  installmentsAmount: number;
  installmentsCount: number;
  pixAmount: number;
  pixCount: number;
  isDebit: boolean;
  isPrepaidDebit: boolean;
  isCredit: boolean;
  isPrepaidCredit: boolean;
  isInternationalCredit: boolean;
  isVoucher: boolean;
  isPix: boolean;
  isInstallments: boolean;
  groupKey?: string;
}

export interface SummaryLastSales {
  documentNumber: string;
  saleDate: Date;
  saleAmount: number;
  paymentAmount: number;
  cardBrand: string;
  paymentType: string;
  authorizationCode: string;
  nsu: number;
  status: string;
  terminalNumber: string;
  discountFee: number;
  prepaymentFeeValue: number;
  cancellationDate?: Date;
  cancellationValue: number;
  cardNumber: string;
  isCancelled: boolean;
}

export interface SummarySales {
  label: string;
  count: number;
  countPercent: string;
  amount: number;
  amountPercent: string;
}

export interface SalesDetailFiltersOptions {
  cardBrands: string[];
  paymentTypes: string[];
  status: string[];
  nsus: string[];
  salesTimes: string[];
}

export interface LastUpdateDateSales {
  lastUpdateDate: Date;
}
