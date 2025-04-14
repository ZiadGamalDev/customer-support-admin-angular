import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/auth.service';

/* material / common imports */
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule,
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  error = '';
  showPassword = false;
  showConfirmPassword = false;

  // Custom email pattern
  private readonly emailPattern: RegExp =
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{3,}$/;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group(
      {
        name: [
          '',
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(30),
            Validators.pattern(/^[a-zA-Z0-9_-]+$/),
          ],
        ],
        email: [
          '',
          [Validators.required, Validators.email, this.validateEmailDomain],
        ],
        password: ['', [Validators.required, this.createPasswordValidator()]],
        repeat_password: ['', [Validators.required]],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  ngOnInit(): void {
    if (this.auth.isLoggedIn) {
      this.router.navigateByUrl('/dashboard');
    }
  }

  // Password validator
  private createPasswordValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.value;
      if (!password) return null;

      const errors: ValidationErrors = {};
      if (password.length < 8) errors['minLength'] = true;
      if (!/[A-Z]/.test(password)) errors['noUppercase'] = true;
      if (!/[a-z]/.test(password)) errors['noLowercase'] = true;
      if (!/[0-9]/.test(password)) errors['noNumber'] = true;
      if (!/[@$!%*?&]/.test(password)) errors['noSpecialChar'] = true;

      return Object.keys(errors).length === 0 ? null : errors;
    };
  }

  // Email domain validator
  private validateEmailDomain(
    control: AbstractControl
  ): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;

    // If email format is invalid, let the email validator handle it
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
      return null;
    }

    const validDomains = [
      'gmail.com',
      'yahoo.com',
      'outlook.com',
      'hotmail.com',
      'icloud.com',
      'aol.com',
      'protonmail.com',
      'customer-support.com',
    ];

    const domain = value.split('@')[1]?.toLowerCase();
    if (
      !domain ||
      !validDomains.some((validDomain) => domain === validDomain)
    ) {
      return { invalidDomain: true };
    }
    return null;
  }

  // Password match validator
  private passwordMatchValidator = (form: FormGroup) =>
    form.get('password')?.value === form.get('repeat_password')?.value
      ? null
      : { mismatch: true };

  // Helper methods for password strength indicators
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

  get passwordControl() {
    return this.registerForm.get('password');
  }

  // Password strength calculation
  get passwordStrength(): number {
    const password = this.passwordControl?.value;
    if (!password) return 0;

    let strength = 0;
    if (password.length >= 8) strength += 20;
    if (/[A-Z]/.test(password)) strength += 20;
    if (/[a-z]/.test(password)) strength += 20;
    if (/[0-9]/.test(password)) strength += 20;
    if (/[@$!%*?&]/.test(password)) strength += 20;

    return strength;
  }

  // Helper method for username validation messages
  getUsernameErrorMessage(): string {
    const control = this.registerForm.get('name');
    if (control?.errors) {
      if (control.errors['required']) return 'Username is required';
      if (control.errors['minlength'])
        return 'Username must be at least 3 characters';
      if (control.errors['maxlength'])
        return 'Username cannot exceed 30 characters';
      if (control.errors['pattern'])
        return 'Username can only contain letters, numbers, underscore and hyphen';
    }
    return '';
  }

  // Helper method for email validation messages
  getEmailErrorMessage(): string {
    const control = this.registerForm.get('email');
    if (control?.errors) {
      if (control.errors['required']) return 'Email is required';
      if (control.errors['email']) return 'Please enter a valid email address';
      if (control.errors['invalidDomain'])
        return 'Email must be from a valid domain (gmail.com, yahoo.com, etc.)';
    }
    return '';
  }

  onSubmit(): void {
    if (this.registerForm.invalid) return;

    const { name, email, password, repeat_password } = this.registerForm.value;
    this.loading = true;
    this.error = '';

    this.auth.register(name, email, password, repeat_password).subscribe({
      next: () => {
        this.loading = false;
        // Change from empty string to '/login'
        this.router.navigateByUrl('/login').then(() => {
          console.log('Registration successful! Please login.');
        });
      },
      error: (err) => {
        this.loading = false;
        this.error =
          err?.error?.message ?? 'Something went wrong. Please try again!';
      },
    });
  }
}
