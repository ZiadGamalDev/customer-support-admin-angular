import { Component } from '@angular/core';
import { AgentSidebarComponent } from "../sidebar/agent-sidebar/agent-sidebar.component";
import { TicketsTableComponent } from "../tickets-table/tickets-table.component";

@Component({
  selector: 'app-tickets-page',
  imports: [AgentSidebarComponent, TicketsTableComponent],
  templateUrl: './tickets-page.component.html',
  styleUrl: './tickets-page.component.css'
})
export class TicketsPageComponent {

}
