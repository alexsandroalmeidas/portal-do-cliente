/* =========================
   DATABASE
========================= */

import { mockEstablishments } from '../administration-store/administration.mock';
import {
  ReceivablesSchedule,
  ReceivablesScheduleResponse,
  ReceivablesScheduleGroupingResponse,
  BankingAccount,
  GetRateResponse,
  GetAuthorizationResponse,
  FinalizePunctualResponse,
  FinalizeScheduledResponse,
  CancelScheduledPrepaymentResponse,
  GetHistoricResponse,
  GetAccreditationsResponse,
  GetScheduledFinalizedResponse,
} from './prepayments.models';

const now = new Date();

/* =========================
   ESTABLISHMENTS
========================= */

const ESTABLISHMENTS = [
  { uid: 'uid-123', documentNumber: '12345678000199' },
  { uid: 'uid-456', documentNumber: '98765432000188' },
];

/* =========================
   BANKING
========================= */

const BANKING: BankingAccount[] = [
  {
    documentNumber: '12345678000199',
    bankCode: 341,
    bank: 'Itaú',
    agency: 1234,
    accountNumber: 123456,
    checkDigitNumber: '6',
  },
  {
    documentNumber: '98765432000188',
    bankCode: 1,
    bank: 'Banco do Brasil',
    agency: 5678,
    accountNumber: 987654,
    checkDigitNumber: '0',
  },
];

/* =========================
   SCHEDULES
========================= */

const SCHEDULES: ReceivablesSchedule[] = Array.from({ length: 20 }).map(
  (_, i) => {
    const est = ESTABLISHMENTS[i % 2];

    const isFirst = est.documentNumber === '12345678000199';
    debugger;
    return {
      protocol: `PRT-${i}`,
      status: isFirst ? 'AVAILABLE' : 'PENDING',
      message: '',
      arScheduleId: i,

      documentNumberAccreditor: est.documentNumber,
      uid: est.uid,
      documentNumber: est.documentNumber,

      arrangementCode: isFirst ? 1 : 2,

      expectedDettlementDate: new Date(now.getTime() + (i + 1) * 86400000),
      paymentDate: new Date(now.getTime() + (i + (isFirst ? 2 : 4)) * 86400000),

      totalHolderValue: isFirst ? 1000 + i * 50 : 500 + i * 30,

      totalFreeValue: isFirst ? 800 + i * 40 : 300 + i * 20,

      days: i + 1,
      dailyRate: isFirst ? 0.05 : 0.08,
      feeValue: isFirst ? 10 : 20,
      rate: isFirst ? 2.5 : 3.2,

      prepaymentValue: isFirst ? 750 + i * 30 : 250 + i * 15,
    };
  },
);

/* =========================
   HELPERS (AQUI É O LUGAR CERTO)
========================= */

function getEst(uid: string) {
  return ESTABLISHMENTS.find((e) => e.uid === uid);
}

function getSchedules(uid: string) {
  return SCHEDULES.filter((s) => s.uid === uid);
}

function getBank(document: string) {
  return BANKING.filter((b) => b.documentNumber === document);
}

function filterSchedules(uid?: string, documentNumber?: string) {
  const documents = resolveDocuments(uid, documentNumber);

  return SCHEDULES.filter((s) => documents.includes(s.documentNumber));
}

function resolveDocuments(uid?: string, documentNumber?: string): string[] {
  // se veio document direto
  if (documentNumber) return [documentNumber];

  // se veio uid → buscar no establishment
  if (uid) {
    const est = mockEstablishments.find((e) => e.uid === uid);
    return est ? [est.documentNumber] : [];
  }

  // se não veio nada → retorna todos
  return mockEstablishments.map((e) => e.documentNumber);
}

function filterSchedulesMulti(uids?: string[], documentNumbers?: string[]) {
  const documents = resolveDocumentsMulti(uids, documentNumbers);

  return SCHEDULES.filter((s) => documents.includes(s.documentNumber));
}

function resolveDocumentsMulti(
  uids?: string[],
  documentNumbers?: string[],
): string[] {
  if (documentNumbers?.length) return documentNumbers;

  if (uids?.length) {
    return mockEstablishments
      .filter((e) => uids.includes(e.uid))
      .map((e) => e.documentNumber);
  }

  return mockEstablishments.map((e) => e.documentNumber);
}

