import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../environments/environment';

interface UpdatePasswordResponse {
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class ResetPasswordService {
  private apiUrl = `${environment.apiUrl}/password/update`;

  constructor(private http: HttpClient) {}

  resetPassword(
    email: string,
    otp: string,
    newPassword: string
  ): Observable<any> {
    const body = {
      email: email,
      otp: otp,
      newPassword: newPassword,
    };
    return this.http.post(`${this.apiUrl}`, body);
  }

  updatePassword(
    oldPassword: string,
    newPassword: string,
    confirmPassword: string
  ): Observable<UpdatePasswordResponse> {
    const userToken = localStorage.getItem('token') || '';
    const headers = new HttpHeaders({
      Authorization: `Bearer ${userToken}`,
      'Content-Type': 'application/json',
    });

    const body = {
      oldPassword,
      newPassword,
      confirmPassword,
    };

    return this.http
      .post<UpdatePasswordResponse>(this.apiUrl, body, { headers })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let errorMessage = 'An error occurred while updating password';
          if (error.error?.message) {
            errorMessage = error.error.message;
          }
          return throwError(() => new Error(errorMessage));
        })
      );
  }
}
