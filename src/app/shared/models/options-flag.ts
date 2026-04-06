export type OptionsFlags<T> = {
  [Property in keyof T]: any;
};
