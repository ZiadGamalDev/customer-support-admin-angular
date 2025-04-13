import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AgentProfile } from '../../interfaces/agentProfile.interface';

@Injectable({
  providedIn: 'root',
})
export class ProfileStateService {
  private profileSubject = new BehaviorSubject<AgentProfile | null>(null);
  public profile$ = this.profileSubject.asObservable();

  updateProfileState(profile: AgentProfile) {
    this.profileSubject.next(profile);
  }
}
