export {};

declare global {
  interface Number {
    toFixedString(fractionDigits: number): string;
  }
}

Number.prototype.toFixedString = function (fractionDigits: number) {
  const num = this;

  const decimalZero = `.${''.padEnd(fractionDigits, '0')}`;
  const result = num.toFixed(fractionDigits).replace(decimalZero, '');

  if (isNaN(+result)) {
    return '0';
  }

  return result;
};
