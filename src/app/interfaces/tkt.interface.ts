export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: 'new' | 'open' | 'pending' | 'resolved';
  priority: string;
  customerUnreadCount: number;
  agentUnreadCount: number;
  createdAt: string;
  customer: string;
  agent: {
    _id: string;
    name: string;
    email: string;
  };
}
export interface TicketUpdate {
  agentId: string;
  status?: string;
  title?: string;
  description?: string;
}
