import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { ForgetpasswordService } from '../../../../services/forgetpassword.service';

@Component({
  selector: 'app-forgetpassword',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './forgetpassword.component.html',
  styleUrls: ['./forgetpassword.component.scss'],
})
export class ForgetpasswordComponent {
  forgetPasswordForm: FormGroup;
  showForm = false;
  isOtpSent = false;
  isSubmitting = false;
  errorMessage: string = '';
  successMessage: string = '';
  showNewPassword = false;
  showConfirmPassword = false;

  // Custom email pattern
  private readonly emailPattern: RegExp =
    /^[a-zA-Z][a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  constructor(
    private fb: FormBuilder,
    private forgetPasswordService: ForgetpasswordService
  ) {
    this.forgetPasswordForm = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.pattern(this.emailPattern),
        this.validateEmailDomain
      ]],
      otp: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(6),
          Validators.pattern(/^[0-9]+$/),
        ],
      ],
      newPassword: [
        '',
        [Validators.required, this.createPasswordValidator()],
      ],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: this.passwordMatchValidator });
  }

  // Custom validator for email domains
  validateEmailDomain(control: AbstractControl): ValidationErrors | null {
    const value = control.value;

    if (!value) {
      return null;
    }

    // Check if email starts with a letter (prevents numbers at start)
    if (!/^[a-zA-Z]/.test(value)) {
      return { invalidEmailFormat: true };
    }

    // Check for numeric TLD
    if (/\.[0-9]+$/.test(value)) {
      return { numericTLD: true };
    }

    // Basic email format check
    const emailRegex = /^[a-zA-Z][a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(value)) {
      return { invalidEmailFormat: true };
    }

    // Validate domain
    const validDomains = [
      'gmail.com',
      'yahoo.com',
      'outlook.com',
      'hotmail.com',
      'icloud.com',
      'aol.com',
      'mail.ru',
      'protonmail.com',
      'zoho.com',
      'yandex.com',
    ];

    const domain = value.split('@')[1]?.toLowerCase();
    if (!domain || !validDomains.includes(domain)) {
      return { invalidDomain: true };
    }

    return null;
  }

  createPasswordValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.value;

      if (!password) {
        return null;
      }

      const errors: ValidationErrors = {};

      if (password.length < 8) {
        errors['minLength'] = true;
      }
      if (!/[A-Z]/.test(password)) {
        errors['noUppercase'] = true;
      }
      if (!/[a-z]/.test(password)) {
        errors['noLowercase'] = true;
      }
      if (!/[0-9]/.test(password)) {
        errors['noNumber'] = true;
      }
      if (!/[@$!%*?&]/.test(password)) {
        errors['noSpecialChar'] = true;
      }

      return Object.keys(errors).length === 0 ? null : errors;
    };
  }

  // Password strength calculation
  get passwordStrength(): number {
    const password = this.newPasswordControl?.value;
    if (!password) return 0;

    let strength = 0;
    if (password.length >= 8) strength += 20;
    if (/[A-Z]/.test(password)) strength += 20;
    if (/[a-z]/.test(password)) strength += 20;
    if (/[0-9]/.test(password)) strength += 20;
    if (/[@$!%*?&]/.test(password)) strength += 20;

    return strength;
  }

  // Get form control error messages
  getErrorMessage(controlName: string): string {
    const control = this.forgetPasswordForm.get(controlName);
    if (control?.errors) {
      if (control.errors['required']) {
        return `${
          controlName.charAt(0).toUpperCase() + controlName.slice(1)
        } is required`;
      }
      if (controlName === 'email') {
        if (control.errors['invalidEmailFormat']) {
          return 'Email must start with a letter and contain valid characters';
        }
        if (control.errors['numericTLD']) {
          return 'Email domain cannot end with numbers';
        }
        if (control.errors['invalidDomain']) {
          return 'Please use a valid email domain (e.g., gmail.com, yahoo.com)';
        }
      }
      if (control.errors['pattern'] && controlName === 'otp')
        return 'OTP must contain numbers only';
      if (control.errors['minlength'])
        return `Minimum ${control.errors['minlength'].requiredLength} characters required`;
      if (control.errors['maxlength'])
        return `Maximum ${control.errors['maxlength'].requiredLength} characters allowed`;
    }
    return '';
  }

  toggleForm() {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.resetForm();
    }
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('newPassword')?.value === g.get('confirmPassword')?.value
      ? null
      : { passwordMismatch: true };
  }

  sendOtp() {
    if (this.forgetPasswordForm.get('email')?.valid) {
      this.isSubmitting = true;
      this.errorMessage = '';
      this.successMessage = '';

      const email = this.forgetPasswordForm.get('email')?.value;

      this.forgetPasswordService.sendResetEmail(email).subscribe({
        next: (response) => {
          this.isOtpSent = true;
          this.isSubmitting = false;
          this.successMessage =
            'OTP sent successfully! Please check your email.';
        },
        error: (error) => {
          this.isSubmitting = false;
          this.errorMessage = error.message;
        },
      });
    }
  }

  onSubmit() {
    if (this.forgetPasswordForm.valid) {
      this.isSubmitting = true;
      this.errorMessage = '';
      this.successMessage = '';

      const { email, otp, newPassword } = this.forgetPasswordForm.value;

      this.forgetPasswordService
        .resetPassword(email, otp, newPassword)
        .subscribe({
          next: (response) => {
            this.successMessage = 'Password reset successful!';
            this.isSubmitting = false;
            setTimeout(() => {
              this.resetForm();
            }, 2000);
          },
          error: (error) => {
            this.isSubmitting = false;
            this.errorMessage = error.message;
          },
        });
    }
  }

  private resetForm() {
    this.forgetPasswordForm.reset();
    this.isOtpSent = false;
    this.showForm = false;
    this.errorMessage = '';
    this.successMessage = '';
  }

  get newPasswordControl() {
    return this.forgetPasswordForm.get('newPassword');
  }

  get confirmPasswordControl() {
    return this.forgetPasswordForm.get('confirmPassword');
  }

  get emailControl() {
    return this.forgetPasswordForm.get('email');
  }

  hasSpecialChar(value: string | null): boolean {
    return value ? /[@$!%*?&]/.test(value) : false;
  }

  hasMinLength(value: string | null): boolean {
    return value ? value.length >= 8 : false;
  }

  hasUpperCase(value: string | null): boolean {
    return value ? /[A-Z]/.test(value) : false;
  }

  hasLowerCase(value: string | null): boolean {
    return value ? /[a-z]/.test(value) : false;
  }

  hasNumber(value: string | null): boolean {
    return value ? /[0-9]/.test(value) : false;
  }
}
