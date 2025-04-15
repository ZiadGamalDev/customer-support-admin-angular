import { TicketUpdate } from './../../interfaces/tkt.interface';
import {
  Component,
  EventEmitter,
  NgModule,
  OnInit,
  Output,
} from '@angular/core';
import { TktServiceService } from '../../services/tickets/tkt-service.service';
import { Ticket } from '../../interfaces/tkt.interface';
import { CommonModule } from '@angular/common';
import { EditTicketFormComponent } from '../tickets/edit-ticket-form/edit-ticket-form.component';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tickets-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tickets-table.component.html',
  styleUrl: './tickets-table.component.css',
})
export class TicketsTableComponent implements OnInit {
  @Output() selectTicket = new EventEmitter<Ticket>();
  tickets: Ticket[] = [];
  isLoading: boolean = false;
  error: string | null = null;
  selectedTicket: Ticket | null = null;

  constructor(
    private tktService: TktServiceService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getTickets();
  }

  getTickets() {
    this.isLoading = true;
    this.error = null;
    const token = localStorage.getItem('token') || '';
    this.tktService.getTickets(token).subscribe({
      next: (response: Ticket[]) => {
        console.log(response);
        
        this.tickets = response.map(ticket => ({ ...ticket, isLoading: false }));
        this.isLoading = false;
      },
      error: (error) => {
        this.error = 'Error fetching tickets. Please try again later.';
        this.isLoading = false;
      },
    });
  }
  updateTicketInTable(updatedTicket: Ticket) {
    this.tickets = this.tickets.map((ticket) =>
      ticket.id === updatedTicket.id ? { ...updatedTicket, isLoading: false } : ticket
    );
    this.selectedTicket = null;
  }

  onTicketSelect(ticket: Ticket) {
    this.selectedTicket = ticket;
    this.selectTicket.emit(ticket);
  }

  updateTicketStatus(ticket: Ticket, newStatus: string) {
    const originalStatus = ticket.status;

    if (newStatus === originalStatus) {
      this.toastr.warning('No changes detected.', 'Warning');
      return;
    }

    this.tktService.updateTicketStatus(ticket.id, newStatus).subscribe({
      next: (updatedTicket: Ticket) => {
        this.toastr.success('Ticket status updated successfully!', 'Success');
        this.updateTicketInTable(updatedTicket);
      },
      error: (err) => {
        const errorMessage = err.error?.message || 'Error updating ticket status';
        this.toastr.error(errorMessage, 'Error');
        ticket.status = originalStatus;
      },
    });
  }
}
