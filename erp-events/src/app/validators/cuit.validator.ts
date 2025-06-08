import { AbstractControl, ValidatorFn } from '@angular/forms';

export function cuitValidator(): ValidatorFn {
  return (control: AbstractControl) => {
    if (!control.value) return null;

    const number = control.value.toString().replace(/\D/g, '');

    const digits = number.split('').map(Number);
    const checkDigit = digits[10];
    const weights = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];

    const sum = weights.reduce((acc, weight, i) => acc + digits[i] * weight, 0);
    let expected = 11 - (sum % 11);

    if (expected === 11) expected = 0;
    if (expected === 10) return { invalidCheckDigit: 'Verificador no puede ser 10' };

    return checkDigit !== expected
      ? {
          invalidCheckDigit: 'Dígito verificador inválido',
          expected,
          received: checkDigit,
        }
      : null;
  };
}
