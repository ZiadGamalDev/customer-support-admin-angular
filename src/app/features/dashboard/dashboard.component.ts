import { Component } from '@angular/core';
import { AgentSidebarComponent } from '../sidebar/agent-sidebar/agent-sidebar.component';

interface Ticket {
  id: number;
  title: string;
  date: string;
  priority: 'Low' | 'Medium' | 'High';
  description: string;
  status: 'Open' | 'Pending' | 'Resolved';
}

@Component({
  selector: 'app-dashboard',
  imports: [AgentSidebarComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  tickets: Ticket[] = [
    {
      id: 1,
      title: 'Wireless headphones not connecting',
      date: '7/16/2023',
      priority: 'Medium',
      description:
        "I bought the headphones last week and they won't connect to my phone.",
      status: 'Open',
    },
    {
      id: 2,
      title: 'Request for refund',
      date: '7/21/2023',
      priority: 'High',
      description: 'I would like to return my smart watch and get a refund.',
      status: 'Pending',
    },
  ];

  stats = {
    total: 2,
    open: 1,
    pending: 1,
    resolved: 0,
  };

  activeTab: 'recent' | 'priority' = 'recent';

  constructor() {}

  ngOnInit(): void {}

  switchTab(tab: 'recent' | 'priority'): void {
    this.activeTab = tab;
  }

  getPriorityClass(priority: string): string {
    switch (priority) {
      case 'Low':
        return 'bg-green-100 text-green-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'High':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
}
