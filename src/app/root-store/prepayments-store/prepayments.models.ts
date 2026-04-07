export interface PrepaymentBaseResponse {
  timestamp: Date;
  error: string;
  message: string;
}

export interface ReceivablesScheduleResponse extends PrepaymentBaseResponse {
  schedules: ReceivablesSchedule[];
  bankingAccounts: BankingAccount[];
}

export interface ReceivablesScheduleGroupingResponse extends PrepaymentBaseResponse {
  documentNumber: string;
  availableValue: number;
  totalValue: number;
  schedules: ReceivablesSchedule[];
  bankingAccount: BankingAccount;
  available: boolean;
}

export interface ReceivablesSchedule {
  protocol: string;
  status: string;
  message: string;
  arScheduleId: number;
  documentNumberAccreditor: string;
  uid: string;
  documentNumber: string;
  arrangementCode: number;
  expectedDettlementDate: Date;
  totalHolderValue: number;
  totalFreeValue: number;
  paymentDate: Date;
  days: number;
  dailyRate: number;
  feeValue: number;
  rate: number;
  prepaymentValue: number;
}

export interface BankingAccount {
  documentNumber: string;
  bankCode: number;
  bank: string;
  agency: number;
  accountNumber: number;
  checkDigitNumber: string;
}

export interface BankingAccountResponse extends PrepaymentBaseResponse {
  bankingAccounts: BankingAccount[];
}

export interface FinalizePunctualResponse extends PrepaymentBaseResponse {
  schedules: FinalizePunctual[];
}

export interface FinalizePunctual {
  uid: string;
  id: number;
  success: boolean;
}

export interface FinalizePunctualRequest {
  uid: string;
  arScheduleId: number;
}

export interface FinalizeScheduledRequest {
  uid: string;
  rate: number;
  maxLimit: number;
  minLimit: number;
  frequency: string;
  daysOfWeek: number[];
  daysOfMonth: number[];
  accreditations: string[];
}

export interface FinalizeScheduledResponse extends PrepaymentBaseResponse {
  documentNumber: string;
  id: string;
  success: boolean;
}

export interface CancelScheduledPrepaymentResponse extends PrepaymentBaseResponse {
  documentNumber: string;
  success: boolean;
}

export interface PunctualDetail {
  prepaymentTotalAmount: number;
  totalAmount: number;
  rate: number;
  bankingAccount: BankingAccount;
  schedule: ReceivablesSchedule;
}

export interface GetRateResponse extends PrepaymentBaseResponse {
  rate: number;
  maxLimit: number;
  minLimit: number;
}

export interface PrepaymentRate {
  rate: number;
  maxLimit: number;
  minLimit: number;
}

export interface GetAuthorizationResponse extends PrepaymentBaseResponse {
  hasAuthorization: boolean;
}

export interface GetAuthorizeResponse extends PrepaymentBaseResponse {}

export interface GetScheduledFinalizedResponse extends PrepaymentBaseResponse {
  id: string;
  documentNumber: string;
  bankCode: number;
  bank: string;
  agency: number;
  accountNumber: number;
  checkDigitNumber: string;
  rate: number;
  maxLimit: number;
  minLimit: number;
  initialDate: Date;
  frequencyType: string;
  daysOfWeek: number[];
  daysOfMonth: number[];
  accreditations: string[];
}

export type PrepaymentsViewMode =
  | 'initial'
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'weekly-accreditations'
  | 'monthly-accreditations'
  | 'daily-accreditations'
  | 'weekly-check'
  | 'monthly-check'
  | 'daily-check';

export interface SelectionModelDay {
  day: number;
  description: string;
  descriptionDay: string;
  selected: boolean;
}

export interface FinalCheck {
  viewMode: PrepaymentsViewMode;
  selectionDescription: string;
  isCancel: boolean;
  isEdit: boolean;
  isActivate: boolean;
  isContinue: boolean;
  bankingAccount: BankingAccount;
  scheduledMode: string;
  daysOfWeek: number[];
  daysOfMonth: number[];
  frequency: string;
}

export interface GetHistoricResponse extends PrepaymentBaseResponse {
  schedules: GetHistoricItemResponse[];
}

export interface GetHistoricItemResponse {
  code: string;
  email: string;
  channel: string;
  isPunctual: boolean;
  registrationDate: Date;
  status: number;
  statusDescription: string;
  prepaymentValue: number;
}

export interface GetAccreditationsResponse extends PrepaymentBaseResponse {
  accreditations: GetAccreditationsItemResponse[];
}

export interface GetAccreditationsItemResponse {
  documentNumber: string;
  name: string;
  iconName: string;
  accreditationName: string;
}

export function getAccreditationName(documentNumber: string) {
  switch (documentNumber) {
    case '01027058000191':
      return 'Cielo';
    case '59158642000166':
      return 'Edenred';
    case '10440482000154':
      return 'GetNet';
    case '01425787000104':
      return 'Redecard';
    case '16501555000157':
      return 'Stone';
    default:
      return '';
  }
}

export interface SaveLeadResponse {
  success: boolean;
  error: string;
}

export enum LeadAction {
  authorizationPrepayment = 0,
  punctualPrepayment = 1,
  scheduledPrepayment = 2,
}
