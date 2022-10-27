import { AbstractControl, FormGroup, ValidatorFn } from '@angular/forms';
import validator from 'validator';

export class CustomValidators {
  constructor() {}
  static isEmailValidator(optional: boolean): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      return !(
        (!control.value && optional) ||
        validator.isEmail(control.value === null ? '' : control.value)
      )
        ? { isEmail: true }
        : null;
    };
  }

  static isPhoneNumberValidator(
    control: AbstractControl
  ): { [key: string]: boolean } | null {
    return !control.value || !validator.isMobilePhone(control.value, 'ar-EG')
      ? { isEmail: true }
      : null;
  }

  static isStrongPassword(
    control: AbstractControl
  ): { [key: string]: boolean } | null {
    return !control.value ||
      !validator.isStrongPassword(control.value, {
        minLength: 6,
        minUppercase: 0,
        minNumbers: 0,
        minSymbols: 0,
        minLowercase: 0,
      })
      ? { isEmail: true }
      : null;
  }
  static isNotEqual<T extends { [key: string]: any }>(obj: T): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      //return null;
      return Object.entries((control as FormGroup).controls).reduce(
        (prev, entry) => obj[entry[0]] === entry[1].value && prev,
        true
      )
        ? { isEqual: true }
        : null;
    };
  }

  static isMatch(passwordControlName: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      return control.parent?.get(passwordControlName)?.value !== control?.value
        ? { isMatch: true }
        : null;
    };
  }
}
