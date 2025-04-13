import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AgentSidebarComponent } from "../../features/sidebar/agent-sidebar/agent-sidebar.component";

@Component({
  selector: 'app-layout',
  imports: [RouterModule, AgentSidebarComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {

}
