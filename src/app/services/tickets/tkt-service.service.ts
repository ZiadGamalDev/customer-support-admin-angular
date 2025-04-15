import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Ticket, TicketUpdate } from '../../interfaces/tkt.interface';
import { catchError, Observable, tap } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class TktServiceService {
private URL = 'http://localhost:3000/admin/chats';
  constructor(private _http:HttpClient, private toastr:ToastrService) { }
  getTickets(userAccessToken: string): Observable<Ticket[]> {
    return this._http.get<Ticket[]>(this.URL, {
      headers: {
        Authorization: `Bearer ${userAccessToken}`,
      },
    });
  }
  editTicket(userAccessToken: string, chatId: string, updatedTicket: TicketUpdate): Observable<Ticket> {
    return this._http.put<Ticket>(`${this.URL}/${chatId}`, updatedTicket, {
      headers: {
        Authorization: `Bearer ${userAccessToken}`,
      },
    }).pipe(
      tap(()=>{
        this.toastr.success('Ticket updated successfully!');
      }),
      catchError((error)=>{
        this.toastr.error('Error updating ticket!');
        throw error;
      })
    );

  }


}
