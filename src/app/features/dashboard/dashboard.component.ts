import { Component } from '@angular/core';

import { AgentProfileService } from '../../services/agent-profile/agent.profile.service';

import { AgentSidebarComponent } from '../sidebar/agent-sidebar/agent-sidebar.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { DashTicket, Ticket } from '../../interfaces/tkt.interface';
import { TktServiceService } from '../../services/tickets/tkt-service.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',

  imports: [CommonModule, AgentSidebarComponent, RouterLink],

  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  adminName: string = '';

  statistics: any = null;
  loading = true;
  error: string | null = null;

  tickets: DashTicket[] = [];
  isLoading: boolean = false;

  constructor(
    private http: HttpClient,
    private agentProfileService: AgentProfileService,
    private tktServiceService: TktServiceService
  ) {}

  ngOnInit(): void {
    this.loadAdminProfile(), this.fetchStatistics(), this.fetchRecentTickets();
  }

  private loadAdminProfile(): void {
    const userAccessToken = localStorage.getItem('token') ?? '';
    this.agentProfileService
      .getProfile(userAccessToken)
      .pipe()
      .subscribe({
        next: (profile) => {
          // Handle the profile data here
          console.log('Profile loaded:', profile);
          this.adminName = profile.name;
        },
        error: (error) => {
          console.error('Error loading profile:', error);
        },
      });
  }

  fetchStatistics() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    this.http
      .get('http://localhost:3000/admin/dashboard/statistics', { headers })
      .subscribe({
        next: (res: any) => {
          this.statistics = res.statistics;
          this.loading = false;
          console.log('Statistics:', this.statistics);
        },
        error: (err) => {
          this.error = 'Failed to load statistics. Please try again later.';
          this.loading = false;
          console.error('Error fetching statistics:', err);
        },
      });
  }

  fetchRecentTickets() {
    this.isLoading = true;
    this.error = null;
    const token = localStorage.getItem('token') || '';

    this.tktServiceService.getRecentTickets(token).subscribe({
      next: (response: DashTicket[]) => {
        console.log(response);

        this.tickets = response;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching tickets:', err);
        this.error = 'Error fetching tickets. Please try again later.';
        this.isLoading = false;
      },
    });
  }

  getPriorityClass(priority: string): string {
    switch (priority.toLowerCase()) {
      case 'urgent':
        return 'bg-red-600 text-white';
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  formatDate(date: string): string {
    const d = new Date(date);
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const year = d.getFullYear();
    const hours = d.getHours() % 12 || 12;
    const minutes = d.getMinutes().toString().padStart(2, '0'); 
    const period = d.getHours() >= 12 ? 'PM' : 'AM';
    return `${month}/${day}/${year} ${hours}:${minutes} ${period}`;
  }
}
