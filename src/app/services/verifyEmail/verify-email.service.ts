import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VerifyEmailService {
 private baseUrl = `${environment.apiUrl}/email`;
  constructor(private _http:HttpClient) { }
 private getHeaders(): HttpHeaders{
  const token = localStorage.getItem('token')
  return new HttpHeaders({
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  })
 }

 verifyEmail():Observable<any> {
   const headers = this.getHeaders();
   return this._http.get(`${this.baseUrl}/verify`, { headers,
    responseType:'text'
    });
 }
}
