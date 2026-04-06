export interface CalendarEvent {
  date: Date;
  label: string;
  amount?: number;
  status?: string;
}

export interface CalendarMonth {
  month: number; // 0-11
  year: number;
  weeks: Date[][]; // inclui dias do mês anterior/seguinte para preencher a grade
}
