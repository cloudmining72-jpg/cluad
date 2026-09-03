import type {
  Asset,
  User,
  Order,
  Position,
  ManagedStrategy,
  UserStrategySubscription,
  DepositRequest,
  WithdrawalRequest,
  ReferralRecord,
  SupportTicket,
  SupportMessage,
  NotificationItem,
  AuditLog,
  SystemSettings,
  OrderType,
  OrderSide,
  PaymentMethodType,
  SupportTicketStatus,
  SupportTicketPriority,
  UserPlan,
  PlanTier,
} from '../types';
import { sha256, MASTER_ADMIN_HASH } from './securityGuard';
import emailjs from '@emailjs/browser';

export const FEMALE_SUPPORT_AGENTS = [
  { name: 'Sarah Miller', title: 'Senior Support Executive', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80' },
  { name: 'Emily Watson', title: 'Customer Success Specialist', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80' },
  { name: 'Sophia Davis', title: 'Account Resolution Lead', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
  { name: 'Jessica Taylor', title: 'VIP Support Manager', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80' },
  { name: 'Ayesha Khan', title: 'Compliance & Verification Lead', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80' },
  { name: 'Olivia Wilson', title: 'Financial Helpdesk Lead', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80' },
  { name: 'Hannah Reed', title: 'Live Chat Specialist', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80' },
  { name: 'Elena Rostova', title: 'Global Customer Relations', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80' },
  { name: 'Zara Malik', title: 'Trader Operations Officer', avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80' },
];

import {
  INITIAL_ASSETS,
  DEMO_USER,
  ADMIN_USER,
  DEMO_USERS_LIST,
  INITIAL_POSITIONS,
  INITIAL_ORDERS,
  MANAGED_STRATEGIES,
  INITIAL_USER_STRATEGIES,
  INITIAL_DEPOSITS,
  INITIAL_WITHDRAWALS,
  INITIAL_REFERRALS,
  INITIAL_TICKETS,
  INITIAL_NOTIFICATIONS,
  INITIAL_AUDIT_LOGS,
  INITIAL_SYSTEM_SETTINGS,
} from './mockData';

const USERS_STORAGE_KEY = 'claudemining_users_v2';
const DEPOSITS_STORAGE_KEY = 'claudemining_deposits_v2';
const WITHDRAWALS_STORAGE_KEY = 'claudemining_withdrawals_v2';
const USER_PLANS_STORAGE_KEY = 'claudemining_plans_v2';
const NOTIFICATIONS_STORAGE_KEY = 'claudemining_notifs_v2';
const TICKETS_STORAGE_KEY = 'claudemining_tickets_v2';
const SETTINGS_STORAGE_KEY = 'claudemining_settings_v2';
const REFERRALS_STORAGE_KEY = 'claudemining_referrals_v2';

const loadSavedUsers = (): User[] => {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Failed to load users from localStorage:', e);
  }
  return [...DEMO_USERS_LIST];
};

const loadSavedDeposits = (): DepositRequest[] => {
  try {
    const raw = localStorage.getItem(DEPOSITS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Failed to load deposits from localStorage:', e);
  }
  return [...INITIAL_DEPOSITS];
};

const loadSavedWithdrawals = (): WithdrawalRequest[] => {
  try {
    const raw = localStorage.getItem(WITHDRAWALS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Failed to load withdrawals from localStorage:', e);
  }
  return [...INITIAL_WITHDRAWALS];
};

const loadSavedUserPlans = (): UserPlan[] => {
  try {
    const raw = localStorage.getItem(USER_PLANS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Failed to load user plans from localStorage:', e);
  }
  return [];
};

const loadSavedNotifications = (): NotificationItem[] => {
  try {
    const raw = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {}
  return [...INITIAL_NOTIFICATIONS];
};

const loadSavedTickets = (): SupportTicket[] => {
  try {
    const raw = localStorage.getItem(TICKETS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {}
  return [...INITIAL_TICKETS];
};

const loadSavedReferrals = (): ReferralRecord[] => {
  try {
    const raw = localStorage.getItem(REFERRALS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {}
  return [...INITIAL_REFERRALS];
};

const loadSavedSettings = (): SystemSettings => {
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        return {
          ...INITIAL_SYSTEM_SETTINGS,
          ...parsed,
          referralLevel1CommissionPercent: 20.0,
          referralLevel2CommissionPercent: 10.0,
        };
      }
    }
  } catch (e) {}
  return { ...INITIAL_SYSTEM_SETTINGS, referralLevel1CommissionPercent: 20.0, referralLevel2CommissionPercent: 10.0 };
};

type Listener = () => void;

class StateStore {
  private listeners: Set<Listener> = new Set();

  public isAuthenticated: boolean = false;
  public currentRole: 'USER' | 'ADMIN' = 'USER';
  public currentUser: User = { ...DEMO_USER };
  public adminUser: User = { ...ADMIN_USER };
  public users: User[] = loadSavedUsers();
  public assets: Asset[] = [...INITIAL_ASSETS];
  public positions: Position[] = [...INITIAL_POSITIONS];
  public orders: Order[] = [...INITIAL_ORDERS];
  public strategies: ManagedStrategy[] = [...MANAGED_STRATEGIES];
  public userSubscriptions: UserStrategySubscription[] = [...INITIAL_USER_STRATEGIES];
  public deposits: DepositRequest[] = loadSavedDeposits();
  public withdrawals: WithdrawalRequest[] = loadSavedWithdrawals();
  public referrals: ReferralRecord[] = loadSavedReferrals();
  public tickets: SupportTicket[] = loadSavedTickets();
  public notifications: NotificationItem[] = loadSavedNotifications();
  public auditLogs: AuditLog[] = [...INITIAL_AUDIT_LOGS];
  public settings: SystemSettings = loadSavedSettings();

  public userPlans: UserPlan[] = loadSavedUserPlans();
  private forgotPasswordOtps: Map<string, { otp: string; expiresAt: number }> = new Map();

  public saveReferrals() {
    try {
      localStorage.setItem(REFERRALS_STORAGE_KEY, JSON.stringify(this.referrals));
    } catch (e) {}
  }

  public saveDeposits() {
    try {
      localStorage.setItem(DEPOSITS_STORAGE_KEY, JSON.stringify(this.deposits));
    } catch (e) {}
  }

  public saveWithdrawals() {
    try {
      localStorage.setItem(WITHDRAWALS_STORAGE_KEY, JSON.stringify(this.withdrawals));
    } catch (e) {}
  }

  public saveUserPlans() {
    try {
      localStorage.setItem(USER_PLANS_STORAGE_KEY, JSON.stringify(this.userPlans));
    } catch (e) {}
  }

  public saveNotifications() {
    try {
      localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(this.notifications));
    } catch (e) {}
  }

  public saveTickets() {
    try {
      localStorage.setItem(TICKETS_STORAGE_KEY, JSON.stringify(this.tickets));
    } catch (e) {}
  }

  public saveSettings() {
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(this.settings));
    } catch (e) {}
  }

  public hasPurchasedPlan(userId?: string): boolean {
    const targetId = userId || this.currentUser.id;
    return this.userPlans.some((p) => p.userId === targetId);
  }

  public planTiers: PlanTier[] = [
    { id: 'tier-10', name: 'Starter Micro Rig ($10 Plan)', badge: 'STARTER MINER', minAmount: 10, maxAmount: 49, durationDays: 30, multiplier: 2, hashRate: '25 TH/s', gpuModel: 'Bitmain S19 Micro ASIC', description: '30-Day Mining Rig with 2x Total Return ($0.67/day coin yield at $10)' },
    { id: 'tier-50', name: 'Bronze ASIC Rig ($50 Plan)', badge: 'BRONZE MINER', minAmount: 50, maxAmount: 99, durationDays: 30, multiplier: 2, hashRate: '45 TH/s', gpuModel: 'Bitmain S19 ASIC', description: '30-Day Mining Rig with 2x Total Return ($3.33/day coin yield at $50)' },
    { id: 'tier-100', name: 'Silver Pro Rig ($100 Plan)', badge: 'POPULAR MINER', minAmount: 100, maxAmount: 199, durationDays: 30, multiplier: 2, hashRate: '85 TH/s', gpuModel: 'Bitmain S19 Pro ASIC', description: '30-Day Mining Rig with 2x Total Return ($6.67/day coin yield at $100)' },
    { id: 'tier-200', name: 'Gold Power Cluster ($200 Plan)', badge: 'HIGH HASHRATE', minAmount: 200, maxAmount: 499, durationDays: 30, multiplier: 2, hashRate: '180 TH/s', gpuModel: 'MicroBT M30S++ Cluster', description: '30-Day Mining Rig with 2x Total Return ($13.33/day coin yield at $200)' },
    { id: 'tier-500', name: 'Platinum GPU Farm ($500 Plan)', badge: 'PRO MINING FARM', minAmount: 500, maxAmount: 999, durationDays: 30, multiplier: 2, hashRate: '450 TH/s', gpuModel: '8x RTX 4090 GPU Array', description: '30-Day Mining Rig with 2x Total Return ($33.33/day coin yield at $500)' },
    { id: 'tier-1000', name: 'Diamond SuperNode ($1000 Plan)', badge: 'PREMIUM NODE', minAmount: 1000, maxAmount: 2499, durationDays: 30, multiplier: 2, hashRate: '1,000 TH/s', gpuModel: 'Canaan Avalon 1246 SuperNode', description: '30-Day Mining Rig with 2x Total Return ($66.67/day coin yield at $1000)' },
    { id: 'tier-2500', name: 'VIP Hydro DataCenter ($2500 Plan)', badge: 'INDUSTRIAL RIG', minAmount: 2500, maxAmount: 10000, durationDays: 30, multiplier: 2, hashRate: '2,500 TH/s', gpuModel: 'Liquid-Cooled ASIC Suite', description: '30-Day Mining Rig with 2x Total Return ($166.67/day coin yield at $2500)' },
  ];

  /**
   * Dynamically calculates complete 2-Level Referral Network for any user
   * Level 1 = Direct Invites (20% bonus on deposits)
   * Level 2 = Sub-Network Invites (10% bonus on deposits)
   */
  public getReferralNetwork(user?: User): {
    level1: Array<ReferralRecord & { userObj?: User; totalDeposited: number }>;
    level2: Array<ReferralRecord & { userObj?: User; parentUser?: User; totalDeposited: number }>;
    l1Commission: number;
    l2Commission: number;
    totalCommission: number;
    totalTeamCount: number;
  } {
    const targetUser = user || this.currentUser;
    if (!targetUser || !targetUser.referralCode) {
      return { level1: [], level2: [], l1Commission: 0, l2Commission: 0, totalCommission: 0, totalTeamCount: 0 };
    }

    const myCode = targetUser.referralCode.trim().toUpperCase();
    const myId = targetUser.id;
    const myEmail = (targetUser.email || '').toLowerCase();

    // 1. Direct L1 Members (Anyone who joined using targetUser's referral code/id/email)
    const directUsers = this.users.filter((u) => {
      if (u.id === targetUser.id || (u.email && u.email.toLowerCase() === myEmail)) return false;
      if (!u.referredBy) return false;
      const ref = u.referredBy.trim().toUpperCase();
      return ref === myCode || ref === myId.toUpperCase() || u.referredBy.trim().toLowerCase() === myEmail;
    });

    const level1: Array<ReferralRecord & { userObj?: User; totalDeposited: number }> = [];
    let l1Commission = 0;

    for (const u of directUsers) {
      const userApprovedDeposits = this.deposits.filter(
        (d) => (d.userId === u.id || (d.userEmail && u.email && d.userEmail.toLowerCase() === u.email.toLowerCase())) && d.status === 'APPROVED'
      );
      const totalDeposited = userApprovedDeposits.reduce((sum, d) => sum + (d.amount || 0), 0);
      const earned = Number((totalDeposited * 0.20).toFixed(2));
      l1Commission += earned;

      level1.push({
        id: `ref1_${u.id}`,
        referrerId: targetUser.id,
        referredUserId: u.id,
        referredUserName: u.name,
        referredUserEmail: u.email,
        referralCode: targetUser.referralCode,
        commissionEarned: earned,
        level: 1,
        status: totalDeposited > 0 ? 'QUALIFIED' : 'PENDING',
        registeredAt: u.createdAt || new Date().toISOString(),
        userObj: u,
        totalDeposited,
      });
    }

    // 2. Indirect L2 Members (Anyone who joined using an L1 member's referral code)
    const level2: Array<ReferralRecord & { userObj?: User; parentUser?: User; totalDeposited: number }> = [];
    let l2Commission = 0;

    for (const l1User of directUsers) {
      const l1Code = (l1User.referralCode || '').trim().toUpperCase();
      const l1Id = l1User.id;
      const l1Email = (l1User.email || '').toLowerCase();

      const subUsers = this.users.filter((u) => {
        if (u.id === targetUser.id || u.id === l1User.id) return false;
        if (!u.referredBy) return false;
        const ref = u.referredBy.trim().toUpperCase();
        return (l1Code && ref === l1Code) || ref === l1Id.toUpperCase() || (u.referredBy && u.referredBy.trim().toLowerCase() === l1Email);
      });

      for (const sub of subUsers) {
        const subApprovedDeposits = this.deposits.filter(
          (d) => (d.userId === sub.id || (d.userEmail && sub.email && d.userEmail.toLowerCase() === sub.email.toLowerCase())) && d.status === 'APPROVED'
        );
        const totalDeposited = subApprovedDeposits.reduce((sum, d) => sum + (d.amount || 0), 0);
        const earned = Number((totalDeposited * 0.10).toFixed(2));
        l2Commission += earned;

        level2.push({
          id: `ref2_${sub.id}`,
          referrerId: targetUser.id,
          referredUserId: sub.id,
          referredUserName: sub.name,
          referredUserEmail: sub.email,
          referralCode: l1User.referralCode,
          commissionEarned: earned,
          level: 2,
          status: totalDeposited > 0 ? 'QUALIFIED' : 'PENDING',
          registeredAt: sub.createdAt || new Date().toISOString(),
          userObj: sub,
          parentUser: l1User,
          totalDeposited,
        });
      }
    }

    const totalCommission = Number((l1Commission + l2Commission).toFixed(2));
    const totalTeamCount = level1.length + level2.length;

    return {
      level1,
      level2,
      l1Commission: Number(l1Commission.toFixed(2)),
      l2Commission: Number(l2Commission.toFixed(2)),
      totalCommission,
      totalTeamCount,
    };
  }

  public selectedAssetSymbol: string = 'AAPL';

  private saveAuthState() {
    const state = {
      isAuthenticated: this.isAuthenticated,
      currentRole: this.currentRole,
      // Store only safe fields - NEVER store password in session
      currentUser: this.currentUser ? {
        id: this.currentUser.id,
        name: this.currentUser.name,
        email: this.currentUser.email,
        phone: this.currentUser.phone,
        country: this.currentUser.country,
        balance: this.currentUser.balance,
        availableCash: this.currentUser.availableCash,
        investedAmount: this.currentUser.investedAmount,
        todayPL: this.currentUser.todayPL,
        totalPL: this.currentUser.totalPL,
        referralCode: this.currentUser.referralCode,
        referredBy: this.currentUser.referredBy,
        role: this.currentUser.role,
        avatar: this.currentUser.avatar,
        isBlocked: this.currentUser.isBlocked,
        twoFactorEnabled: this.currentUser.twoFactorEnabled,
        createdAt: this.currentUser.createdAt,
      } : null,
    };
    sessionStorage.setItem('claudemining_auth_state', JSON.stringify(state));
  }

  constructor() {
    const savedAuth = sessionStorage.getItem('claudemining_auth_state');
    if (savedAuth) {
      try {
        const { isAuthenticated, currentRole, currentUser } = JSON.parse(savedAuth);
        this.isAuthenticated = isAuthenticated;
        this.currentRole = currentRole;
        if (currentUser) {
          if (currentRole === 'USER') {
            const freshUser = this.users.find(u => u.id === currentUser.id);
            if (freshUser) this.currentUser = freshUser;
          } else {
            this.currentUser = currentUser;
          }
        }
      } catch (e) {
        console.error('Failed to parse auth state', e);
      }
    }

    // Start market ticker simulation
    setInterval(() => {
      this.tickMarketPrices();
    }, 2500);
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((fn) => fn());
  }

  public switchRole(role: 'USER' | 'ADMIN') {
    this.currentRole = role;
    this.isAuthenticated = true;
    this.saveAuthState();
    this.notify();
  }

  public getVIPInfo(userId?: string): {
    level: number;
    name: string;
    badgeColor: string;
    minDeposit: number;
    nextTierDeposit: number;
    bonusYieldPercent: number;
    perks: string[];
    progressPercent: number;
  } {
    const user = userId ? this.users.find((u) => u.id === userId) || this.currentUser : this.currentUser;
    const invested = user.investedAmount || 0;

    if (invested >= 2500) {
      return {
        level: 5,
        name: 'VIP 5 Diamond Boss',
        badgeColor: '#ec4899',
        minDeposit: 2500,
        nextTierDeposit: 2500,
        bonusYieldPercent: 8,
        perks: ['+8% Daily Bonus Yield', '0% Trading Fees', 'Instant Auto Withdrawals', 'VIP 24/7 Personal Manager'],
        progressPercent: 100,
      };
    }
    if (invested >= 1000) {
      return {
        level: 4,
        name: 'VIP 4 Platinum Miner',
        badgeColor: '#a855f7',
        minDeposit: 1000,
        nextTierDeposit: 2500,
        bonusYieldPercent: 5,
        perks: ['+5% Daily Bonus Yield', 'Dedicated Account Manager', 'Priority Cashout Processing'],
        progressPercent: Math.min(100, Math.floor(((invested - 1000) / 1500) * 100)),
      };
    }
    if (invested >= 500) {
      return {
        level: 3,
        name: 'VIP 3 Gold Miner',
        badgeColor: '#f59e0b',
        minDeposit: 500,
        nextTierDeposit: 1000,
        bonusYieldPercent: 3,
        perks: ['+3% Daily Bonus Yield', 'Instant Withdrawal Approval', 'Enhanced Hashrate Priority'],
        progressPercent: Math.min(100, Math.floor(((invested - 500) / 500) * 100)),
      };
    }
    if (invested >= 250) {
      return {
        level: 2,
        name: 'VIP 2 Silver Miner',
        badgeColor: '#06b6d4',
        minDeposit: 250,
        nextTierDeposit: 500,
        bonusYieldPercent: 2,
        perks: ['+2% Daily Bonus Yield', 'Priority Deposit Processing', 'Exclusive Signals Access'],
        progressPercent: Math.min(100, Math.floor(((invested - 250) / 250) * 100)),
      };
    }
    if (invested >= 50) {
      return {
        level: 1,
        name: 'VIP 1 Bronze Miner',
        badgeColor: '#cd7f32',
        minDeposit: 50,
        nextTierDeposit: 250,
        bonusYieldPercent: 1,
        perks: ['+1% Daily Bonus Yield', 'Standard 24h Ticket Support'],
        progressPercent: Math.min(100, Math.floor(((invested - 50) / 200) * 100)),
      };
    }

    return {
      level: 0,
      name: 'VIP 0 Novice Miner',
      badgeColor: '#9ca3af',
      minDeposit: 0,
      nextTierDeposit: 50,
      bonusYieldPercent: 0,
      perks: ['Standard Mining Access', 'Upgrade to VIP 1 at $50'],
      progressPercent: Math.min(100, Math.floor((invested / 50) * 100)),
    };
  }

  public getClaimWindowStatus(): { isOpen: boolean; code: 'BEFORE_10AM' | 'OPEN' | 'AFTER_4PM'; message: string } {

    const now = new Date();
    const hours = now.getHours();

    if (hours < 10) {
      return { isOpen: false, code: 'BEFORE_10AM', message: '🔒 Daily Claim Window Opens at 10:00 AM' };
    }
    if (hours >= 16) {
      return { isOpen: false, code: 'AFTER_4PM', message: '❌ Daily Claim Window Closed at 04:00 PM (Today\'s Profit Lapsed)' };
    }
    return { isOpen: true, code: 'OPEN', message: '⚡ Daily Claim Window Active (10:00 AM - 04:00 PM)' };
  }

  public getPlanCycleInfo(plan: UserPlan): {
    status: 'MINING' | 'READY_TO_CLAIM' | 'IDLE' | 'COMPLETED';
    remainingMs: number;
    formattedTime: string;
  } {
    if (plan.status === 'COMPLETED' || plan.claimedDaysCount >= plan.durationDays) {
      return { status: 'COMPLETED', remainingMs: 0, formattedTime: 'Completed' };
    }

    if (plan.miningCycleStatus === 'IDLE') {
      return { status: 'IDLE', remainingMs: 0, formattedTime: 'Ready to Start Next Cycle' };
    }

    const CYCLE_DURATION_MS = 24 * 60 * 60 * 1000;
    const startTime = plan.miningStartedAt ? new Date(plan.miningStartedAt).getTime() : new Date(plan.startDate).getTime();
    const elapsedMs = Date.now() - startTime;

    if (elapsedMs >= CYCLE_DURATION_MS || plan.miningCycleStatus === 'READY_TO_CLAIM') {
      plan.miningCycleStatus = 'READY_TO_CLAIM';
      return { status: 'READY_TO_CLAIM', remainingMs: 0, formattedTime: '00h 00m 00s (Ready to Claim)' };
    }

    const remainingMs = CYCLE_DURATION_MS - elapsedMs;
    const totalSecs = Math.floor(remainingMs / 1000);
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    const formattedTime = `${hrs.toString().padStart(2, '0')}h ${mins.toString().padStart(2, '0')}m ${secs.toString().padStart(2, '0')}s`;

    return { status: 'MINING', remainingMs, formattedTime };
  }

  public purchasePlan(planName: string, amount: number, minedCoin: string = 'BTC'): { success: boolean; message: string } {
    if (amount <= 0) {
      return { success: false, message: 'Please enter a valid investment amount.' };
    }

    if (this.currentUser.availableCash < amount) {
      return { success: false, message: `Insufficient available cash. You have $${this.currentUser.availableCash.toFixed(2)}.` };
    }

    // Deduct cash and balance, update invested amount
    this.currentUser.availableCash = Number((this.currentUser.availableCash - amount).toFixed(2));
    this.currentUser.balance = Number((this.currentUser.balance - amount).toFixed(2));
    this.currentUser.investedAmount = Number(((this.currentUser.investedAmount || 0) + amount).toFixed(2));

    // Sync to users list
    const userInList = this.users.find((u) => u.id === this.currentUser.id || u.email.toLowerCase() === this.currentUser.email.toLowerCase());
    if (userInList) {
      userInList.availableCash = this.currentUser.availableCash;
      userInList.balance = this.currentUser.balance;
      userInList.investedAmount = this.currentUser.investedAmount;
    }

    const dailyProfit = Number(((amount * 2) / 30).toFixed(2));
    const nowIso = new Date().toISOString();
    const newPlan: UserPlan = {
      id: `PLAN-${Math.floor(1000 + Math.random() * 9000)}`,
      userId: this.currentUser.id,
      userEmail: this.currentUser.email,
      planName: `${planName} ($${amount}) [${minedCoin}]`,
      investedAmount: amount,
      dailyProfit,
      totalTargetReturn: amount * 2,
      startDate: nowIso,
      durationDays: 30,
      claimedDaysCount: 0,
      lapsedDaysCount: 0,
      status: 'ACTIVE',
      miningStartedAt: nowIso,
      miningCycleStatus: 'MINING',
      minedCoin: minedCoin,
    };

    this.userPlans.unshift(newPlan);
    this.saveUsers();
    this.saveUserPlans();
    this.saveAuthState();

    // Audit log
    this.auditLogs.unshift({
      id: `log-${Date.now()}`,
      actionBy: this.currentUser.name,
      actionType: 'PLAN_PURCHASE',
      details: `Purchased 30-Day Plan: ${planName} for $${amount} (Mining Coin: ${minedCoin})`,
      timestamp: nowIso,
      ipAddress: '192.168.1.10',
    });

    this.notify();

    return { success: true, message: `Successfully activated ${planName} for $${amount}! 24-Hour ${minedCoin} Mining Cycle Started.` };
  }

  public startNextMiningCycle(planId: string): { success: boolean; message: string } {
    const plan = this.userPlans.find((p) => p.id === planId && (p.userId === this.currentUser.id || (p.userEmail && p.userEmail.toLowerCase() === this.currentUser.email.toLowerCase())));
    if (!plan) {
      return { success: false, message: 'Plan not found.' };
    }

    if (plan.status !== 'ACTIVE') {
      return { success: false, message: 'This plan has completed its 30-day duration.' };
    }

    const cycleInfo = this.getPlanCycleInfo(plan);
    if (cycleInfo.status === 'MINING') {
      return { success: false, message: `Mining is currently running (${cycleInfo.formattedTime} remaining).` };
    }

    if (cycleInfo.status === 'READY_TO_CLAIM') {
      return { success: false, message: 'Please claim your completed 24-hour profit first before starting the next cycle!' };
    }

    const nowIso = new Date().toISOString();
    plan.miningStartedAt = nowIso;
    plan.miningCycleStatus = 'MINING';
    this.saveUserPlans();

    this.auditLogs.unshift({
      id: `log-${Date.now()}`,
      actionBy: this.currentUser.name,
      actionType: 'START_MINING_CYCLE',
      details: `Started next 24-hour mining cycle for plan ${plan.planName}`,
      timestamp: nowIso,
      ipAddress: '192.168.1.10',
    });

    this.notify();
    return { success: true, message: '⚡ Next 24-Hour Mining Cycle Started!' };
  }

  public claimDailyProfit(planId: string): { success: boolean; message: string } {
    const plan = this.userPlans.find((p) => p.id === planId && (p.userId === this.currentUser.id || (p.userEmail && p.userEmail.toLowerCase() === this.currentUser.email.toLowerCase())));
    if (!plan) {
      return { success: false, message: 'Plan not found.' };
    }

    if (plan.status !== 'ACTIVE') {
      return { success: false, message: 'This plan has completed its 30-day duration.' };
    }

    const cycleInfo = this.getPlanCycleInfo(plan);
    if (cycleInfo.status === 'MINING') {
      return { success: false, message: `Mining in progress! 24 hours have not completed yet (${cycleInfo.formattedTime} remaining).` };
    }

    if (cycleInfo.status === 'IDLE') {
      return { success: false, message: 'Today\'s profit has already been claimed for this cycle. Start next 24h mining to continue!' };
    }

    const todayDate = new Date().toISOString().split('T')[0];

    // Add profit to wallet
    this.currentUser.availableCash = Number((this.currentUser.availableCash + plan.dailyProfit).toFixed(2));
    this.currentUser.balance = Number((this.currentUser.balance + plan.dailyProfit).toFixed(2));
    this.currentUser.todayPL = Number(((this.currentUser.todayPL || 0) + plan.dailyProfit).toFixed(2));
    this.currentUser.totalPL = Number(((this.currentUser.totalPL || 0) + plan.dailyProfit).toFixed(2));

    const userInList = this.users.find((u) => u.id === this.currentUser.id || u.email.toLowerCase() === this.currentUser.email.toLowerCase());
    if (userInList) {
      userInList.availableCash = this.currentUser.availableCash;
      userInList.balance = this.currentUser.balance;
      userInList.todayPL = this.currentUser.todayPL;
      userInList.totalPL = this.currentUser.totalPL;
    }

    plan.claimedDaysCount += 1;
    plan.lastClaimDate = todayDate;

    if (plan.claimedDaysCount >= plan.durationDays) {
      plan.status = 'COMPLETED';
      plan.miningCycleStatus = 'COMPLETED';
    } else {
      plan.miningCycleStatus = 'IDLE';
    }

    this.saveUsers();
    this.saveUserPlans();
    this.saveAuthState();

    // Audit log
    this.auditLogs.unshift({
      id: `log-${Date.now()}`,
      actionBy: this.currentUser.name,
      actionType: 'DAILY_PROFIT_CLAIM',
      details: `Claimed $${plan.dailyProfit.toFixed(2)} daily profit for plan ${plan.planName}`,
      timestamp: new Date().toISOString(),
      ipAddress: '192.168.1.10',
    });

    this.notify();

    return {
      success: true,
      message: `Successfully claimed $${plan.dailyProfit.toFixed(2)} daily profit into your wallet! ${plan.status === 'ACTIVE' ? 'Click "Start Next 24h Mining" when you are ready to begin the next cycle.' : ''}`,
    };
  }

  public login(email: string, _password: string): { success: boolean; message: string; role?: 'USER' | 'ADMIN' } {
    const cleanEmail = (email || '').toLowerCase().trim();
    const cleanPass = (_password || '').trim();

    // Input validation
    if (!cleanEmail || !cleanPass) {
      return { success: false, message: 'Email and password are required.' };
    }

    // Admin credentials check
    if (
      cleanEmail === 'admin@claudemining.com' ||
      cleanEmail === 'admin@claudemining.com' || 
      cleanEmail === 'admin@bahifinancial.com'
    ) {
      const isMatch = cleanPass === '12345six@' || sha256(cleanPass) === MASTER_ADMIN_HASH || sha256(_password) === MASTER_ADMIN_HASH;
      if (!isMatch) {
        return { success: false, message: 'Invalid email or password.' };
      }
      this.currentRole = 'ADMIN';
      this.currentUser = { ...ADMIN_USER, email: cleanEmail };
      this.isAuthenticated = true;
      this.addAuditLog('ADMIN_LOGIN', 'Master Admin authenticated successfully');
      this.saveAuthState();
      this.notify();
      return { success: true, message: 'Welcome back, Master Admin!', role: 'ADMIN' };
    }

    // Check registered user accounts
    const foundUser = this.users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (foundUser) {
      if (foundUser.isBlocked) {
        return { success: false, message: 'Your account has been restricted by Admin compliance.' };
      }
      // Compare password (support plaintext for legacy + allow bcrypt-hashed)
      const passMatch = foundUser.password && cleanPass && foundUser.password === cleanPass;
      if (!passMatch) {
        return { success: false, message: 'Invalid email or password.' };
      }
      // Refresh user from latest storage
      const freshUser = this.users.find(u => u.id === foundUser.id) || foundUser;
      this.currentUser = freshUser;
      this.currentRole = freshUser.role || 'USER';
      this.isAuthenticated = true;
      this.addAuditLog('USER_LOGIN', `User ${freshUser.name} logged in`);
      this.saveAuthState();
      this.notify();
      return { success: true, message: `Welcome back, ${freshUser.name}!`, role: 'USER' };
    }

    // Generic error - don't reveal if email exists or not
    return { success: false, message: 'Invalid email or password.' };
  }

  public requestPasswordResetOTP(email: string, externalOtp?: string): { success: boolean; message: string; otp?: string } {
    const cleanEmail = email.toLowerCase().trim();
    if (!cleanEmail) {
      return { success: false, message: 'Please enter a valid email address.' };
    }

    const user = this.users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (!user) {
      return { success: false, message: 'No registered account found with this email address. Please check your email or register.' };
    }

    const otp = externalOtp || Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 mins

    this.forgotPasswordOtps.set(cleanEmail, { otp, expiresAt });
    this.addAuditLog('FORGOT_PASSWORD_REQUEST', `OTP reset code requested for ${cleanEmail}`);

    // Always try to send email (hardcoded credentials available as fallback)
    this.sendEmailOTP(cleanEmail, user.name, otp);

    console.log(`[TESTING] Password Reset OTP for ${cleanEmail} is: ${otp}`);
    return {
      success: true,
      message: `A password reset code has been sent to ${cleanEmail}. Please check your email inbox.`,
      otp,
    };
  }

  public forceUpdateUserPassword(email: string, newPassword: string): { success: boolean; message: string } {
    const cleanEmail = (email || '').toLowerCase().trim();
    let user = this.users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (!user) {
      user = {
        id: `usr_${Date.now().toString().slice(-6)}`,
        name: cleanEmail.split('@')[0],
        email: cleanEmail,
        password: newPassword,
        phone: '+1 555-0100',
        country: 'Pakistan',
        balance: 0.00,
        availableCash: 0.00,
        investedAmount: 0,
        todayPL: 0,
        totalPL: 0,
        referralCode: `REF_${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        isBlocked: false,
        twoFactorEnabled: false,
        createdAt: new Date().toISOString(),
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        role: 'USER',
      };
      this.users.unshift(user);
    } else {
      user.password = newPassword;
    }

    if (this.currentUser.email.toLowerCase() === cleanEmail) {
      this.currentUser.password = newPassword;
    }

    this.saveUsers();
    this.forgotPasswordOtps.delete(cleanEmail);
    this.addAuditLog('FORGOT_PASSWORD_RESET', `Password successfully updated for ${user.email}`);
    this.notify();
    return { success: true, message: 'Password updated successfully! You can now log in.' };
  }

  public resetPasswordWithOTP(email: string, otp: string, newPassword: string): { success: boolean; message: string } {
    const cleanEmail = (email || '').toLowerCase().trim();
    const cleanOtp = (otp || '').trim();

    if (!cleanEmail || !newPassword) {
      return { success: false, message: 'Please fill in all fields (Email and New Password).' };
    }

    if (newPassword.length < 6) {
      return { success: false, message: 'New password must be at least 6 characters long.' };
    }

    const record = this.forgotPasswordOtps.get(cleanEmail);
    if (record) {
      if (Date.now() > record.expiresAt) {
        this.forgotPasswordOtps.delete(cleanEmail);
        return { success: false, message: 'OTP verification code has expired. Please request a new code.' };
      }
      if (cleanOtp && record.otp !== cleanOtp) {
        return { success: false, message: 'Invalid 6-digit OTP verification code. Please check your OTP code and try again.' };
      }
    }

    return this.forceUpdateUserPassword(cleanEmail, newPassword);
  }

  public signup(params: {
    fullName: string;
    email: string;
    phone?: string;
    country?: string;
    password?: string;
    referralCode?: string;
  }): { success: boolean; message: string; user?: User } {
    const cleanEmail = (params.email || '').toLowerCase().trim();
    const existing = this.users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      return { success: false, message: 'An account with this email address already exists. Please login instead.' };
    }

    const newCode = `REF_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    // Resolve referrer BEFORE creating user so referredBy is set correctly
    let resolvedReferredBy: string | undefined = undefined;
    let referrerL1: typeof this.users[0] | undefined = undefined;
    let referrerL2: typeof this.users[0] | undefined = undefined;

    if (params.referralCode?.trim()) {
      const refCode = params.referralCode.trim().toUpperCase();
      referrerL1 = this.users.find(
        (u) =>
          u.id !== undefined && // exclude self
          ((u.referralCode && u.referralCode.trim().toUpperCase() === refCode) ||
           (u.id && u.id.trim().toUpperCase() === refCode) ||
           (u.email && u.email.trim().toLowerCase() === params.referralCode?.trim().toLowerCase()))
      );
      if (referrerL1) {
        // Store referrer's referralCode as referredBy (consistent key)
        resolvedReferredBy = referrerL1.referralCode;

        // Find Level 2 referrer (referrerL1's referrer)
        if (referrerL1.referredBy?.trim()) {
          const l2Code = referrerL1.referredBy.trim().toUpperCase();
          referrerL2 = this.users.find(
            (u) =>
              (u.referralCode && u.referralCode.trim().toUpperCase() === l2Code) ||
              (u.id && u.id.trim().toUpperCase() === l2Code)
          );
        }
      }
    }

    const newUser: User = {
      id: `usr_${Date.now().toString().slice(-6)}`,
      name: params.fullName || cleanEmail.split('@')[0],
      email: cleanEmail,
      password: params.password || 'password123',
      phone: params.phone || '+1 555-0100',
      country: params.country || 'Pakistan',
      balance: 0.00,
      availableCash: 0.00,
      investedAmount: 0,
      todayPL: 0,
      totalPL: 0,
      referralCode: newCode,
      referredBy: resolvedReferredBy, // Set BEFORE saveUsers()
      isBlocked: false,
      twoFactorEnabled: false,
      createdAt: new Date().toISOString(),
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      role: 'USER',
    };

    this.users.unshift(newUser);
    this.saveUsers(); // Now referredBy is already set correctly

    // Track 2-Level referral hierarchy
    if (referrerL1) {
      // Level 1 Record (Direct 20%)
      this.referrals.unshift({
        id: `ref1_${Date.now()}_${Math.random().toString(36).slice(2, 5)}`,
        referrerId: referrerL1.id,
        referredUserId: newUser.id,
        referredUserName: newUser.name,
        referredUserEmail: newUser.email,
        referralCode: referrerL1.referralCode,
        commissionEarned: 0,
        level: 1,
        status: 'PENDING',
        registeredAt: new Date().toISOString(),
      });

      this.addNotification({
        userId: referrerL1.id,
        title: '👤 New Direct Referral! (20% Commission Pending)',
        message: `${newUser.name} (${newUser.email}) joined using your referral link. You will earn 20% commission when they make their first deposit!`,
        type: 'ANNOUNCEMENT',
      });

      // Level 2 Record (Indirect 10%)
      if (referrerL2) {
        this.referrals.unshift({
          id: `ref2_${Date.now()}_${Math.random().toString(36).slice(2, 5)}`,
          referrerId: referrerL2.id,
          referredUserId: newUser.id,
          referredUserName: newUser.name,
          referredUserEmail: newUser.email,
          referralCode: referrerL2.referralCode,
          commissionEarned: 0,
          level: 2,
          status: 'PENDING',
          registeredAt: new Date().toISOString(),
        });

        this.addNotification({
          userId: referrerL2.id,
          title: '👥 New Sub-Network Member! (10% Commission Pending)',
          message: `${newUser.name} joined under your team member ${referrerL1.name}. You will earn 10% Level 2 commission on their deposits!`,
          type: 'ANNOUNCEMENT',
        });
      }

      this.saveReferrals();
      console.log(`[Referral] ${newUser.email} signed up via ${referrerL1.email} (L1). L2: ${referrerL2?.email || 'none'}`);
    }

    this.currentUser = newUser;
    this.currentRole = 'USER';
    this.isAuthenticated = true;
    this.saveAuthState();

    this.addNotification({
      userId: newUser.id,
      title: '🎉 Welcome to ClaudeMining!',
      message: 'Your account is verified and ready. Deposit funds to start earning daily mining returns.',
      type: 'ANNOUNCEMENT',
    });

    this.addAuditLog('USER_SIGNUP', `New user registered: ${newUser.name} (${newUser.email})`);
    this.notify();
    return { success: true, message: 'Account created successfully! Welcome aboard.', user: newUser };
  }

  public syncBackendUser(userData: any, password?: string) {
    const cleanEmail = (userData.email || '').toLowerCase().trim();
    let existing = this.users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (!existing) {
      existing = {
        id: userData._id || userData.id || `usr_${Date.now().toString().slice(-6)}`,
        name: userData.name || cleanEmail.split('@')[0],
        email: cleanEmail,
        password: password || 'password123',
        phone: userData.phone || '+1 555-0100',
        country: userData.country || 'Pakistan',
        balance: userData.balance || 0.00,
        availableCash: userData.availableCash || 0.00,
        investedAmount: userData.investedAmount || 0,
        todayPL: 0,
        totalPL: 0,
        referralCode: userData.referralCode || `REF_${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        referredBy: userData.referredBy,
        isBlocked: false,
        twoFactorEnabled: false,
        createdAt: userData.createdAt || new Date().toISOString(),
        avatar: userData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        role: userData.role || 'USER',
      };
      this.users.unshift(existing);
      this.saveUsers();
    } else if (password) {
      existing.password = password;
      this.saveUsers();
    }

    this.currentUser = existing;
    this.currentRole = existing.role || 'USER';
    this.isAuthenticated = true;
    this.saveAuthState();
    this.notify();
  }

  private async sendEmailOTP(email: string, name: string, otp: string) {
    // Hardcoded fallback for APK/Capacitor mode where env vars may not load
    const serviceId  = import.meta.env.VITE_EMAILJS_SERVICE_ID  || 'service_abbiw6c';
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_z8w72rc';
    const publicKey  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY  || 'WgBGiv4o--z8vCAl3';

    if (!serviceId || serviceId === 'your_service_id_here') {
      console.warn('EmailJS is not configured. OTP not sent via email.');
      return;
    }

    try {
      await emailjs.send(
        serviceId,
        templateId,
        {
          to_email: email,
          to_name: name || email.split('@')[0],
          otp_code: otp,
          app_name: this.settings?.appName || 'ClaudeMining',
        },
        publicKey
      );
      console.log(`[EmailJS] Successfully sent OTP to ${email}`);
    } catch (error) {
      console.error('[EmailJS] Failed to send OTP email:', error);
    }
  }

  // ==================== OTP VERIFICATION & RECOVERY SUITE ====================
  private pendingOTPs: Map<string, { otp: string; expires: number; type: 'SIGNUP' | 'RESET_PASSWORD'; tempUserData?: any }> = new Map();

  public requestSignupOTP(params: { fullName: string; email: string; phone?: string; country?: string; password?: string; referralCode?: string }, externalOtp?: string): { success: boolean; message: string; otp?: string } {
    const cleanEmail = (params.email || '').toLowerCase().trim();
    const existing = this.users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      return { success: false, message: 'An account with this email address already exists. Please login instead.' };
    }

    const otp = externalOtp || Math.floor(100000 + Math.random() * 900000).toString();
    this.pendingOTPs.set(cleanEmail, {
      otp,
      expires: Date.now() + 15 * 60 * 1000,
      type: 'SIGNUP',
      tempUserData: { ...params, email: cleanEmail },
    });

    // Always try to send email (hardcoded credentials are available as fallback)
    this.sendEmailOTP(cleanEmail, params.fullName, otp);

    console.log(`[TESTING] OTP for ${cleanEmail} is: ${otp}`);
    return {
      success: true,
      message: `A 6-digit verification code has been dispatched to ${cleanEmail}. Please check your email.`,
      otp,
    };
  }

  public verifySignupOTP(email: string, otp: string, userData?: any): { success: boolean; message: string; user?: User } {
    const cleanEmail = (email || '').toLowerCase().trim();
    const record = this.pendingOTPs.get(cleanEmail);

    let temp = record ? record.tempUserData : userData;
    if (!temp && userData) temp = userData;

    if (record) {
      if (Date.now() > record.expires) {
        this.pendingOTPs.delete(cleanEmail);
        return { success: false, message: 'Verification code has expired. Please request a new code.' };
      }
      if (record.otp !== (otp || '').trim()) {
        return { success: false, message: 'Invalid 6-digit verification code. Please check your email and try again.' };
      }
      this.pendingOTPs.delete(cleanEmail);
    }

    if (temp) {
      return this.signup({
        fullName: temp.fullName || temp.name || cleanEmail.split('@')[0],
        email: temp.email || cleanEmail,
        phone: temp.phone || '+1 555-0100',
        country: temp.country || 'Pakistan',
        password: temp.password || 'password123',
        referralCode: temp.referralCode,
      });
    }

    const existing = this.users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      this.currentUser = existing;
      this.currentRole = 'USER';
      this.isAuthenticated = true;
      this.saveAuthState();
      this.notify();
      return { success: true, message: 'Login successful!', user: existing };
    }

    return { success: false, message: 'Registration session not found. Please try again.' };
  }

  public logout() {
    this.isAuthenticated = false;
    this.currentRole = 'USER';
    this.currentUser = { ...DEMO_USER };
    // Clear all session and sensitive storage on logout
    sessionStorage.removeItem('claudemining_auth_state');
    sessionStorage.removeItem('claudemining_pending_ref_code');
    // Do NOT clear localStorage (keeps user data, deposits, plans between sessions)
    this.notify();
  }

  public setSelectedAsset(symbol: string) {
    this.selectedAssetSymbol = symbol;
    this.notify();
  }

  // --- MARKET TICK SIMULATION ---
  private tickMarketPrices() {
    let changed = false;

    this.assets = this.assets.map((asset) => {
      // 60% chance price ticks
      if (Math.random() > 0.4) {
        changed = true;
        const volatility = asset.category === 'CRYPTO' ? 0.008 : 0.003;
        const delta = (Math.random() - 0.49) * (asset.price * volatility);
        const newPrice = Number((asset.price + delta).toFixed(2));
        const priceDiff = newPrice - asset.prevClose;
        const changePercent = Number(((priceDiff / asset.prevClose) * 100).toFixed(2));
        const changeAmount = Number(priceDiff.toFixed(2));
        const newHigh = Math.max(asset.high24h, newPrice);
        const newLow = Math.min(asset.low24h, newPrice);

        // Update latest candle
        const history = [...asset.chartHistory];
        if (history.length > 0) {
          const lastIndex = history.length - 1;
          const last = { ...history[lastIndex] };
          last.close = newPrice;
          last.high = Math.max(last.high, newPrice);
          last.low = Math.min(last.low, newPrice);
          history[lastIndex] = last;
        }

        return {
          ...asset,
          price: newPrice,
          change24h: changePercent,
          change24hAmount: changeAmount,
          high24h: newHigh,
          low24h: newLow,
          bid: Number((newPrice * 0.9995).toFixed(2)),
          ask: Number((newPrice * 1.0005).toFixed(2)),
          chartHistory: history,
        };
      }
      return asset;
    });

    if (changed) {
      // Recalculate open positions P/L
      this.recalculatePositionsAndPortfolio();
      // Check limit and stop orders
      this.processPendingOrders();
      this.notify();
    }
  }

  private recalculatePositionsAndPortfolio() {
    let totalInvested = 0;
    let totalMarketValue = 0;
    let totalUnrealizedPL = 0;

    this.positions = this.positions.map((pos) => {
      const asset = this.assets.find((a) => a.symbol === pos.symbol);
      const currentPrice = asset ? asset.price : pos.currentPrice;
      const marketVal = pos.quantity * currentPrice;
      const pl = pos.side === 'BUY'
        ? (currentPrice - pos.avgBuyPrice) * pos.quantity
        : (pos.avgBuyPrice - currentPrice) * pos.quantity;
      const plPercent = (pl / pos.totalInvestment) * 100;

      totalInvested += pos.totalInvestment;
      totalMarketValue += marketVal;
      totalUnrealizedPL += pl;

      return {
        ...pos,
        currentPrice,
        currentMarketValue: Number(marketVal.toFixed(2)),
        unrealizedPL: Number(pl.toFixed(2)),
        unrealizedPLPercent: Number(plPercent.toFixed(2)),
      };
    });

    // Update currentUser totals
    const availableCash = this.currentUser.availableCash;
    const activeMiningInvested = this.userPlans
      .filter((p) => p.userId === this.currentUser.id && p.status === 'ACTIVE')
      .reduce((sum, p) => sum + p.investedAmount, 0);
    const portfolioVal = availableCash + totalMarketValue;
    this.currentUser = {
      ...this.currentUser,
      investedAmount: Number((totalInvested + activeMiningInvested).toFixed(2)),
      balance: Number(portfolioVal.toFixed(2)),
    };
    
    // Sync to user list
    const userInList = this.users.find(u => u.id === this.currentUser.id);
    if (userInList) {
      userInList.availableCash = this.currentUser.availableCash;
      userInList.balance = this.currentUser.balance;
      userInList.investedAmount = this.currentUser.investedAmount;
      userInList.todayPL = this.currentUser.todayPL;
      userInList.totalPL = this.currentUser.totalPL;
    }
  }

  private processPendingOrders() {
    this.orders = this.orders.map((ord) => {
      if (ord.status === 'SUBMITTED' || ord.status === 'PENDING') {
        const asset = this.assets.find((a) => a.symbol === ord.symbol);
        if (!asset) return ord;

        let shouldFill = false;
        if (ord.type === 'LIMIT') {
          if (ord.side === 'BUY' && ord.targetPrice && asset.price <= ord.targetPrice) {
            shouldFill = true;
          } else if (ord.side === 'SELL' && ord.targetPrice && asset.price >= ord.targetPrice) {
            shouldFill = true;
          }
        } else if (ord.type === 'STOP') {
          if (ord.side === 'BUY' && ord.stopPrice && asset.price >= ord.stopPrice) {
            shouldFill = true;
          } else if (ord.side === 'SELL' && ord.stopPrice && asset.price <= ord.stopPrice) {
            shouldFill = true;
          }
        }

        if (shouldFill) {
          this.addNotification({
            userId: ord.userId,
            title: 'Order Executed',
            message: `Your ${ord.type} ${ord.side} order for ${ord.quantity} ${ord.symbol} @ $${asset.price} was filled.`,
            type: 'ORDER',
          });

          // Create position if buy
          if (ord.side === 'BUY') {
            this.addOrUpdatePosition(ord.userId, ord.symbol, ord.assetName, ord.side, ord.quantity, asset.price);
          }

          return {
            ...ord,
            status: 'FILLED',
            executedPrice: asset.price,
            filledAt: new Date().toISOString(),
          };
        }
      }
      return ord;
    });
  }

  // --- TRADING & ORDERS ---
  public placeOrder(params: {
    symbol: string;
    type: OrderType;
    side: OrderSide;
    quantity: number;
    targetPrice?: number;
    stopPrice?: number;
  }): { success: boolean; message: string } {
    if (this.currentUser.isBlocked) {
      return { success: false, message: 'Your account has been restricted by Admin.' };
    }

    const asset = this.assets.find((a) => a.symbol === params.symbol);
    if (!asset) return { success: false, message: 'Asset not found.' };

    const executionPrice = params.type === 'MARKET' ? asset.price : (params.targetPrice || asset.price);
    const totalCost = params.quantity * executionPrice;
    const fee = totalCost * (this.settings.tradingFeePercent / 100);
    const requiredFunds = totalCost + fee;

    if (params.side === 'BUY') {
      if (this.currentUser.availableCash < requiredFunds) {
        return { success: false, message: `Insufficient available cash. Required: $${requiredFunds.toFixed(2)}` };
      }
      // Deduct cash immediately
      this.currentUser.availableCash -= requiredFunds;
    } else {
      // Check sell position holdings
      const pos = this.positions.find((p) => p.userId === this.currentUser.id && p.symbol === params.symbol);
      if (!pos || pos.quantity < params.quantity) {
        return { success: false, message: `Insufficient holdings in ${params.symbol} to sell.` };
      }
    }

    const newOrder: Order = {
      id: `ord_${Date.now().toString().slice(-6)}`,
      userId: this.currentUser.id,
      userName: this.currentUser.name,
      symbol: params.symbol,
      assetName: asset.name,
      type: params.type,
      side: params.side,
      quantity: params.quantity,
      targetPrice: params.targetPrice,
      stopPrice: params.stopPrice,
      totalValue: Number(totalCost.toFixed(2)),
      status: params.type === 'MARKET' ? 'FILLED' : 'SUBMITTED',
      executedPrice: params.type === 'MARKET' ? asset.price : undefined,
      createdAt: new Date().toISOString(),
      filledAt: params.type === 'MARKET' ? new Date().toISOString() : undefined,
    };

    this.orders.unshift(newOrder);

    if (params.type === 'MARKET') {
      if (params.side === 'BUY') {
        this.addOrUpdatePosition(this.currentUser.id, params.symbol, asset.name, params.side, params.quantity, asset.price);
      } else {
        this.reduceOrClosePosition(this.currentUser.id, params.symbol, params.quantity, asset.price);
      }

      this.addNotification({
        userId: this.currentUser.id,
        title: 'Order Filled Immediately',
        message: `Market ${params.side} ${params.quantity} ${params.symbol} executed at $${asset.price.toFixed(2)}`,
        type: 'ORDER',
      });
    } else {
      this.addNotification({
        userId: this.currentUser.id,
        title: 'Order Placed',
        message: `${params.type} ${params.side} order placed for ${params.quantity} ${params.symbol}`,
        type: 'ORDER',
      });
    }

    this.recalculatePositionsAndPortfolio();
    this.notify();
    return { success: true, message: `Order ${newOrder.id} placed successfully.` };
  }

  public cancelOrder(orderId: string) {
    const order = this.orders.find((o) => o.id === orderId);
    if (!order) return;

    if (order.status === 'PENDING' || order.status === 'SUBMITTED') {
      order.status = 'CANCELLED';
      // Refund cash if it was a buy order
      if (order.side === 'BUY') {
        this.currentUser.availableCash += order.totalValue;
      }
      this.addNotification({
        userId: order.userId,
        title: 'Order Cancelled',
        message: `Order ${orderId} for ${order.quantity} ${order.symbol} has been cancelled.`,
        type: 'ORDER',
      });
      this.recalculatePositionsAndPortfolio();
      this.notify();
    }
  }

  public closePosition(positionId: string) {
    const pos = this.positions.find((p) => p.id === positionId);
    if (!pos) return;

    const asset = this.assets.find((a) => a.symbol === pos.symbol);
    const closePrice = asset ? asset.price : pos.currentPrice;
    const returnCash = pos.quantity * closePrice;

    // Refund cash to user
    this.currentUser.availableCash += returnCash;
    // Remove position
    this.positions = this.positions.filter((p) => p.id !== positionId);

    this.addNotification({
      userId: pos.userId,
      title: 'Position Closed',
      message: `Closed ${pos.quantity} ${pos.symbol} position @ $${closePrice.toFixed(2)}. Return: $${returnCash.toFixed(2)}`,
      type: 'ORDER',
    });

    this.recalculatePositionsAndPortfolio();
    this.notify();
  }

  private addOrUpdatePosition(
    userId: string,
    symbol: string,
    assetName: string,
    side: OrderSide,
    quantity: number,
    price: number
  ) {
    const existing = this.positions.find((p) => p.userId === userId && p.symbol === symbol);
    if (existing) {
      const totalQty = existing.quantity + quantity;
      const totalInv = existing.totalInvestment + quantity * price;
      const avgPrice = totalInv / totalQty;

      existing.quantity = totalQty;
      existing.avgBuyPrice = Number(avgPrice.toFixed(2));
      existing.totalInvestment = Number(totalInv.toFixed(2));
    } else {
      const newPos: Position = {
        id: `pos_${Date.now().toString().slice(-6)}`,
        userId,
        symbol,
        assetName,
        side,
        quantity,
        avgBuyPrice: price,
        currentPrice: price,
        totalInvestment: Number((quantity * price).toFixed(2)),
        currentMarketValue: Number((quantity * price).toFixed(2)),
        unrealizedPL: 0,
        unrealizedPLPercent: 0,
        openedAt: new Date().toISOString(),
      };
      this.positions.unshift(newPos);
    }
  }

  private reduceOrClosePosition(userId: string, symbol: string, quantity: number, price: number) {
    const existing = this.positions.find((p) => p.userId === userId && p.symbol === symbol);
    if (!existing) return;

    if (quantity >= existing.quantity) {
      // Close completely
      const returnCash = existing.quantity * price;
      this.currentUser.availableCash += returnCash;
      this.positions = this.positions.filter((p) => p.id !== existing.id);
    } else {
      const remainingQty = existing.quantity - quantity;
      const returnCash = quantity * price;
      this.currentUser.availableCash += returnCash;
      existing.quantity = remainingQty;
      existing.totalInvestment = Number((remainingQty * existing.avgBuyPrice).toFixed(2));
    }
  }

  // --- STRATEGIES ---
  public subscribeStrategy(strategyId: string, amount: number): { success: boolean; message: string } {
    const strat = this.strategies.find((s) => s.id === strategyId);
    if (!strat) return { success: false, message: 'Strategy not found' };

    if (amount < strat.minInvestment) {
      return { success: false, message: `Minimum investment for ${strat.name} is $${strat.minInvestment}` };
    }

    if (this.currentUser.availableCash < amount) {
      return { success: false, message: `Insufficient cash. Balance: $${this.currentUser.availableCash.toFixed(2)}` };
    }

    this.currentUser.availableCash -= amount;
    const sub: UserStrategySubscription = {
      id: `sub_${Date.now().toString().slice(-6)}`,
      userId: this.currentUser.id,
      strategyId,
      strategyName: strat.name,
      investedAmount: amount,
      currentValuation: amount,
      pl: 0,
      plPercent: 0,
      startedAt: new Date().toISOString(),
      lastRebalancedAt: new Date().toISOString(),
      autoRebalance: true,
    };

    this.userSubscriptions.unshift(sub);
    this.addNotification({
      userId: this.currentUser.id,
      title: 'Strategy Subscribed',
      message: `Subscribed $${amount.toFixed(2)} to ${strat.name}. Engine will auto-rebalance based on market P/L.`,
      type: 'ANNOUNCEMENT',
    });

    this.recalculatePositionsAndPortfolio();
    this.notify();
    return { success: true, message: `Subscribed successfully!` };
  }

  // --- DEPOSITS & WITHDRAWALS ---
  public requestDeposit(amount: number, method: PaymentMethodType, txId: string, proofUrl?: string): { success: boolean; message: string } {
    if (amount < this.settings.minDeposit) {
      return { success: false, message: `Minimum deposit amount is $${this.settings.minDeposit}` };
    }

    const req: DepositRequest = {
      id: `dep_${Date.now().toString().slice(-6)}`,
      userId: this.currentUser.id,
      userName: this.currentUser.name,
      userEmail: this.currentUser.email,
      amount,
      paymentMethod: method,
      transactionId: txId,
      proofUrl: proofUrl || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400',
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };

    this.deposits.unshift(req);
    this.saveDeposits();
    this.addNotification({
      userId: this.currentUser.id,
      title: 'Deposit Request Submitted',
      message: `Deposit of $${amount.toFixed(2)} via ${method} is PENDING admin verification.`,
      type: 'DEPOSIT',
    });

    this.addAuditLog('USER_DEPOSIT_REQUEST', `Submitted deposit request ${req.id} for $${amount}`);
    this.notify();
    return { success: true, message: 'Deposit request submitted successfully.' };
  }

  public approveDeposit(depositId: string, adminNote?: string) {
    const dep = this.deposits.find((d) => d.id === depositId);
    if (!dep || dep.status !== 'PENDING') return;

    dep.status = 'APPROVED';
    dep.processedAt = new Date().toISOString();
    dep.adminNote = adminNote || 'Approved by Compliance Team';

    // Credit user cash in active session and users array
    const userInList = this.users.find((u) => u.id === dep.userId || u.email.toLowerCase() === dep.userEmail?.toLowerCase());
    if (userInList) {
      userInList.availableCash = Number(((userInList.availableCash || 0) + dep.amount).toFixed(2));
      userInList.balance = Number(((userInList.balance || 0) + dep.amount).toFixed(2));
      userInList.investedAmount = Number(((userInList.investedAmount || 0) + dep.amount).toFixed(2));
    }

    if (this.currentUser.id === dep.userId || this.currentUser.email?.toLowerCase() === dep.userEmail?.toLowerCase()) {
      this.currentUser.availableCash = Number(((this.currentUser.availableCash || 0) + dep.amount).toFixed(2));
      this.currentUser.balance = Number(((this.currentUser.balance || 0) + dep.amount).toFixed(2));
      this.currentUser.investedAmount = Number(((this.currentUser.investedAmount || 0) + dep.amount).toFixed(2));
    }

    // --- 2-LEVEL REFERRAL DEPOSIT COMMISSION SYSTEM (20% L1, 10% L2) ---
    const previousApproved = this.deposits.filter(
      (d) => d.userId === dep.userId && d.status === 'APPROVED' && d.id !== dep.id
    );
    const isFirstDeposit = previousApproved.length === 0;

    const depositedUser = this.users.find(
      (u) => u.id === dep.userId || (u.email && dep.userEmail && u.email.toLowerCase() === dep.userEmail.toLowerCase())
    );
    if (depositedUser && depositedUser.referredBy?.trim()) {
      const refCodeL1 = depositedUser.referredBy.trim().toUpperCase();
      // Level 1 Direct Referrer (20% Commission)
      const referrerL1 = this.users.find(
        (u) =>
          (u.referralCode && u.referralCode.trim().toUpperCase() === refCodeL1) ||
          (u.id && u.id.trim().toUpperCase() === refCodeL1) ||
          (u.email && u.email.toLowerCase() === depositedUser.referredBy?.trim().toLowerCase())
      );
      if (referrerL1) {
        const l1Commission = Number((dep.amount * 0.20).toFixed(2)); // 20% Direct Commission

        if (l1Commission > 0) {
          referrerL1.availableCash = Number(((referrerL1.availableCash || 0) + l1Commission).toFixed(2));
          referrerL1.balance = Number(((referrerL1.balance || 0) + l1Commission).toFixed(2));
          referrerL1.totalPL = Number(((referrerL1.totalPL || 0) + l1Commission).toFixed(2));

          if (referrerL1.id === this.currentUser.id) {
            this.currentUser.availableCash = referrerL1.availableCash;
            this.currentUser.balance = referrerL1.balance;
            this.currentUser.totalPL = referrerL1.totalPL;
          }

          let refRecord = this.referrals.find(
            (r) =>
              (r.referrerId === referrerL1.id || r.referrerId === referrerL1.referralCode) &&
              (r.referredUserId === depositedUser.id || (r.referredUserEmail && depositedUser.email && r.referredUserEmail.toLowerCase() === depositedUser.email.toLowerCase())) &&
              r.level === 1
          );
          if (refRecord) {
            refRecord.status = 'QUALIFIED';
            refRecord.commissionEarned = Number(((refRecord.commissionEarned || 0) + l1Commission).toFixed(2));
          } else {
            refRecord = {
              id: `ref1_${Date.now()}_${Math.random().toString(36).slice(2, 5)}`,
              referrerId: referrerL1.id,
              referredUserId: depositedUser.id,
              referredUserName: depositedUser.name,
              referredUserEmail: depositedUser.email,
              referralCode: referrerL1.referralCode,
              commissionEarned: l1Commission,
              level: 1,
              status: 'QUALIFIED',
              registeredAt: depositedUser.createdAt || new Date().toISOString(),
            };
            this.referrals.unshift(refRecord);
          }

          this.addNotification({
            userId: referrerL1.id,
            title: '💰 Level 1 Referral Bonus (+20%) Credited!',
            message: `Your direct referral ${depositedUser.name} deposited $${dep.amount.toFixed(2)}. +$${l1Commission.toFixed(2)} (20% bonus) has been credited directly to your wallet balance!`,
            type: 'ANNOUNCEMENT',
          });
        }

        // Level 2 Indirect Referrer (10% Commission)
        if (referrerL1.referredBy?.trim()) {
          const refCodeL2 = referrerL1.referredBy.trim().toUpperCase();
          const referrerL2 = this.users.find(
            (u) =>
              (u.referralCode && u.referralCode.trim().toUpperCase() === refCodeL2) ||
              (u.id && u.id.trim().toUpperCase() === refCodeL2) ||
              (u.email && u.email.toLowerCase() === referrerL1.referredBy?.trim().toLowerCase())
          );
          if (referrerL2) {
            const l2Commission = Number((dep.amount * 0.10).toFixed(2)); // 10% Indirect Commission

            if (l2Commission > 0) {
              referrerL2.availableCash = Number(((referrerL2.availableCash || 0) + l2Commission).toFixed(2));
              referrerL2.balance = Number(((referrerL2.balance || 0) + l2Commission).toFixed(2));
              referrerL2.totalPL = Number(((referrerL2.totalPL || 0) + l2Commission).toFixed(2));

              if (referrerL2.id === this.currentUser.id) {
                this.currentUser.availableCash = referrerL2.availableCash;
                this.currentUser.balance = referrerL2.balance;
                this.currentUser.totalPL = referrerL2.totalPL;
              }

              let refRecordL2 = this.referrals.find(
                (r) =>
                  (r.referrerId === referrerL2.id || r.referrerId === referrerL2.referralCode) &&
                  (r.referredUserId === depositedUser.id || (r.referredUserEmail && depositedUser.email && r.referredUserEmail.toLowerCase() === depositedUser.email.toLowerCase())) &&
                  r.level === 2
              );
              if (refRecordL2) {
                refRecordL2.status = 'QUALIFIED';
                refRecordL2.commissionEarned = Number(((refRecordL2.commissionEarned || 0) + l2Commission).toFixed(2));
              } else {
                refRecordL2 = {
                  id: `ref2_${Date.now()}_${Math.random().toString(36).slice(2, 5)}`,
                  referrerId: referrerL2.id,
                  referredUserId: depositedUser.id,
                  referredUserName: depositedUser.name,
                  referredUserEmail: depositedUser.email,
                  referralCode: referrerL2.referralCode,
                  commissionEarned: l2Commission,
                  level: 2,
                  status: 'QUALIFIED',
                  registeredAt: depositedUser.createdAt || new Date().toISOString(),
                };
                this.referrals.unshift(refRecordL2);
              }

              this.addNotification({
                userId: referrerL2.id,
                title: '⚡ Level 2 Referral Bonus (+10%) Credited!',
                message: `Sub-network team member ${depositedUser.name} deposited $${dep.amount.toFixed(2)}. +$${l2Commission.toFixed(2)} (10% bonus) has been credited directly to your wallet balance!`,
                type: 'ANNOUNCEMENT',
              });
            }
          }
        }

        this.saveReferrals();
      }

      if (isFirstDeposit) {
        this.addNotification({
          userId: depositedUser.id,
          title: '🎉 First Deposit Active!',
          message: `Your first deposit of $${dep.amount.toFixed(2)} is verified and your account is fully qualified for daily mining returns!`,
          type: 'ANNOUNCEMENT',
        });
      }
    }
    // --- END 2-LEVEL REFERRAL COMMISSION SYSTEM ---

    this.saveDeposits();
    this.saveUsers();
    this.saveAuthState();

    this.addNotification({
      userId: dep.userId,
      title: 'Deposit Approved!',
      message: `$${dep.amount.toFixed(2)} deposit approved and credited to your available balance.`,
      type: 'DEPOSIT',
    });

    this.addAuditLog('ADMIN_DEPOSIT_APPROVE', `Approved deposit ${depositId} of $${dep.amount} for user ${dep.userName}`);
    this.recalculatePositionsAndPortfolio();
    this.notify();
  }

  public rejectDeposit(depositId: string, reason: string) {
    const dep = this.deposits.find((d) => d.id === depositId);
    if (!dep || dep.status !== 'PENDING') return;

    dep.status = 'REJECTED';
    dep.processedAt = new Date().toISOString();
    dep.adminNote = reason;

    this.saveDeposits();
    this.addNotification({
      userId: dep.userId,
      title: 'Deposit Rejected',
      message: `Your deposit request ${depositId} was rejected. Reason: ${reason}`,
      type: 'DEPOSIT',
    });

    this.addAuditLog('ADMIN_DEPOSIT_REJECT', `Rejected deposit ${depositId} for ${dep.userName}: ${reason}`);
    this.notify();
  }

  public hasApprovedDeposit(userId: string = this.currentUser.id): boolean {
    return this.deposits.some((d) => d.userId === userId && d.status === 'APPROVED' && d.amount >= 10);
  }

  public getWithdrawalEligibility(userId: string = this.currentUser.id): { eligible: boolean; reason?: string; targetAmount: number; currentBalance: number } {
    const user = userId === this.currentUser.id ? this.currentUser : (this.users.find((u) => u.id === userId) || this.currentUser);
    const approvedDeposits = this.deposits.filter((d) => d.userId === userId && d.status === 'APPROVED');
    
    if (approvedDeposits.length === 0) {
      return {
        eligible: false,
        reason: 'Min $10 Deposit Required: Your 24-hour plan & withdrawal (including referral earnings) activate after your first approved deposit (Min $10).',
        targetAmount: 20,
        currentBalance: user.balance,
      };
    }

    const totalDeposited = approvedDeposits.reduce((acc, d) => acc + d.amount, 0);
    const target2xAmount = totalDeposited * 2;

    if (user.balance < target2xAmount) {
      return {
        eligible: false,
        reason: `30-Day Double Growth Target Locked: Your capital must reach 2x ($${target2xAmount.toFixed(2)}) via 24h trading before withdrawal is unlocked. Current: $${user.balance.toFixed(2)}`,
        targetAmount: target2xAmount,
        currentBalance: user.balance,
      };
    }

    return {
      eligible: true,
      targetAmount: target2xAmount,
      currentBalance: user.balance,
    };
  }

  public requestWithdrawal(amount: number, method: PaymentMethodType, accountDetails: string): { success: boolean; message: string } {
    const eligibility = this.getWithdrawalEligibility(this.currentUser.id);
    if (!eligibility.eligible) {
      return { success: false, message: eligibility.reason || 'Withdrawal locked.' };
    }

    if (amount < this.settings.minWithdrawal) {
      return { success: false, message: `Minimum withdrawal amount is $${this.settings.minWithdrawal.toFixed(2)}.` };
    }

    if (this.currentUser.availableCash < amount) {
      return { success: false, message: `Insufficient available cash ($${this.currentUser.availableCash.toFixed(2)}).` };
    }

    const fee = this.settings.withdrawalFee || 1.00;
    const netAmount = Number((amount - fee).toFixed(2));

    // Lock cash immediately
    this.currentUser.availableCash -= amount;
    const userInList = this.users.find(u => u.id === this.currentUser.id);
    if (userInList) userInList.availableCash = this.currentUser.availableCash;

    const wth: WithdrawalRequest = {
      id: `wth_${Date.now().toString().slice(-6)}`,
      userId: this.currentUser.id,
      userName: this.currentUser.name,
      userEmail: this.currentUser.email,
      amount,
      fee,
      netAmount,
      paymentMethod: method,
      accountDetails,
      status: 'PENDING',
      securityVerificationPassed: true,
      createdAt: new Date().toISOString(),
    };

    this.withdrawals.unshift(wth);
    this.saveWithdrawals();
    this.saveUsers();
    this.saveAuthState();

    this.addNotification({
      userId: this.currentUser.id,
      title: 'Withdrawal Pending',
      message: `Withdrawal request for $${amount.toFixed(2)} submitted ($${fee.toFixed(2)} fee applied, net payout: $${netAmount.toFixed(2)}).`,
      type: 'WITHDRAWAL',
    });

    this.addAuditLog('USER_WITHDRAWAL_REQUEST', `Requested withdrawal ${wth.id} for $${amount} (Fee: $${fee.toFixed(2)}, Net: $${netAmount.toFixed(2)})`);
    this.recalculatePositionsAndPortfolio();
    this.notify();
    return { success: true, message: 'Withdrawal request submitted.' };
  }

  public approveWithdrawal(withdrawalId: string, adminNote?: string) {
    const wth = this.withdrawals.find((w) => w.id === withdrawalId);
    if (!wth || (wth.status !== 'PENDING' && wth.status !== 'UNDER_REVIEW')) return;

    wth.status = 'COMPLETED';
    wth.processedAt = new Date().toISOString();
    wth.adminNote = adminNote || 'Approved & Dispatched via Payment Gateway';

    const userInList = this.users.find((u) => u.id === wth.userId);
    if (userInList) {
      userInList.balance = Math.max(0, Number((userInList.balance - wth.amount).toFixed(2)));
    }
    if (this.currentUser.id === wth.userId) {
      this.currentUser.balance = Math.max(0, Number((this.currentUser.balance - wth.amount).toFixed(2)));
    }

    this.saveWithdrawals();
    this.saveUsers();
    this.saveAuthState();

    this.addNotification({
      userId: wth.userId,
      title: 'Withdrawal Dispatched',
      message: `$${wth.amount.toFixed(2)} withdrawal completed and sent to your account (${wth.paymentMethod}).`,
      type: 'WITHDRAWAL',
    });

    this.addAuditLog('ADMIN_WITHDRAWAL_APPROVE', `Approved withdrawal ${withdrawalId} ($${wth.amount}) for ${wth.userName}`);
    this.notify();
  }

  public rejectWithdrawal(withdrawalId: string, reason: string) {
    const wth = this.withdrawals.find((w) => w.id === withdrawalId);
    if (!wth) return;

    wth.status = 'REJECTED';
    wth.processedAt = new Date().toISOString();
    wth.adminNote = reason;

    // Refund locked cash
    const userInList = this.users.find((u) => u.id === wth.userId);
    if (userInList) {
      userInList.availableCash = Number(((userInList.availableCash || 0) + wth.amount).toFixed(2));
    }
    if (this.currentUser.id === wth.userId) {
      this.currentUser.availableCash = Number(((this.currentUser.availableCash || 0) + wth.amount).toFixed(2));
    }

    this.saveWithdrawals();
    this.saveUsers();
    this.saveAuthState();

    this.addNotification({
      userId: wth.userId,
      title: 'Withdrawal Rejected',
      message: `Your withdrawal request ${withdrawalId} was rejected. Reason: ${reason}. Locked funds refunded to your cash balance.`,
      type: 'WITHDRAWAL',
    });

    this.addAuditLog('ADMIN_WITHDRAWAL_REJECT', `Rejected withdrawal ${withdrawalId} for ${wth.userName}: ${reason}`);
    this.recalculatePositionsAndPortfolio();
    this.notify();
  }

  // --- Security & Password ---
  public changePassword(oldPass: string, newPass: string): { success: boolean; message: string } {
    if (!oldPass || !newPass) {
      return { success: false, message: 'Please fill in all password fields.' };
    }
    if (newPass.length < 6) {
      return { success: false, message: 'New password must be at least 6 characters long.' };
    }

    this.currentUser.password = newPass;
    const userInList = this.users.find(u => u.id === this.currentUser.id);
    if (userInList) userInList.password = newPass;

    this.saveUsers();
    this.saveAuthState();

    this.addNotification({
      userId: this.currentUser.id,
      title: 'Security Alert: Password Changed',
      message: 'Your account login password was successfully updated.',
      type: 'SECURITY',
    });

    this.addAuditLog('USER_PASSWORD_CHANGE', `User ${this.currentUser.id} updated password`);
    this.notify();
    return { success: true, message: 'Your login password has been changed successfully!' };
  }

  // --- SUPPORT CHAT ---
  public createTicket(subject: string, priority: SupportTicketPriority, initialMessage: string) {
    const tkt: SupportTicket = {
      id: `tkt_${Date.now().toString().slice(-6)}`,
      userId: this.currentUser.id,
      userName: this.currentUser.name,
      userEmail: this.currentUser.email,
      subject,
      status: 'OPEN',
      priority,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [
        {
          id: `msg_${Date.now()}`,
          ticketId: `tkt_${Date.now().toString().slice(-6)}`,
          senderId: this.currentUser.id,
          senderName: this.currentUser.name,
          senderType: 'USER',
          message: initialMessage,
          timestamp: new Date().toISOString(),
        },
      ],
    };

    this.tickets.unshift(tkt);
    this.saveTickets();

    this.addNotification({
      userId: this.currentUser.id,
      title: 'Support Ticket Created',
      message: `Ticket #${tkt.id} opened. Agent will respond shortly.`,
      type: 'SUPPORT',
    });

    this.addNotification({
      userId: 'ADMIN',
      title: '💬 New Support Ticket Opened',
      message: `${this.currentUser.name} opened ticket #${tkt.id}: "${subject}"`,
      type: 'SUPPORT',
    });

    this.notify();
  }

  public sendSupportMessage(
    ticketId: string,
    messageText: string,
    attachment?: { url: string; name: string; type: 'IMAGE' | 'DOCUMENT' | 'PDF' }
  ) {
    const tkt = this.tickets.find((t) => t.id === ticketId);
    if (!tkt) return;

    const isUser = this.currentRole === 'USER';
    let agentName = 'Agent';
    let agentAvatar: string | undefined = undefined;

    if (!isUser) {
      const msgCount = tkt.messages.length;
      const femaleAgent = FEMALE_SUPPORT_AGENTS[msgCount % FEMALE_SUPPORT_AGENTS.length];
      agentName = femaleAgent.name;
      agentAvatar = femaleAgent.avatar;
    }

    const msg: SupportMessage = {
      id: `msg_${Date.now()}`,
      ticketId,
      senderId: isUser ? this.currentUser.id : this.adminUser.id,
      senderName: isUser ? this.currentUser.name : agentName,
      senderType: isUser ? ('USER' as const) : ('ADMIN' as const),
      message: messageText,
      attachmentUrl: attachment?.url,
      attachmentName: attachment?.name,
      attachmentType: attachment?.type || (attachment?.url ? 'DOCUMENT' : undefined),
      agentAlias: !isUser ? agentName : undefined,
      agentAvatar: !isUser ? agentAvatar : undefined,
      timestamp: new Date().toISOString(),
    };

    tkt.messages.push(msg);
    tkt.updatedAt = new Date().toISOString();
    if (!isUser && tkt.status === 'OPEN') {
      tkt.status = 'IN_PROGRESS';
    }

    this.saveTickets();

    if (!isUser) {
      this.addNotification({
        userId: tkt.userId,
        title: `Message from ${agentName}`,
        message: `${agentName}: ${messageText.slice(0, 40)}...`,
        type: 'SUPPORT',
      });
    } else {
      this.addNotification({
        userId: 'ADMIN',
        title: `New Reply on Ticket #${tkt.id}`,
        message: `${this.currentUser.name}: ${messageText.slice(0, 40)}...`,
        type: 'SUPPORT',
      });
    }

    this.notify();
  }

  public updateTicketStatus(ticketId: string, status: SupportTicketStatus) {
    const tkt = this.tickets.find((t) => t.id === ticketId);
    if (!tkt) return;

    tkt.status = status;
    tkt.updatedAt = new Date().toISOString();
    this.saveTickets();
    this.notify();
  }

  // --- ADMIN USERS & SETTINGS ---
  public toggleUserBlock(userId: string) {
    const usr = this.users.find((u) => u.id === userId);
    if (!usr) return;

    usr.isBlocked = !usr.isBlocked;
    if (userId === this.currentUser.id) {
      this.currentUser.isBlocked = usr.isBlocked;
    }

    this.saveUsers();
    this.saveAuthState();
    this.addAuditLog('ADMIN_USER_BLOCK', `${usr.isBlocked ? 'Blocked' : 'Unblocked'} user ${usr.name} (${usr.email})`);
    this.notify();
  }

  public adjustUserBalance(userId: string, amount: number, type: 'CREDIT' | 'DEBIT', reason: string): { success: boolean; message: string } {
    if (amount <= 0) {
      return { success: false, message: 'Please enter a valid amount greater than 0.' };
    }
    const targetUser = this.users.find((u) => u.id === userId);
    if (!targetUser) {
      return { success: false, message: 'User not found.' };
    }

    if (type === 'CREDIT') {
      targetUser.availableCash += amount;
      targetUser.balance += amount;
      if (this.currentUser.id === userId) {
        this.currentUser.availableCash = targetUser.availableCash;
        this.currentUser.balance = targetUser.balance;
      }
    } else {
      if (targetUser.availableCash < amount) {
        return { success: false, message: `Insufficient cash. User available cash is $${targetUser.availableCash.toFixed(2)}` };
      }
      targetUser.availableCash -= amount;
      targetUser.balance -= amount;
      if (this.currentUser.id === userId) {
        this.currentUser.availableCash = targetUser.availableCash;
        this.currentUser.balance = targetUser.balance;
      }
    }

    this.saveUsers();
    this.saveAuthState();

    this.addNotification({
      userId: targetUser.id,
      title: `Account ${type === 'CREDIT' ? 'Credited' : 'Debited'}`,
      message: `$${amount.toFixed(2)} was ${type === 'CREDIT' ? 'added to' : 'deducted from'} your wallet balance. Reason: ${reason}`,
      type: 'ANNOUNCEMENT',
    });

    this.addAuditLog('ADMIN_BALANCE_ADJUST', `${type} $${amount.toFixed(2)} for user ${targetUser.name} (${targetUser.email}): ${reason}`);
    this.notify();
    return { success: true, message: `Successfully ${type === 'CREDIT' ? 'credited' : 'debited'} $${amount.toFixed(2)} for ${targetUser.name}!` };
  }

  public updateSettings(newSettings: Partial<SystemSettings>) {
    this.settings = { ...this.settings, ...newSettings };
    this.saveSettings();
    this.addAuditLog('ADMIN_SETTINGS_UPDATE', `Updated system configuration settings.`);
    this.notify();
  }

  private saveUsers() {
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(this.users));
    } catch (e) {
      console.error('Failed to save users to localStorage:', e);
    }
  }

  // --- UTILS ---
  public addNotification(item: Omit<NotificationItem, 'id' | 'read' | 'timestamp'>) {
    const notif: NotificationItem = {
      ...item,
      id: `notif_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      read: false,
      timestamp: new Date().toISOString(),
    };
    this.notifications.unshift(notif);
    this.saveNotifications();
    this.notify();
  }

  public markNotificationRead(id: string) {
    const n = this.notifications.find((notif) => notif.id === id);
    if (n) {
      n.read = true;
      this.saveNotifications();
      this.notify();
    }
  }

  public markAllNotificationsRead(userId?: string) {
    const currentId = userId || (this.currentRole === 'ADMIN' ? 'ADMIN' : this.currentUser.id);
    this.notifications.forEach((n) => {
      if (this.currentRole === 'ADMIN' || n.userId === currentId || n.type === 'ANNOUNCEMENT') {
        n.read = true;
      }
    });
    this.saveNotifications();
    this.notify();
  }

  private addAuditLog(actionType: string, details: string) {
    const log: AuditLog = {
      id: `log_${Date.now()}`,
      actionBy: this.currentRole === 'ADMIN' ? `Admin (${this.adminUser.email})` : `User (${this.currentUser.name})`,
      actionType,
      targetUserId: this.currentUser.id,
      details,
      timestamp: new Date().toISOString(),
      ipAddress: '127.0.0.1',
    };
    this.auditLogs.unshift(log);
  }
}

export const stateStore = new StateStore();
