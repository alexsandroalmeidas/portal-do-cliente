export interface Receivable {
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
  isAdjust: boolean;
  isPix: boolean;

  ///1 = Ajuste a Crédito 2 = Ajuste a Débito
  releaseType: number;

  releaseValue: number;
  releaseDate?: Date;
  releaseDescription?: string;
  // Campo apenas usado na tela
  sortingDate: Date;
}

export interface ReceivableCalendar {
  day: number;
  month: number;
  year: number;
  yearMonthDay: string;
  paymentStatus: string;
  amount: number;
  sortingDate: Date;
  paymentDate?: Date;
  receivablesPrepaymentAmount: number;
  receivablesCreditAmount: number;
  isCancelled: boolean;
  isAdjust: boolean;
  isPix: boolean;
  adjustmentsCredits: ReceivableCalendarAdjustment[];
  adjustmentsDebits: ReceivableCalendarAdjustment[];
}

export interface ReceivableCalendarAdjustment {
  description: string;
  amount: number;
}

export interface ReceivableDetail {
  bank: number;
  agency: number;
  account: string;
  paymentDate: string;
  saleAmount: number;
  paymentAmount: number;
  paymentValue: number;
  discountFee: number;
  cardBrand: string;
  paymentType: string;
  authorizationCode: string;
  nsu: number;
  paymentStatus: string;
  saleDate: Date;
  saleTime: string;
  terminalNumber: string;
  prepaymentFeeAmount: number;
  isCancelled: boolean;
  isAdjust: boolean;
  isPix: boolean;
  adjustmentType: number;
  adjustmentAccountingSection: string;
  sortingDate: Date;
  releaseTypeDescription: string;
  releaseValue: number;
  releaseDate: Date;
  releaseDescription: string;
  originPix: string;
  installmentNumber: number;
  grossInstallmentValue: number;
  prepaymentFeeValue: number;
}

export interface ReceivableWeeklySummary {
  date: Date;
  amount: number;
  status: string;
}

export interface BankingAccount {
  bank: number;
  agency: number;
  account: string;
  amount: number;
  isPix: boolean;
  originPix: string;
}

export interface Adjustment {
  account: string;
  adjustmentCode: number;
  adjustmentTransactionDate?: Date;
  adjustmentType: number;
  agency: number;
  bank: number;
  branchCodePayware: number;
  captureMethodDescription: string;
  captureMethodId: number;
  cardBrandDescription: string;
  cardBrandId: number;
  commerceCodePayware: number;
  descriptionReasonAdjustment: string;
  discountAmount: number;
  envolopeId: number;
  establishmentCode: string;
  grossSaleValue: number;
  id: number;
  installmentNumber: number;
  mcc: number;
  netSaleValue: number;
  nsu: number;
  nsuOriginal: number;
  originalCardNumber: string;
  originalTransactionDate: Date;
  paymentAccountNumber: number;
  paymentIdPayware: number;
  paymentStatus: string;
  paywareAcquiringSubsidiary: number;
  paywareFinancialId: number;
  productDescription: string;
  productId: number;
  registerCode: string;
  releaseDate: Date;
  requestCode: string;
  trace: number;
  isCancelled: boolean;
}

export interface SummaryCardReceivables {
  totalAmount: number;
  totalCount: number;
  debitAmount: number;
  debitCount: number;
  debitPercent: string;
  creditAmount: number;
  creditCount: number;
  creditPercent: string;
  futureAmount: number;
  todayAmount: number;
  pixAmount: number;
  pixPercent: string;
}

export interface LastUpdateDateReceivables {
  lastUpdateDate: Date;
}
