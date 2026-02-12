export interface User {
  id: string;
  email: string;
  full_name: string;
  phone_number: string | null;
  total_balance: number;
  total_saved: number;
  lottery_entries: number;
  referral_code: string;
  referred_by: string | null;
  kyc_status: 'pending' | 'submitted' | 'approved' | 'rejected';
  kyc_document_url: string | null;
  kyc_id_number: string | null;
  kyc_address: string | null;
  created_at: string;
  updated_at: string;
}

export interface Goal {
  id: string;
  user_id: string;
  title: string;
  target_amount: number;
  current_amount: number;
  deadline: string;
  icon: string;
  color: string;
  auto_save_enabled: boolean;
  auto_save_amount: number | null;
  auto_save_frequency: 'daily' | 'weekly' | 'monthly' | null;
  status: 'active' | 'completed' | 'paused';
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  goal_id: string | null;
  amount: number;
  type: 'deposit' | 'withdrawal' | 'transfer';
  description: string;
  status: 'pending' | 'completed' | 'failed';
  created_at: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  target_amount: number;
  duration_days: number;
  reward_entries: number;
  start_date: string;
  end_date: string;
  status: 'active' | 'completed' | 'upcoming';
  created_at: string;
}

export interface ChallengeParticipant {
  id: string;
  challenge_id: string;
  user_id: string;
  current_amount: number;
  status: 'active' | 'completed' | 'abandoned';
  joined_at: string;
  completed_at: string | null;
}

export interface ChallengeWithProgress extends Challenge {
  participant?: ChallengeParticipant;
  progress_percentage: number;
  participants_count: number;
}

export interface Referral {
  id: string;
  referrer_id: string;
  referred_id: string;
  reward_claimed: boolean;
  created_at: string;
}

export interface LotteryEntry {
  id: string;
  user_id: string;
  entry_number: string;
  draw_date: string;
  status: 'pending' | 'won' | 'lost';
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'achievement' | 'challenge';
  is_read: boolean;
  action_url: string | null;
  created_at: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string, referralCode?: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export interface GoalFormData {
  title: string;
  target_amount: number;
  deadline: string;
  icon: string;
  color: string;
}

export interface KYCFormData {
  full_name: string;
  phone_number: string;
  id_number: string;
  address: string;
  document: File | null;
}
