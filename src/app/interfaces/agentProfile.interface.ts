export interface AgentProfile {
  status: 'available' | 'away' | 'busy';
  name: string;
  email: string;
  phone: string;
  emailVerifiedAt: Date;
  profileImage?: string;
}
