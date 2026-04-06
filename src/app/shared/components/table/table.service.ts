import { CurrencyPipe, DatePipe } from '@angular/common';
import { Injectable, QueryList } from '@angular/core';
import { TablePagination } from '../../models/table.model';
import { SortableHeaderDirective, SortEvent } from './sort';

@Injectable()
export class TableService {
  constructor() {}

  paginate(tablePagination: TablePagination, source: any[] = []) {
    const pageIndex = tablePagination.page - 1;

    const start = pageIndex * tablePagination.itemsPerPage;
    const end = start + tablePagination.itemsPerPage;

    return source.slice(start, end);
  }

  sort(
    { column, direction }: SortEvent,
    headers: QueryList<SortableHeaderDirective>,
    source: any[] = [],
  ) {
    const compare = (v1: any, v2: any) => (v1 < v2 ? -1 : v1 > v2 ? 1 : 0);

    if (!!headers) {
      headers.forEach((header) => {
        if (header.sortable !== column) {
          header.direction = '';
        }
      });
    }

    // sorting items
    if (direction === '' || column === '') {
      return source;
    }

    return [...source].sort((a, b) => {
      const res = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }

  private cleanValue(value: string = ''): string {
    return (value || '').replace(/[^\d]/g, '').trim().slice(0, 14);
  }

  filter<T>(text: string, source: T[] = []): T[] {
    if (!text) {
      return [...source];
    }

    const fields: string[] = Object.keys(source[0] || {});
    const term = text.removeDiacritics().toLowerCase();
    const datePipe = new DatePipe('pt-Br');
    const currencyPipe = new CurrencyPipe('pt-Br');
    const numberTerm = text.replace(/\D/gi, '');

    let fieldValue = null;

    return source.filter((item) => {
      return fields.some((field) => {
        fieldValue = (item as any)[field];

        if (!fieldValue || Array.isArray(fieldValue)) {
          return false;
        }

        if (
          `${fieldValue}`
            .removeDiacritics()
            .toLowerCase()
            .includes(`${term}`.removeDiacritics())
        ) {
          return true;
        }

        if (numberTerm && `${fieldValue}`.includes(numberTerm)) {
          return true;
        }

        if (
          !isNaN(fieldValue) &&
          fieldValue !== true &&
          fieldValue !== false &&
          !!term
        ) {
          const currencyPipeAux = currencyPipe.transform(
            fieldValue,
            'BRL',
            'symbol',
            '1.2-2',
          );
          return currencyPipeAux === null
            ? null
            : currencyPipeAux.includes(term);
        }

        if (`${fieldValue}`.isValidDate()) {
          const datePipeAux = datePipe.transform(
            fieldValue,
            'dd/MM/yyyy HH:mm:ss',
          );
          return datePipeAux === null ? null : datePipeAux.includes(term);
        }

        return false;
      });
    });
  }
}
