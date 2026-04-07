/* =========================
   IMPORTS
========================= */

import { Statement, StatementScheduling } from './statements.models';
import { mockEstablishments } from '../administration-store/administration.mock';

/* =========================
   HELPERS
========================= */

function resolveDocuments(uids?: string[]): string[] {
  if (!uids || !uids.length) return [];

  return mockEstablishments
    .filter((e) => uids.includes(e.uid))
    .map((e) => e.documentNumber);
}

function randomDate(daysAgo: number) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d;
}

/* =========================
   MOCK DATABASE
========================= */

const STATEMENTS_DB: Statement[] = [
  // CNPJ 1
  {
    documentNumber: '12345678000199',
    fileName: 'extrato_001.txt',
    createdDate: randomDate(1),
    initialDate: '2026-04-01',
    finalDate: '2026-04-05',
    uids: ['uid-123'],
  },
  {
    documentNumber: '12345678000199',
    fileName: 'extrato_002.txt',
    createdDate: randomDate(3),
    initialDate: '2026-03-25',
    finalDate: '2026-03-30',
    uids: ['uid-123'],
  },

  // CNPJ 2
  {
    documentNumber: '98765432000188',
    fileName: 'extrato_003.txt',
    createdDate: randomDate(2),
    initialDate: '2026-04-02',
    finalDate: '2026-04-06',
    uids: ['uid-456'],
  },
  {
    documentNumber: '98765432000188',
    fileName: 'extrato_004.txt',
    createdDate: randomDate(5),
    initialDate: '2026-03-20',
    finalDate: '2026-03-25',
    uids: ['uid-456'],
  },
];

/* =========================
   SCHEDULING DATABASE
========================= */

const SCHEDULING_DB: StatementScheduling[] = [
  {
    documentNumber: '12345678000199',
    createdDate: new Date(),
    initialDate: randomDate(10),
    finalDate: randomDate(5),
  },
  {
    documentNumber: '98765432000188',
    createdDate: new Date(),
    initialDate: randomDate(8),
    finalDate: randomDate(2),
  },
];

/* =========================
   FILTERS
========================= */

export function getStatements(uids: string[]): Statement[] {
  const docs = resolveDocuments(uids);

  return STATEMENTS_DB.filter((s) => docs.includes(s.documentNumber));
}

export function getLastScheduling(uids: string[]): StatementScheduling[] {
  const docs = resolveDocuments(uids);

  return SCHEDULING_DB.filter((s) => docs.includes(s.documentNumber));
}

/* =========================
   FILE MOCKS
========================= */

export function getFileTxt(fileName: string): Blob {
  return new Blob([`TXT MOCK - ${fileName}`], { type: 'text/plain' });
}

export function getFileXml(fileName: string): Blob {
  return new Blob([`<xml>${fileName}</xml>`], { type: 'text/xml' });
}

export function validateUpload(): Blob {
  return new Blob(['VALIDATION OK'], {
    type: 'application/vnd.ms-excel',
  });
}
