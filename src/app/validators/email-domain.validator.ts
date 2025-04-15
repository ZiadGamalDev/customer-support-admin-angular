import { AbstractControl, ValidationErrors } from '@angular/forms';

export const validDomains = [
  'gmail.com',
  'yahoo.com',
  'outlook.com',
  'hotmail.com',
  'icloud.com',
  'aol.com',
  'protonmail.com',
  'customer-support.com',
];

export function emailDomainValidator(
  control: AbstractControl
): ValidationErrors | null {
  const email = control.value;

  if (!email) return null;

  const domain = email.substring(email.lastIndexOf('@') + 1).toLowerCase();

  if (!validDomains.includes(domain)) {
    return { invalidDomain: true };
  }

  return null;
}
