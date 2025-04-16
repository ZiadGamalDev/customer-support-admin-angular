import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { ForgetpasswordComponent } from './forgetpassword/forgetpassword.component';
import { ResetPasswordService } from '../../../services/reset-password.service';

@Component({
  selector: 'app-security',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ForgetpasswordComponent],
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.scss'],
})
export class SecurityComponent implements OnInit {
  passwordForm!: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  isSubmitting: boolean = false;

  // Password visibility toggles
  showOldPassword: boolean = false;
  showNewPassword: boolean = false;
  showConfirmPassword: boolean = false;

  constructor(
    private fb: FormBuilder,
    private resetPasswordService: ResetPasswordService
  ) {}

  ngOnInit(): void {
    this.passwordForm = this.fb.group(
      {
        oldPassword: ['', [Validators.required]],
        newPassword: [
          '',
          [Validators.required, this.createPasswordValidator()],
        ],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator(g: FormGroup) {
    const newPass = g.get('newPassword')?.value;
    const confirmPass = g.get('confirmPassword')?.value;
    return newPass === confirmPass ? null : { passwordMismatch: true };
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

    return strength;
  }

  // Getters for form controls
  get oldPasswordControl() {
    return this.passwordForm.get('oldPassword');
  }

  get newPasswordControl() {
    return this.passwordForm.get('newPassword');
  }

  get confirmPasswordControl() {
    return this.passwordForm.get('confirmPassword');
  }

  // Add these helper methods
  hasLowerCase(value: string | null): boolean {
    return value ? /[a-z]/.test(value) : false;
  }

  hasUpperCase(value: string | null): boolean {
    return value ? /[A-Z]/.test(value) : false;
  }

  hasNumber(value: string | null): boolean {
    return value ? /[0-9]/.test(value) : false;
  }

  hasMinLength(value: string | null): boolean {
    return value ? value.length >= 8 : false;
  }

  onSubmit() {
    if (this.passwordForm.valid) {
      this.isSubmitting = true;
      this.errorMessage = '';
      this.successMessage = '';

      const { oldPassword, newPassword, confirmPassword } =
        this.passwordForm.value;

      this.resetPasswordService
        .updatePassword(oldPassword, newPassword, confirmPassword)
        .subscribe({
          next: (response) => {
            this.successMessage = response.message;
            this.passwordForm.reset();
            this.isSubmitting = false;
          },
          error: (error) => {
            this.errorMessage = error.message;
            this.isSubmitting = false;
          },
        });
    }
  }
}
