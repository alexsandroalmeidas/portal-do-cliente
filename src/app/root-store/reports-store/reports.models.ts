// export interface ReportSummary {
//   movementType: number;
//   movementTypeDescription: string;
//   initialDate: Date;
//   finalDate: Date;
//   documents: string;
//   grossValue: number;
//   netValue: number;
// }

export interface EquipmentChip {
  name: string;
}

export interface ReportRequest {
  id: number;
  requested: Date;
  executed: Date;
  requestedBy: string;
  status: number;
  progressStatus: string;
  progressValue: number;
  movementType: number;
  movementTypeDescription: string;
  initialDate: Date;
  finalDate: Date;
  documents: string;
  equipments: string;
  grossValue: number;
  netValue: number;
  qtdSales: number;
}

export interface RequestReport {
  initialDate: string;
  finalDate: string;
  uids: string[];
  userId: string;
  establishmentsToPush: { email: string; uid: string }[];
  equipments: string[];
}

export enum MovementType {
  Sales = 1,
  Receivables = 2,
  AllCards = 3
}

export enum MovementTypeDescription {
  Sales = 'Vendas',
  Receivables = 'Recebimentos',
  AllCards = 'Todos Cartões'
}
