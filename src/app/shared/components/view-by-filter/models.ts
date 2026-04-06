export type FilterSelection = 'detail' | 'calendar' | 'custom';

export interface PeriodFilter {
  initialDate: string;
  finalDate: string;
}

export interface LabelFilter {
  oneDay: string;
  weekly: string;
  monthly: string;
}
