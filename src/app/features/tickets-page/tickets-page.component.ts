import { Component, ViewChild } from '@angular/core';
import { AgentSidebarComponent } from "../sidebar/agent-sidebar/agent-sidebar.component";
import { TicketsTableComponent } from "../tickets-table/tickets-table.component";
import { EditTicketFormComponent } from "../tickets/edit-ticket-form/edit-ticket-form.component";
import { Ticket } from '../../interfaces/tkt.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tickets-page',
  standalone: true,
  imports: [ TicketsTableComponent, EditTicketFormComponent, CommonModule],
  templateUrl: './tickets-page.component.html',
  styleUrl: './tickets-page.component.css'
})
export class TicketsPageComponent {
  selectedTicket: Ticket | null = null;

  @ViewChild('ticketsTable') ticketsTable!: TicketsTableComponent;

  // onSelectTicket(ticket: Ticket) {
  //   this.selectedTicket = ticket;
  // }

  // onTicketUpdated(updatedTicket: Ticket) {
  //   // Update the selected ticket with new data
  //   this.selectedTicket = updatedTicket;
  //   // Notify the table component to update its data
  //   // this.updateTableData(updatedTicket);
  // }

  clearSelectedTicket() {
    this.selectedTicket = null;
  }
}
