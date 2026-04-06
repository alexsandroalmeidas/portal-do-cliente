import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CalendarEvent, CalendarMonth } from './calendar.models';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent {
  @Input() events: CalendarEvent[] = [];
  @Input() startYear: number = new Date().getFullYear();
  @Input() startMonth: number = new Date().getMonth();

  currentDate!: Date;
  currentYear!: number;
  currentMonthIndex!: number;
  currentMonth!: CalendarMonth;

  /** seleção múltipla (toggle) */
  private selectedDates = new Set<string>();

  @Output() outCurrentDate = new EventEmitter<Date>();
  @Output() selectedDays = new EventEmitter<Set<string>>();

  ngOnInit() {
    this.currentYear = this.startYear;
    this.currentMonthIndex = this.startMonth;
    this.currentDate = new Date(this.currentYear, this.currentMonthIndex, 1);
    this.currentMonth = this.generateMonth(this.currentYear, this.currentMonthIndex);

    // opcional: já marcar “hoje” como selecionado
    // this.selectedDates.add(this.toYMD(new Date()));
    this.selectedDays.emit(this.selectedDates);
  }

  get monthName(): string {
    return this.currentDate.toLocaleString('pt-BR', { month: 'long' });
  }

  /** Gera as semanas com dias de fora do mês preenchidos */
  generateMonth(year: number, month: number): CalendarMonth {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0); // último dia do mês
    const firstWeekday = firstDay.getDay(); // 0=dom .. 6=sáb
    const prevMonthLastDate = new Date(year, month, 0).getDate();

    const weeks: Date[][] = [];
    let week: Date[] = [];

    // dias do mês anterior para preencher o começo
    for (let i = firstWeekday - 1; i >= 0; i--) {
      const dayNum = prevMonthLastDate - i;
      week.push(new Date(year, month - 1, dayNum));
    }

    // dias do mês corrente
    for (let day = 1; day <= lastDay.getDate(); day++) {
      week.push(new Date(year, month, day));
      if (week.length === 7) {
        weeks.push(week);
        week = [];
      }
    }

    // dias do próximo mês para completar a última semana
    if (week.length > 0) {
      let nextDay = 1;
      while (week.length < 7) {
        week.push(new Date(year, month + 1, nextDay++));
      }
      weeks.push(week);
    }

    return { month, year, weeks };
  }

  prevMonth() {
    this.currentMonthIndex--;
    if (this.currentMonthIndex < 0) {
      this.currentMonthIndex = 11;
      this.currentYear--;
    }
    this.updateCalendar();
  }

  nextMonth() {
    this.currentMonthIndex++;
    if (this.currentMonthIndex > 11) {
      this.currentMonthIndex = 0;
      this.currentYear++;
    }
    this.updateCalendar();
  }

  prevYear() {
    this.currentYear--;
    this.updateCalendar();
  }

  nextYear() {
    this.currentYear++;
    this.updateCalendar();
  }

  private updateCalendar() {
    this.currentDate = new Date(this.currentYear, this.currentMonthIndex, 1);
    this.outCurrentDate.emit(this.currentDate);
    this.currentMonth = this.generateMonth(this.currentYear, this.currentMonthIndex);
    // se quiser limpar seleção ao trocar de mês, descomente:
    this.selectedDates.clear();
  }

  // ---------- helpers de UI ----------
  toYMD(d: Date): string {
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  isToday(date: Date): boolean {
    const t = new Date();
    return this.toYMD(date) === this.toYMD(t);
  }

  isSelected(date: Date): boolean {
    return this.selectedDates.has(this.toYMD(date));
  }

  isWeekend(date: Date): boolean {
    const dow = date.getDay();
    return dow === 0 || dow === 6; // domingo ou sábado
  }

  /** dia que NÃO pertence ao mês corrente mostrado */
  isOutside(date: Date): boolean {
    return date.getMonth() !== this.currentMonthIndex || date.getFullYear() !== this.currentYear;
  }

  onDayClick(date: Date) {
    // toggle; bloqueia clique em dias fora do mês, se preferir permitir é só remover o if
    if (this.isOutside(date)) return;
    const key = this.toYMD(date);
    if (this.selectedDates.has(key)) {
      this.selectedDates.delete(key);
    } else {
      this.selectedDates.add(key);
    }

    this.selectedDays.emit(this.selectedDates);
  }

  getEventsForDate(date: Date) {
    const key = this.toYMD(date);

    return this.events.filter((e) => this.toYMD(e.date) === key);
  }
}
