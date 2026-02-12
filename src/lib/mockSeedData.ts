/**
 * Seed data generator for mock data layer
 * Provides three test scenarios: new user, active user, power user
 */

import {
  User,
  Goal,
  Transaction,
  Challenge,
  ChallengeParticipant,
  Referral,
  LotteryEntry,
  Notification,
} from '../types';
import { TestCredentials } from './mockTypes';

// Test credentials for each scenario
export const TEST_CREDENTIALS: TestCredentials[] = [
  {
    email: 'new-user@test.com',
    password: 'password123',
    userId: 'new-user-001',
    scenario: 'new-user',
  },
  {
    email: 'active-user@test.com',
    password: 'password123',
    userId: 'active-user-001',
    scenario: 'active-user',
  },
  {
    email: 'power-user@test.com',
    password: 'password123',
    userId: 'power-user-001',
    scenario: 'power-user',
  },
];

// Helper to generate timestamps
function daysAgo(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
}

function daysFromNow(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
}

// Generate users for all test scenarios
function generateUsers(): User[] {
  return [
    {
      id: 'new-user-001',
      email: 'new-user@test.com',
      full_name: 'New User',
      phone_number: null,
      total_balance: 0,
      total_saved: 0,
      lottery_entries: 0,
      referral_code: 'NEWUSER001',
      referred_by: null,
      kyc_status: 'pending',
      kyc_document_url: null,
      kyc_id_number: null,
      kyc_address: null,
      created_at: daysAgo(1),
      updated_at: daysAgo(1),
    },
    {
      id: 'active-user-001',
      email: 'active-user@test.com',
      full_name: 'Active User',
      phone_number: '+254712345678',
      total_balance: 5000,
      total_saved: 12000,
      lottery_entries: 5,
      referral_code: 'ACTIVE001',
      referred_by: null,
      kyc_status: 'approved',
      kyc_document_url: 'https://example.com/kyc/active-user.pdf',
      kyc_id_number: '12345678',
      kyc_address: '123 Main St, Nairobi',
      created_at: daysAgo(90),
      updated_at: daysAgo(1),
    },
    {
      id: 'power-user-001',
      email: 'power-user@test.com',
      full_name: 'Power User',
      phone_number: '+254787654321',
      total_balance: 15000,
      total_saved: 45000,
      lottery_entries: 20,
      referral_code: 'POWER001',
      referred_by: null,
      kyc_status: 'approved',
      kyc_document_url: 'https://example.com/kyc/power-user.pdf',
      kyc_id_number: '87654321',
      kyc_address: '456 Elite Ave, Nairobi',
      created_at: daysAgo(180),
      updated_at: daysAgo(1),
    },
  ];
}

// Generate goals for test scenarios
function generateGoals(users: User[]): Goal[] {
  const activeUser = users.find((u) => u.id === 'active-user-001')!;
  const powerUser = users.find((u) => u.id === 'power-user-001')!;

  return [
    // Active user goals
    {
      id: 'goal-001',
      user_id: activeUser.id,
      title: 'Emergency Fund',
      target_amount: 10000,
      current_amount: 2500,
      deadline: daysFromNow(60),
      icon: '🏥',
      color: '#EF4444',
      auto_save_enabled: true,
      auto_save_amount: 500,
      auto_save_frequency: 'weekly',
      status: 'active',
      created_at: daysAgo(30),
      updated_at: daysAgo(1),
    },
    {
      id: 'goal-002',
      user_id: activeUser.id,
      title: 'Vacation',
      target_amount: 20000,
      current_amount: 12000,
      deadline: daysFromNow(90),
      icon: '✈️',
      color: '#3B82F6',
      auto_save_enabled: false,
      auto_save_amount: null,
      auto_save_frequency: null,
      status: 'active',
      created_at: daysAgo(60),
      updated_at: daysAgo(2),
    },
    {
      id: 'goal-003',
      user_id: activeUser.id,
      title: 'New Laptop',
      target_amount: 50000,
      current_amount: 45000,
      deadline: daysFromNow(30),
      icon: '💻',
      color: '#8B5CF6',
      auto_save_enabled: true,
      auto_save_amount: 1000,
      auto_save_frequency: 'monthly',
      status: 'active',
      created_at: daysAgo(120),
      updated_at: daysAgo(3),
    },
    // Power user goals
    {
      id: 'goal-004',
      user_id: powerUser.id,
      title: 'House Down Payment',
      target_amount: 500000,
      current_amount: 150000,
      deadline: daysFromNow(365),
      icon: '🏠',
      color: '#10B981',
      auto_save_enabled: true,
      auto_save_amount: 5000,
      auto_save_frequency: 'monthly',
      status: 'active',
      created_at: daysAgo(180),
      updated_at: daysAgo(1),
    },
    {
      id: 'goal-005',
      user_id: powerUser.id,
      title: 'Car Fund',
      target_amount: 200000,
      current_amount: 80000,
      deadline: daysFromNow(180),
      icon: '🚗',
      color: '#F59E0B',
      auto_save_enabled: true,
      auto_save_amount: 3000,
      auto_save_frequency: 'monthly',
      status: 'active',
      created_at: daysAgo(150),
      updated_at: daysAgo(2),
    },
    {
      id: 'goal-006',
      user_id: powerUser.id,
      title: 'Wedding',
      target_amount: 100000,
      current_amount: 100000,
      deadline: daysAgo(30),
      icon: '💍',
      color: '#EC4899',
      auto_save_enabled: false,
      auto_save_amount: null,
      auto_save_frequency: null,
      status: 'completed',
      created_at: daysAgo(240),
      updated_at: daysAgo(30),
    },
    {
      id: 'goal-007',
      user_id: powerUser.id,
      title: 'Business Investment',
      target_amount: 300000,
      current_amount: 300000,
      deadline: daysAgo(60),
      icon: '💼',
      color: '#6366F1',
      auto_save_enabled: false,
      auto_save_amount: null,
      auto_save_frequency: null,
      status: 'completed',
      created_at: daysAgo(300),
      updated_at: daysAgo(60),
    },
    {
      id: 'goal-008',
      user_id: powerUser.id,
      title: 'Education Fund',
      target_amount: 150000,
      current_amount: 75000,
      deadline: daysFromNow(270),
      icon: '🎓',
      color: '#14B8A6',
      auto_save_enabled: true,
      auto_save_amount: 2000,
      auto_save_frequency: 'monthly',
      status: 'active',
      created_at: daysAgo(90),
      updated_at: daysAgo(1),
    },
  ];
}

