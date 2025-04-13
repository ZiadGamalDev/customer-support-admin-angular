import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgentProfile } from '../../../interfaces/agentProfile.interface';
import { AgentProfileService } from '../../../services/agent-profile/agent.profile.service';
import { ProfileStateService } from '../../../services/profile-state/profile-state.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  // Profile properties
  status: AgentProfile['status'] = 'away';
  name: string = '';
  email: string = '';
  phone: string = '';
  emailVerifiedAt: Date = new Date();

  // UI states
  isLoading: boolean = true;
  error: string | null = null;

  // Image handling
  profileImage: string | null = null;
  defaultImage: string = 'https://randomuser.me/api/portraits/men/3.jpg';

  // Cleanup
  private destroy$ = new Subject<void>();

  constructor(
    private _AgentProfileService: AgentProfileService,
    private _profileStateService: ProfileStateService
  ) {}

  ngOnInit(): void {
    // Subscribe to profile state changes
    this._profileStateService.profile$
      .pipe(takeUntil(this.destroy$))
      .subscribe((profile) => {
        if (profile) {
          this.updateProfileData(profile);
        }
      });

    this.loadProfileData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  handleImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = this.defaultImage;
  }

  private updateProfileData(profile: AgentProfile): void {
    this.status = profile.status || 'away';
    this.name = profile.name || '';
    this.email = profile.email || '';
    this.phone = profile.phone || '';
    this.emailVerifiedAt = new Date(profile.emailVerifiedAt);
    this.profileImage = profile.profileImage || null;
  }

  private loadProfileData(): void {
    this.isLoading = true;
    this.error = null;

    const userAccessToken = localStorage.getItem('token') || '';

    this._AgentProfileService
      .getProfile(userAccessToken)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          // Update the profile state
          this._profileStateService.updateProfileState(response);
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error fetching profile data:', error);
          this.error = 'Failed to load profile data. Please try again later.';
          this.isLoading = false;
        },
      });
  }

  retryLoading(): void {
    this.loadProfileData();
  }
}
