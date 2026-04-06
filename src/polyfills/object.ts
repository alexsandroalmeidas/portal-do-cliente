import { isEmpty } from 'lodash';

export {};

declare global {
  type EmptyObject<T> = { [K in keyof T]?: never };
  type EmptyObjectOf<T> = EmptyObject<T> extends T ? EmptyObject<T> : never;

  interface ObjectConstructor {
    isEmpty<T>(
      value: T | null | undefined,
    ): value is EmptyObjectOf<T> | null | undefined;
  }
}

Object.isEmpty = <T>(
  value: T | null | undefined,
): value is EmptyObjectOf<T> | null | undefined => {
  return isEmpty(value);
};
