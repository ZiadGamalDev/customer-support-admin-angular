import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AuthService } from './../../../core/auth.service';
// import { AgentStatusService } from '../../../services/agent-status/agent-status.service';
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
      // Handle the profile data here
      console.log('Profile loaded:', profile);
      this.adminName=profile.name
    },
    error: (error) => {
      console.error('Error loading profile:', error);
    }
  });
}


  handleChangeAgentStatus(newStatus: 'available' | 'away' | 'busy') {
    if (newStatus === this.previousStatus) return;

    const confirmed = confirm(
      `Are you sure to change status to "${newStatus}"?`
    );

    if (!confirmed) {
      this.agentStatus = this.previousStatus;
      return;
    }

    // this.agentStatusService.updateStatus(newStatus).subscribe({
    //   next: () => {
    //     this.agentStatus = newStatus;
    //     this.previousStatus = newStatus;

    //     if (newStatus === 'available') {
    //       this.checkForChats();
    //     } else if (newStatus === 'away') {
    //       this.chatService.resetChat(); // clear UI
    //     }
    //   },
    //   error: (err) => {
    //     console.error('[Sidebar] Failed to update status', err);
    //     alert(err?.error?.message || 'Error updating status');
    //     this.agentStatus = this.previousStatus;
    //   },
    // });
  }

  // private checkForChats(): void {
  //   const token = localStorage.getItem('token') ?? '';
  //   const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

  //   this.http
  //     .get<any[]>('http://localhost:3000/chats/agent', { headers })
  //     .subscribe({
  //       next: (chats) => {
  //         if (Array.isArray(chats) && chats.length > 0) {
  //           this.chatService.selectChat(chats[0].id);
  //         }
  //       },
  //       error: (err) => console.error('[Sidebar] Failed to fetch chats', err),
  //     });
  // }

  logout() {
    this.authService.logout();
  }
}
