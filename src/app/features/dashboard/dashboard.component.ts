import { Component } from '@angular/core';
import { AgentSidebarComponent } from "../sidebar/agent-sidebar/agent-sidebar.component";

@Component({
  selector: 'app-dashboard',
  imports: [AgentSidebarComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

}
