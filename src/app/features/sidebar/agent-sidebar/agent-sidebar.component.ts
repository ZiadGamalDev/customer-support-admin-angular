import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './../../../core/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AgentProfileService } from '../../../services/agent-profile/agent.profile.service';

@Component({
  selector: 'app-agent-sidebar',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink, RouterModule],
  templateUrl: './agent-sidebar.component.html',
  styleUrl: './agent-sidebar.component.css',
})
export class AgentSidebarComponent implements OnInit {
  agentStatus: 'available' | 'away' | 'busy' = 'away';
  previousStatus: typeof this.agentStatus = 'away';
  isSidebarOpen = false;
  adminName: string = '';
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  constructor(
    private authService: AuthService,
    private agentProfileService:AgentProfileService,
    // private agentStatusService: AgentStatusService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadAdminProfile()
  }

private loadAdminProfile():void{
  const userAccessToken = localStorage.getItem('token') ?? '';
  this.agentProfileService.getProfile(userAccessToken).pipe().subscribe({
   
    next: (profile) => {
      this.adminName=profile.name
    },
    error: (error) => {
      console.error('Error loading profile:', error);
    }
  });
}



  logout() {
    this.authService.logout();
  }
}
