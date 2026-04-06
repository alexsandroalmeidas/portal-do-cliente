export type FilterSelection = 'today' | 'oneDay' | 'weekly' | 'monthly' | 'custom';
export type FilterTime = 'past' | 'future';

export interface PeriodFilter {
  initialDate: string;
  finalDate: string;
}

export interface LabelFilter {
  oneDay: string;
  weekly: string;
  monthly: string;
}
