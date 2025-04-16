//

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { AgentProfileService } from '../../../services/agent-profile/agent.profile.service';
import { ProfileStateService } from '../../../services/profile-state/profile-state.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss'],
})
export class EditProfileComponent implements OnInit, OnDestroy {
  profileForm: FormGroup;
  isLoading: boolean = false;
  success: string = '';
  error: string = '';
  previewImage: string | null = null;
  defaultImage: string = 'https://randomuser.me/api/portraits/men/1.jpg';
  private destroy$ = new Subject<void>();

  constructor(
    private agentProfileService: AgentProfileService,
    private profileStateService: ProfileStateService,
    private fb: FormBuilder
  ) {
    this.profileForm = this.fb.group({
      name: ['', [Validators.required, this.validateName()]],
      phone: ['', [Validators.required, this.validateEgyptianPhone()]],
    });
  }

  ngOnInit(): void {
    this.loadProfileData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadProfileData(): void {
    const userToken = localStorage.getItem('token') || '';
    this.agentProfileService
      .getProfile(userToken)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (profile) => {
          this.profileForm.patchValue({
            name: profile.name,
            email: profile.email,
            phone: profile.phone,
          });
          this.previewImage = profile.profileImage || null;
        },
        error: (error) => {
          this.error = 'Failed to load profile data';
          console.error('Error loading profile:', error);
        },
      });
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      this.isLoading = true;
      this.error = '';
      this.success = '';

      const userToken = localStorage.getItem('token') || '';
      this.agentProfileService
        .updateProfile(userToken, this.profileForm.value)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (updatedProfile) => {
            this.success = 'Profile updated successfully';
            this.profileStateService.updateProfileState(updatedProfile);
            this.isLoading = false;
          },
          error: (error) => {
            this.error = 'Failed to update profile';
            console.error('Error updating profile:', error);
            this.isLoading = false;
          },
        });
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.profileForm.get(fieldName);
    return !!field && field.invalid && (field.dirty || field.touched);
  }

  getErrorMessage(fieldName: string): string {
    const field = this.profileForm.get(fieldName);
    if (!field) return '';

    if (field.hasError('required')) {
      return `${
        fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
      } is required`;
    }

    switch (fieldName) {
      case 'name':
        if (field.hasError('invalidName')) {
          return 'Name must contain letters and can include numbers';
        }
        break;

      case 'email':
        if (field.hasError('email') || field.hasError('invalidEmailFormat')) {
          return 'Please enter a valid email address';
        }
        if (field.hasError('invalidDomain')) {
          return 'Please use a valid email domain (e.g., gmail.com, yahoo.com)';
        }
        break;

      case 'phone':
        if (field.hasError('invalidEgyptianPhone')) {
          return 'Please enter a valid Egyptian mobile number (e.g., 01012345678)';
        }
        break;
    }

    return '';
  }

  handleImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = this.defaultImage;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewImage = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  private validateName(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if (!value) return null;

      // Allow alphabets, spaces and numbers (but not only numbers)
      const nameRegex = /^(?![0-9]+$)[a-zA-Z0-9\s]{3,}$/;
    const hasThreeLetters = /[a-zA-Z]{3,}/.test(value);

    if (!nameRegex.test(value) || !hasThreeLetters) {
      return { invalidName: true };
    }

    return null;
    };
  }

  // private validateEmailFormat(): ValidatorFn {
  //   return (control: AbstractControl): ValidationErrors | null => {
  //     const value = control.value;

  //     if (!value) return null;

  //     // Strong email regex that prevents invalid TLDs
  //     const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  //     const numericTldRegex = /\.[0-9]+$/; // Prevents domains ending in numbers

  //     if (!emailRegex.test(value) || numericTldRegex.test(value)) {
  //       return { invalidEmailFormat: true };
  //     }

  //     return null;
  //   };
  // }

  // private validateEmailDomain(): ValidatorFn {
  //   return (control: AbstractControl): ValidationErrors | null => {
  //     const value = control.value;

  //     if (!value) return null;

  //     const allowedDomains = new Set([
  //       'gmail.com',
  //       'yahoo.com',
  //       'outlook.com',
  //       'hotmail.com',
  //       'icloud.com',
  //       'aol.com',
  //       'mail.ru',
  //       'protonmail.com',
  //       'zoho.com',
  //       'yandex.com',
  //     ]);

  //     const domain = value.split('@')[1]?.toLowerCase();
  //     if (!domain || !allowedDomains.has(domain)) {
  //       return { invalidDomain: true };
  //     }

  //     return null;
  //   };
  // }

  private validateEgyptianPhone(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if (!value) return null;

      let cleanedValue = value.replace(/[\s\-()]/g, '');

      if (cleanedValue.startsWith('+20')) {
        cleanedValue = cleanedValue.replace('+20', '0');
      } else if (cleanedValue.startsWith('0020')) {
        cleanedValue = cleanedValue.replace('0020', '0');
      }

      const mobilePattern = /^01[0125][0-9]{8}$/;

      return mobilePattern.test(cleanedValue)
        ? null
        : { invalidEgyptianPhone: true };
    };
  }
}
