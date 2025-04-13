import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

interface PasswordResponse {
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class ForgetpasswordService {
  private baseUrl = 'http://localhost:3000/password';

  constructor(private http: HttpClient) {}

  // Send reset password email with OTP
  sendResetEmail(email: string): Observable<PasswordResponse> {
    return this.http
      .post<PasswordResponse>(`${this.baseUrl}/forgot`, { email })
      .pipe(catchError(this.handleError));
  }

  // Reset password with OTP
  resetPassword(
    email: string,
    otp: string,
    newPassword: string
  ): Observable<PasswordResponse> {
    const body = {
      email,
      otp,
      newPassword,
    };

    return this.http
      .post<PasswordResponse>(`${this.baseUrl}/reset`, body)
      .pipe(catchError(this.handleError));
  }

  // Confirm current password
  confirmPassword(password: string): Observable<PasswordResponse> {
    const userToken = localStorage.getItem('token') || '';
    const headers = new HttpHeaders({
      Authorization: `Bearer ${userToken}`,
      'Content-Type': 'application/json',
    });

    return this.http
      .post<PasswordResponse>(
        `${this.baseUrl}/confirm`,
        { password },
        { headers }
      )
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      errorMessage = error.error?.message || 'Server error';
    }

    return throwError(() => new Error(errorMessage));
  }
}
