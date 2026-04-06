export interface EnumEntry {
  key: string;
  value: string;
}

enum EnumBase { }

export function enumToArray<T1 extends typeof EnumBase>(e1: T1): EnumEntry[] {
  return Object.entries(e1)
    .map(([key, value]) => ({ key, value }));
}
