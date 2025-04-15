import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DashTicket, Ticket, TicketUpdate } from '../../interfaces/tkt.interface';
import { catchError, Observable, tap } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class TktServiceService {
  private URL = 'http://localhost:3000/admin/chats';

  constructor(private _http: HttpClient, private toastr: ToastrService) {}
  getTickets(userAccessToken: string): Observable<Ticket[]> {
    return this._http.get<Ticket[]>(this.URL, {
      headers: {
        Authorization: `Bearer ${userAccessToken}`,
      },
    });
  }

  editTicket(
    userAccessToken: string,
    chatId: string,
    updatedTicket: TicketUpdate
  ): Observable<Ticket> {
    return this._http
      .put<Ticket>(`${this.URL}/${chatId}`, updatedTicket, {
        headers: {
          Authorization: `Bearer ${userAccessToken}`,
        },
      })
      .pipe(
        tap(() => {
          this.toastr.success('Ticket updated successfully!');
        }),
        catchError((error) => {
          this.toastr.error('Error updating ticket!');
          throw error;
        })
      );
  }

  updateTicketStatus(chatId: string, status: string): Observable<Ticket> {
    const token = localStorage.getItem('token') || '';

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    const body = { status };
    return this._http.put<Ticket>(`${this.URL}/${chatId}`, body, { headers });
  }

  deleteTicket(ticketId: string, token: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this._http.delete(`${this.URL}/${ticketId}`, { headers });
  }

  getRecentTickets(token: string): Observable<DashTicket[]> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this._http.get<DashTicket[]>(
      `http://localhost:3000/admin/dashboard/recent-chats`,
      { headers }
    );
  }
}