/* =========================
   BUILDERS
========================= */

export function buildSchedule(
  uid?: string,
  documentNumber?: string,
): ReceivablesScheduleResponse {
  const schedules = filterSchedules(uid, documentNumber);

  const doc = documentNumber || schedules[0]?.documentNumber;

  return {
    timestamp: new Date(),
    error: '',
    message: '',
    schedules,
    bankingAccounts: getBank(doc),
  };
}

export function buildGrouping(
  uid?: string,
  documentNumber?: string,
): ReceivablesScheduleGroupingResponse {
  debugger;
  const schedules = filterSchedules(uid, documentNumber);

  const doc = documentNumber || schedules[0]?.documentNumber;

  return {
    timestamp: new Date(),
    error: '',
    message: '',
    documentNumber: doc,
    totalValue: schedules.reduce((s, x) => s + x.totalHolderValue, 0),
    availableValue: schedules.reduce((s, x) => s + x.totalFreeValue, 0),
    schedules,
    bankingAccount: getBank(doc)[0],
    available: schedules.length > 0,
  };
}

export function buildRate(): GetRateResponse {
  return {
    timestamp: new Date(),
    error: '',
    message: '',
    rate: 2.5,
    maxLimit: 10000,
    minLimit: 100,
  };
}

export function buildAuthorization(): GetAuthorizationResponse {
  return {
    timestamp: new Date(),
    error: '',
    message: '',
    hasAuthorization: true,
  };
}

export function buildFinalizePunctual(
  uid?: string,
  documentNumber?: string,
): FinalizePunctualResponse {
  const schedules = filterSchedules(uid, documentNumber);

  return {
    timestamp: new Date(),
    error: '',
    message: '',
    schedules: schedules.map((s) => ({
      uid: s.uid,
      id: s.arScheduleId,
      success: true,
    })),
  };
}

export function buildFinalizeScheduled(uid: string): FinalizeScheduledResponse {
  const est = getEst(uid)!;

  return {
    timestamp: new Date(),
    error: '',
    message: '',
    documentNumber: est.documentNumber,
    id: 'SCH-1',
    success: true,
  };
}

export function buildCancelScheduled(
  uid: string,
): CancelScheduledPrepaymentResponse {
  const est = getEst(uid)!;

  return {
    timestamp: new Date(),
    error: '',
    message: '',
    documentNumber: est.documentNumber,
    success: true,
  };
}

export function buildHistoric(
  uid?: string,
  documentNumber?: string,
): GetHistoricResponse {
  const schedules = filterSchedules(uid, documentNumber);

  return {
    timestamp: new Date(),
    error: '',
    message: '',
    schedules: schedules.map((s, i) => ({
      code: `HIS-${i}`,
      email: 'teste@email.com',
      channel: 'WEB',
      isPunctual: true,
      registrationDate: new Date(),
      status: 1,
      statusDescription: 'Finalizado',
      prepaymentValue: s.prepaymentValue,
    })),
  };
}

export function buildAccreditations(): GetAccreditationsResponse {
  return {
    timestamp: new Date(),
    error: '',
    message: '',
    accreditations: [
      {
        documentNumber: '01027058000191',
        name: 'Cielo',
        iconName: 'cielo',
        accreditationName: 'Cielo',
      },
      {
        documentNumber: '16501555000157',
        name: 'Stone',
        iconName: 'stone',
        accreditationName: 'Stone',
      },
    ],
  };
}

export function buildScheduledFinalized(
  uid: string,
): GetScheduledFinalizedResponse {
  return {
    timestamp: new Date(),
    error: '',
    message: '',

    id: 'SCH-1',
    documentNumber: '12345678000199',

    bankCode: 341,
    bank: 'Itaú',
    agency: 1234,
    accountNumber: 123456,
    checkDigitNumber: '6',

    rate: 2.5,
    maxLimit: 10000,
    minLimit: 100,

    initialDate: new Date(),

    frequencyType: 'weekly',
    daysOfWeek: [1, 3, 5],
    daysOfMonth: [],

    accreditations: ['Cielo', 'Stone'],
  };
}