// Generate transactions
function generateTransactions(users: User[], goals: Goal[]): Transaction[] {
  const activeUser = users.find((u) => u.id === 'active-user-001')!;
  const powerUser = users.find((u) => u.id === 'power-user-001')!;

  const transactions: Transaction[] = [];

  // Active user transactions
  const activeGoals = goals.filter((g) => g.user_id === activeUser.id);
  activeGoals.forEach((goal, idx) => {
    for (let i = 0; i < 3; i++) {
      transactions.push({
        id: `txn-${transactions.length + 1}`,
        user_id: activeUser.id,
        goal_id: goal.id,
        amount: 1000 + i * 500,
        type: 'deposit',
        description: `Deposit to ${goal.title}`,
        status: 'completed',
        created_at: daysAgo(30 - i * 10),
      });
    }
  });

  // Power user transactions
  const powerGoals = goals.filter((g) => g.user_id === powerUser.id);
  powerGoals.forEach((goal) => {
    const txnCount = goal.status === 'completed' ? 10 : 5;
    for (let i = 0; i < txnCount; i++) {
      transactions.push({
        id: `txn-${transactions.length + 1}`,
        user_id: powerUser.id,
        goal_id: goal.id,
        amount: 2000 + i * 1000,
        type: 'deposit',
        description: `Deposit to ${goal.title}`,
        status: 'completed',
        created_at: daysAgo(150 - i * 15),
      });
    }
  });

  return transactions;
}

// Generate challenges
function generateChallenges(): Challenge[] {
  return [
    {
      id: 'challenge-001',
      title: '30-Day Savings Sprint',
      description: 'Save KES 5,000 in 30 days and earn 10 lottery entries!',
      target_amount: 5000,
      duration_days: 30,
      reward_entries: 10,
      start_date: daysAgo(15),
      end_date: daysFromNow(15),
      status: 'active',
      created_at: daysAgo(20),
    },
    {
      id: 'challenge-002',
      title: 'Weekend Warrior',
      description: 'Save KES 2,000 every weekend for a month',
      target_amount: 8000,
      duration_days: 28,
      reward_entries: 15,
      start_date: daysFromNow(7),
      end_date: daysFromNow(35),
      status: 'upcoming',
      created_at: daysAgo(5),
    },
    {
      id: 'challenge-003',
      title: 'New Year Boost',
      description: 'Kickstart your savings with KES 10,000 in January',
      target_amount: 10000,
      duration_days: 31,
      reward_entries: 20,
      start_date: daysAgo(60),
      end_date: daysAgo(29),
      status: 'completed',
      created_at: daysAgo(70),
    },
  ];
}

// Generate challenge participants
function generateChallengeParticipants(
  users: User[],
  challenges: Challenge[]
): ChallengeParticipant[] {
  const activeUser = users.find((u) => u.id === 'active-user-001')!;
  const powerUser = users.find((u) => u.id === 'power-user-001')!;

  return [
    {
      id: 'participant-001',
      challenge_id: challenges[0].id,
      user_id: activeUser.id,
      current_amount: 3000,
      status: 'active',
      joined_at: daysAgo(15),
      completed_at: null,
    },
    {
      id: 'participant-002',
      challenge_id: challenges[0].id,
      user_id: powerUser.id,
      current_amount: 4500,
      status: 'active',
      joined_at: daysAgo(15),
      completed_at: null,
    },
    {
      id: 'participant-003',
      challenge_id: challenges[2].id,
      user_id: powerUser.id,
      current_amount: 10000,
      status: 'completed',
      joined_at: daysAgo(60),
      completed_at: daysAgo(35),
    },
  ];
}

