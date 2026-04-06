import { isFunction } from 'lodash';

export class FilterOption {
  constructor(
    public label: string,
    public key: string,
    public value?: any | ((...args: any[]) => any)) { }

  select(): SelectedOption {
    const { key: name } = this;

    const selectedOption: SelectedOption = {
      name,
      value: name
    };

    if (!!this.value) {
      selectedOption.value = isFunction(this.value)
        ? this.value(this)
        : this.value;
    }

    return selectedOption;
  }
}

export interface SelectedOption {
  name: string;
  value: any
};
