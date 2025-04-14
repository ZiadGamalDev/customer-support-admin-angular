export interface AgentProfile {
  status: 'available' | 'away' | 'busy';
  name: string;
  email: string;
  phone: string;
  emailVerifiedAt: Date;
  profileImage?: string;
}
export interface Agent {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  emailVerifiedAt: string;
  createdAt: string;
  updatedAt: string;
}
