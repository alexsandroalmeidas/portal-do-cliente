export interface Statement {
  documentNumber: string;
  fileName: string;
  createdDate: Date;

  initialDate: string;
  finalDate: string;
  uids: string[];
}

export interface StatementScheduling {
  documentNumber: string;
  createdDate: Date;
  initialDate: Date;
  finalDate: Date;
}

export interface StatementSchedulingRequest {
  initialDate: string;
  finalDate: string;
  uids: string[];
}