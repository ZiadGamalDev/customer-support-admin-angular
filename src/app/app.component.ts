import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AgentSidebarComponent } from "./features/sidebar/agent-sidebar/agent-sidebar.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AgentSidebarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'agent-dash';
}
