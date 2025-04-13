import { Component } from '@angular/core';
import { AgentSidebarComponent } from "../sidebar/agent-sidebar/agent-sidebar.component";

@Component({
  selector: 'app-agents',
  imports: [AgentSidebarComponent],
  templateUrl: './agents.component.html',
  styleUrl: './agents.component.css'
})
export class AgentsComponent {

}
