import {
  AbstractControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  FormArray,
} from '@angular/forms';
import moment from 'moment';

export class FormValidators {
  public static dateIsGreatherThenOrEquals(
    startDateName: string,
    endDateName: string,
  ): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const formControls = formGroup;

      if (!formControls) {
        return null;
      }

      if (!startDateName) {
        throw new Error('O nome do controle 1 é obrigatório.');
      }

      if (!endDateName) {
        throw new Error('O nome do controle 2 é obrigatório.');
      }

      const startDateControl = formGroup.get(startDateName);

      if (!startDateControl) {
        throw new Error(
          `O controle ${startDateName} não existe no formulário.`,
        );
      }

      const endDateControl = formGroup.get(endDateName);

      if (!endDateControl) {
        throw new Error(`O controle ${endDateName} não existe no formulário.`);
      }

      this.clearControlErrors(startDateControl, 'dateIsGreatherThenOrEquals');
      this.clearControlErrors(endDateControl, 'dateIsGreatherThenOrEquals');

      const startDateControlValue: string | Date = startDateControl.value;
      const endDateControlValue: string | Date = endDateControl.value;

      if (!startDateControlValue && !endDateControlValue) {
        return null;
      }

      const startDate = moment(startDateControlValue);
      const endDate = moment(endDateControlValue);

      if (!startDate || !endDate) {
        startDateControl.setErrors({ dateIsGreatherThenOrEquals: true });
        endDateControl.setErrors({ dateIsGreatherThenOrEquals: true });
        return { dateIsGreatherThenOrEquals: true };
      }

      if (endDate.isBefore(startDate)) {
        startDateControl.setErrors({ dateIsGreatherThenOrEquals: true });
        endDateControl.setErrors({ dateIsGreatherThenOrEquals: true });
        return { dateIsGreatherThenOrEquals: true };
      }

      return null;
    };
  }

  public static allOrNoneFieldsRequired(...fields: string[]): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const formControls = formGroup;

      if (!formControls) {
        return null;
      }

      const controlKeys = Object.keys(formControls);

      if (fields.some((field) => !controlKeys.includes(field))) {
        return { allOrNoneFieldsRequired: true };
      }

      const controls = fields.map((key) => formGroup.get(key));

      if (!!controls) {
        controls.forEach((control) => {
          if (!!control)
            this.clearControlErrors(control, 'allOrNoneFieldsRequired');
        });
      }

      // if (!controls.values(value => !value) && !values.every(value => !!value)) {
      //   controls
      //     .forEach(control => {
      //       if (!!control)
      //         control.setErrors({ allOrNoneFieldsRequired: true });
      //     });

      //   return { allOrNoneFieldsRequired: true };
      // }

      return null;
    };
  }

  public static atLeastOneFieldFilled(min = 1): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const controls = formGroup;

      if (controls) {
        const keys = Object.keys(formGroup.value);

        if (!keys.length) {
          return { atLeastOneFieldFilled: true };
        }

        const totalValues = keys
          .map((key) => formGroup.value[key])
          .reduce((total, current) => {
            return !!current ? total + 1 : total;
          }, 0);

        return totalValues >= min ? null : { atLeastOneFieldFilled: true };
      }

      return null;
    };
  }

  private static clearControlErrors(control: AbstractControl, error: string) {
    const errors = Object.assign({}, control.errors);

    if (Object.keys(errors).includes(error)) {
      delete errors[error];
    }

    control.setErrors(!!Object.keys(errors).length ? errors : null);
  }

  public static checkFormValidations(formGroup: FormGroup | FormArray) {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);

      if (!!control) {
        control.markAsDirty();
        control.markAsTouched();

        if (control instanceof FormGroup || control instanceof FormArray) {
          this.checkFormValidations(control);
        }
      }
    });

    formGroup.updateValueAndValidity({ emitEvent: false });
  }

  public static lessOrEqualZero(fieldName: string): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const formControls = formGroup;

      if (!formControls) {
        return null;
      }

      const field = formGroup.get(fieldName);

      if (!field) {
        throw new Error(`O controle ${field} não existe no formulário.`);
      }

      this.clearControlErrors(field, 'lessOrEqualZero');

      if (!!!field.value && Number(field.value) <= 0) {
        field.setErrors({ lessOrEqualZero: true });
        return { lessOrEqualZero: true };
      }

      return null;
    };
  }
}
