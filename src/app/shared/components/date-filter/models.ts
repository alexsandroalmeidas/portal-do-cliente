export type FilterSelection = 'week' | 'month' | 'threeMonths' | 'year' | 'custom';
export type FilterTime = 'past' | 'future';

export interface DateFilter {
  initialDate: string;
  finalDate: string;
}

export interface LabelFilter {
  week: string;
  month: string;
  threeMonths: string;
  year: string;
}
