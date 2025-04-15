export interface Ticket {
    id: string;
    title: string;
    status: 'open' | 'pending' | 'resolved';
    description: string;
    createdAt: string;
    agentId: string;
  }
  export interface TicketUpdate {
    agentId: string;
    status?: string;
    title?: string;
    description?: string;
  }