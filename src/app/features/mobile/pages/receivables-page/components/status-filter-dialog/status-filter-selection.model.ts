export interface PaymentStatusSelection {
  selected: boolean;
  status: string;
}

export const PaymentsStatus: string[] = [
  'APROVADA',
  'CANCELADA',
  'PAGO',
  'EM ABERTO',
  'ESTORNADA'
];
