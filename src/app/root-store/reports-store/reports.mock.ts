import { ReportRequest } from './reports.models';
import { mockEstablishments } from '../administration-store/administration.mock';

/* =========================
   HELPERS
========================= */

function resolveDocumentNumbers(uids?: string[]): string[] {
  if (!uids?.length) return [];

  return mockEstablishments
    .filter((e) => uids.includes(e.uid))
    .map((e) => e.documentNumber);
}

function buildCsv(data: any[]): string {
  if (!data.length) return '';

  const headers = Object.keys(data[0]).join(',');

  const rows = data.map((r) =>
    Object.values(r)
      .map((v) => `"${v ?? ''}"`)
      .join(','),
  );

  return [headers, ...rows].join('\n');
}

function buildExcelBlob(data: any[]): Blob {
  return new Blob([buildCsv(data)], {
    type: 'application/vnd.ms-excel',
  });
}

/* =========================
   MOCK REQUESTS DATABASE
========================= */

let idCounter = 1;

function createRequest(documentNumber: string): ReportRequest {
  return {
    id: idCounter++,
    requested: new Date(),
    executed: new Date(),
    requestedBy: 'user@test.com',

    status: 3,
    progressStatus: 'Concluído',
    progressValue: 100,

    movementType: 1,
    movementTypeDescription: 'Vendas',

    initialDate: new Date(),
    finalDate: new Date(),

    documents: documentNumber,
    equipments: 'POS',

    grossValue: Math.random() * 10000,
    netValue: Math.random() * 9000,
    qtdSales: Math.floor(Math.random() * 50),
  };
}

export const mockReportsDatabase: ReportRequest[] = [
  // CNPJ 1
  ...Array.from({ length: 4 }).map(() => createRequest('12345678000199')),

  // CNPJ 2
  ...Array.from({ length: 4 }).map(() => createRequest('98765432000188')),
];

/* =========================
   FILTER
========================= */

export function filterReports(uids?: string[]): ReportRequest[] {
  const docs = resolveDocumentNumbers(uids);

  return mockReportsDatabase.filter((r) => {
    if (!docs.length) return true;
    return docs.includes(r.documents);
  });
}

/* =========================
   EXCEL BUILDERS
========================= */

export function buildSalesExcel(id: number) {
  const data = mockReportsDatabase.filter((r) => r.id === id);
  return buildExcelBlob(data);
}

export function buildReceivablesExcel(id: number) {
  const data = mockReportsDatabase.filter((r) => r.id === id);
  return buildExcelBlob(data);
}

export function buildAllCardsExcel(id: number) {
  const data = mockReportsDatabase.filter((r) => r.id === id);
  return buildExcelBlob(data);
}
