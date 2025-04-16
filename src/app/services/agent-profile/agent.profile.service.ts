import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';

import { AgentProfile } from '../../interfaces/agentProfile.interface';
import { catchError, Observable, throwError } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class AgentProfileService {
  private apiURL = 'http://localhost:3000/admin/profile';

  constructor(private _http: HttpClient) {}

  getProfile(userAccessToken: string): Observable<AgentProfile> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${userAccessToken}`,
    });
    return this._http.get<AgentProfile>(this.apiURL, { headers }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error fetching user profile:', error);
        const errorMessage =
          error.error?.message || error.statusText || 'Unknown error';
        return throwError(
          () => new Error(`Failed to fetch agent profile: ${errorMessage}`)
        );
      })
    );
  }

  updateProfile(
    userAccessToken: string,
    body: Partial<AgentProfile>
  ): Observable<AgentProfile> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${userAccessToken}`,
    });
    return this._http.put<AgentProfile>(this.apiURL, body, { headers }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error updating agent profile:', error);
        const errorMessage =
          error.error?.message || error.statusText || 'Unknown error';
        return throwError(
          () => new Error(`Failed to update agent profile: ${errorMessage}`)
        );
      })
    );
  }
}
