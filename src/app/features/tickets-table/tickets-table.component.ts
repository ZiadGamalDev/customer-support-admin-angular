import { TicketUpdate } from './../../interfaces/tkt.interface';
import { Component, EventEmitter, NgModule, OnInit, Output } from '@angular/core';
import { TktServiceService } from '../../services/tickets/tkt-service.service';
import { Ticket } from '../../interfaces/tkt.interface';
import { CommonModule } from '@angular/common';
import { EditTicketFormComponent } from "../tickets/edit-ticket-form/edit-ticket-form.component";


@Component({
  selector: 'app-tickets-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tickets-table.component.html',
  styleUrl: './tickets-table.component.css'
})
export class TicketsTableComponent implements OnInit {
  @Output() selectTicket = new EventEmitter<Ticket>();
tickets:Ticket[] = [];
isLoading:boolean = false;
error:string |null = null;
selectedTicket: Ticket | null = null

  constructor(private tktService:TktServiceService) { }

  ngOnInit(): void {
    this.getTickets();
  }

  getTickets() {
    this.isLoading = true;
    this.error = null;
   const token = localStorage.getItem('token') || '';
    this.tktService.getTickets(token).subscribe( {
      next: (response: Ticket[]) => {
        this.tickets = response;
        this.isLoading = false;
      },
      error: (error) => {
        this.error = 'Error fetching tickets. Please try again later.';
        this.isLoading = false;
      },
    });
  }
  updateTicketInTable(updatedTicket: Ticket) {
    this.tickets = this.tickets.map(ticket => 
      ticket.id === updatedTicket.id ? updatedTicket : ticket
    );
    this.selectedTicket=null;
  }
  onTicketSelect(ticket: Ticket) {
    this.selectedTicket = ticket;
    this.selectTicket.emit(ticket);
  }

}
