import {
  chunk,
  Comparator2,
  Dictionary,
  differenceWith,
  groupBy,
  isEmpty,
  isEqual,
  ListIteratee,
  Many,
  sortBy,
  sum,
  sumBy,
  uniq,
  uniqBy,
  ValueIteratee,
} from 'lodash';

export {};

declare global {
  type predicate<T> = (arg: T) => boolean;
  type ArrayIterator<T, TResult> = (
    value: T,
    index: number,
    collection: T[],
  ) => TResult;

  interface Array<T> {
    chunk(size?: number): T[][];
    sum(): number;
    sumBy(iteratee?: ((value: T) => number) | string): number;
    groupBy(iteratee?: ValueIteratee<T>): Dictionary<T[]>;
    uniq(): T[];
    uniqBy(iteratee?: ValueIteratee<T>): T[];
    sortBy(...iteratees: Array<Many<ListIteratee<T>>>): T[];
    firstOrDefault<T>(predicate: predicate<T>): T;
    random(): T;
    differenceWith(array: T[], comparator?: Comparator2<T, any>): T[];
    put(predicate: ArrayIterator<T, boolean>, newValue: T): void;
    putAt(index: number, newValue: T): void;
  }

  interface ArrayConstructor {
    isEmpty<T>(arr: T[]): boolean;
  }
}

Array.prototype.chunk = function (size?: number): any[][] {
  return chunk(this, size);
};

Array.prototype.sum = function (): number {
  return sum(this);
};

Array.prototype.sumBy = function (
  iteratee?: ((value: any) => number) | string,
): number {
  return sumBy(this, iteratee);
};

Array.prototype.groupBy = function (
  iteratee?: ValueIteratee<any>,
): Dictionary<any[]> {
  return groupBy(this, iteratee);
};

Array.prototype.uniqBy = function (iteratee: ValueIteratee<any>): any[] {
  return uniqBy(this, iteratee);
};

Array.prototype.uniq = function <T>(): T[] {
  return uniq(this);
};

Array.prototype.sortBy = function (
  ...iteratees: Array<Many<ListIteratee<any>>>
): any[] {
  return sortBy(this, ...iteratees);
};

Array.prototype.firstOrDefault = function <T>(predicate: predicate<T>) {
  return this.reduce((accumulator: T, currentValue: T) => {
    if (!accumulator && predicate(currentValue)) {
      accumulator = currentValue;
    }

    return accumulator;
  }, null);
};

Array.prototype.random = function () {
  return this[Math.floor(Math.random() * this.length)];
};

Array.isEmpty = function (arr: any[]): boolean {
  return isEmpty(arr);
};

Array.prototype.differenceWith = function <T>(
  array: T[],
  comparator: Comparator2<T, any> = isEqual,
): T[] {
  return differenceWith(array, this, comparator);
};

Array.prototype.put = function <T>(
  predicate: ArrayIterator<T, boolean>,
  newValue: T,
): void {
  const index = this.findIndex(predicate);
  this.putAt(index, newValue);
};

Array.prototype.putAt = function <T>(index: number, newValue: T): void {
  if (~index) {
    this[index] = newValue;
    return;
  }

  this.push(newValue);
};
