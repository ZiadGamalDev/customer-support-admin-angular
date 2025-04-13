import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  id: string;
  exp: number;
  [key: string]: any;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  /** ------------------------------------------------------------------
   *  CONFIG
   *  ------------------------------------------------------------------ */
  private readonly apiBaseUrl = 'http://localhost:3000'; // 👈 no environment file

  /** ------------------------------------------------------------------
   *  STATE
   *  ------------------------------------------------------------------ */
  private readonly tokenSubject = new BehaviorSubject<string | null>(
    localStorage.getItem('token')
  );
  readonly token$ = this.tokenSubject.asObservable();

  /** ------------------------------------------------------------------
   *  CTOR
   *  ------------------------------------------------------------------ */
  constructor(private http: HttpClient, private router: Router) {}

  /** ------------------------------------------------------------------
   *  TOKEN HELPERS
   *  ------------------------------------------------------------------ */
  private setToken(token: string): void {
    this.tokenSubject.next(token);
    localStorage.setItem('token', token);

    const decoded = jwtDecode<JwtPayload>(token);
    console.log(decoded);
    localStorage.setItem('userId', decoded.id);
  }

  private clearToken(): void {
    this.tokenSubject.next(null);
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
  }

  get token(): string | null {
    return this.tokenSubject.value;
  }

  get isLoggedIn(): boolean {
    const t = this.token;
    if (!t) return false;

    try {
      const { exp } = jwtDecode<JwtPayload>(t);
      return exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }

  /** ------------------------------------------------------------------
   *  AUTH CALLS
   *  ------------------------------------------------------------------ */
  login(email: string, password: string): Observable<void> {
    return this.http
      .post<{ token: string; user: any }>(`${this.apiBaseUrl}/auth/login`, {
        email,
        password,
      })
      .pipe(
        tap((res) => {
          this.setToken(res.token);
          localStorage.setItem('role', res.user.role);
        }),
        map(() => void 0),
        catchError(this.handleError)
      );
  }

  register(
    name: string,
    email: string,
    password: string,
    confirmedPassword: string
  ): Observable<void> {
    return this.http
      .post<{ token: string }>(`${this.apiBaseUrl}/auth/register`, {
        name,
        email,
        password,
        confirmedPassword,
      })
      .pipe(
        tap((res) => this.setToken(res.token)),
        map(() => void 0),
        catchError(this.handleError)
      );
  }

  logout(): void {
    this.clearToken();
    this.router.navigateByUrl('/login');
  }

  /** ------------------------------------------------------------------
   *  ERROR HANDLER
   *  ------------------------------------------------------------------ */
  private handleError = (error: HttpErrorResponse) => {
    console.error('[AuthService] error:', error);
    return throwError(() => error);
  };
}
