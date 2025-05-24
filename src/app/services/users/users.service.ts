import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { User } from '../../interfaces/user.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private readonly baseUrl = `${environment.apiUrl}/admin/users`;

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<User[]> {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (!token) {
      return throwError(() => new Error('Unauthorized: No token found'));
    }

    if (role !== 'admin') {
      return throwError(
        () => new Error('Access Denied: Only admin can view users')
      );
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<User[]>(this.baseUrl, { headers }).pipe(
      catchError((error) => {
        console.error('[UserService] Error fetching users:', error);
        return throwError(() => error);
      })
    );
  }

  deleteUser(id: string): Observable<void> {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (!token) {
      return throwError(() => new Error('Unauthorized: No token found'));
    }

    if (role !== 'admin') {
      return throwError(
        () => new Error('Access Denied: Only admin can delete users')
      );
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.delete<void>(`${this.baseUrl}/${id}`, { headers }).pipe(
      catchError((error) => {
        console.error('[UserService] Error deleting user:', error);
        return throwError(() => error);
      })
    );
  }

  approveUser(email: string): Observable<any> {
    const body = { email };

    const token = localStorage.getItem('token');

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    return this.http.put(`${this.baseUrl}/approve`, body, { headers });
  }

  addAgent(agentData: any): Observable<any> {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http.post(`${this.baseUrl}`, agentData, {
      headers,
    });
  }

  editAgent(userId: string, agentData: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http.put(`${this.baseUrl}/${userId}`, agentData, {
      headers,
    });
  }

  getAgent(userId: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get(`${this.baseUrl}/${userId}`, { headers });
  }
}
