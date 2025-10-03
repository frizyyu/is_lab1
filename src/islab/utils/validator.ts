import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const nonEmptyString: ValidatorFn = (c: AbstractControl): ValidationErrors | null => {
  const v = c.value as string | null | undefined;
  return v != null && v.trim().length > 0 ? null : { nonEmpty: true };
};

export const isInteger: ValidatorFn = (c: AbstractControl): ValidationErrors | null => {
  const v = c.value;
  if (v == null || v === '') return null;
  return Number.isInteger(Number(v)) ? null : { integer: true };
};

export const greaterThan = (minExclusive: number): ValidatorFn =>
  (c: AbstractControl): ValidationErrors | null => {
    const v = c.value;
    if (v == null || v === '') return null;
    return Number(v) > minExclusive ? null : { gt: { minExclusive } };
  };

export const enumRequired: ValidatorFn = (c: AbstractControl): ValidationErrors | null =>
  c.value == null ? { required: true } : null;