// Generate referrals
function generateReferrals(users: User[]): Referral[] {
  const activeUser = users.find((u) => u.id === 'active-user-001')!;
  const powerUser = users.find((u) => u.id === 'power-user-001')!;

  return [
    {
      id: 'referral-001',
      referrer_id: activeUser.id,
      referred_id: 'referred-user-001',
      reward_claimed: true,
      created_at: daysAgo(60),
    },
    {
      id: 'referral-002',
      referrer_id: activeUser.id,
      referred_id: 'referred-user-002',
      reward_claimed: false,
      created_at: daysAgo(30),
    },
    {
      id: 'referral-003',
      referrer_id: powerUser.id,
      referred_id: 'referred-user-003',
      reward_claimed: true,
      created_at: daysAgo(120),
    },
    {
      id: 'referral-004',
      referrer_id: powerUser.id,
      referred_id: 'referred-user-004',
      reward_claimed: true,
      created_at: daysAgo(90),
    },
    {
      id: 'referral-005',
      referrer_id: powerUser.id,
      referred_id: 'referred-user-005',
      reward_claimed: true,
      created_at: daysAgo(60),
    },
  ];
}

// Generate lottery entries
function generateLotteryEntries(users: User[]): LotteryEntry[] {
  const activeUser = users.find((u) => u.id === 'active-user-001')!;
  const powerUser = users.find((u) => u.id === 'power-user-001')!;

  const entries: LotteryEntry[] = [];

  // Active user entries
  for (let i = 0; i < 5; i++) {
    entries.push({
      id: `lottery-${entries.length + 1}`,
      user_id: activeUser.id,
      entry_number: `ENTRY-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      draw_date: daysFromNow(30),
      status: 'pending',
      created_at: daysAgo(10 - i * 2),
    });
  }

  // Power user entries
  for (let i = 0; i < 20; i++) {
    const status = i < 15 ? 'pending' : i < 18 ? 'lost' : 'pending';
    entries.push({
      id: `lottery-${entries.length + 1}`,
      user_id: powerUser.id,
      entry_number: `ENTRY-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      draw_date: i < 18 ? daysAgo(30 - i) : daysFromNow(30),
      status,
      created_at: daysAgo(60 - i * 3),
    });
  }

  return entries;
}

// Generate notifications
function generateNotifications(users: User[]): Notification[] {
  const activeUser = users.find((u) => u.id === 'active-user-001')!;
  const powerUser = users.find((u) => u.id === 'power-user-001')!;

  return [
    {
      id: 'notif-001',
      user_id: activeUser.id,
      title: 'Goal Progress',
      message: 'You are 90% towards your New Laptop goal!',
      type: 'info',
      is_read: false,
      action_url: '/goals/goal-003',
      created_at: daysAgo(1),
    },
    {
      id: 'notif-002',
      user_id: activeUser.id,
      title: 'Challenge Update',
      message: 'You are 60% through the 30-Day Savings Sprint!',
      type: 'challenge',
      is_read: false,
      action_url: '/challenges/challenge-001',
      created_at: daysAgo(2),
    },
    {
      id: 'notif-003',
      user_id: activeUser.id,
      title: 'Auto-save Successful',
      message: 'KES 500 has been saved to your Emergency Fund',
      type: 'success',
      is_read: true,
      action_url: null,
      created_at: daysAgo(7),
    },
    {
      id: 'notif-004',
      user_id: powerUser.id,
      title: 'Challenge Completed!',
      message: 'Congratulations! You completed the New Year Boost challenge and earned 20 lottery entries!',
      type: 'achievement',
      is_read: true,
      action_url: '/rewards',
      created_at: daysAgo(35),
    },
    {
      id: 'notif-005',
      user_id: powerUser.id,
      title: 'Goal Achieved',
      message: 'You reached your Wedding goal! Time to celebrate!',
      type: 'achievement',
      is_read: true,
      action_url: '/goals/goal-006',
      created_at: daysAgo(30),
    },
    {
      id: 'notif-006',
      user_id: powerUser.id,
      title: 'Lottery Draw Soon',
      message: 'The next lottery draw is in 7 days. You have 20 entries!',
      type: 'info',
      is_read: false,
      action_url: '/rewards',
      created_at: daysAgo(1),
    },
  ];
}

// Main seed data generation function
export function generateSeedData(): Record<string, any[]> {
  const users = generateUsers();
  const goals = generateGoals(users);
  const transactions = generateTransactions(users, goals);
  const challenges = generateChallenges();
  const participants = generateChallengeParticipants(users, challenges);
  const referrals = generateReferrals(users);
  const lotteryEntries = generateLotteryEntries(users);
  const notifications = generateNotifications(users);

  return {
    user_profiles: users,
    goals,
    transactions,
    challenges,
    challenge_participants: participants,
    referrals,
    lottery_entries: lotteryEntries,
    notifications,
  };
}
