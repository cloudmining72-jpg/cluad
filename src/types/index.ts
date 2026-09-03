export type OrderType = 'MARKET' | 'LIMIT' | 'STOP' | 'STOP_LIMIT';
export type OrderSide = 'BUY' | 'SELL';
export type OrderStatus = 'PENDING' | 'SUBMITTED' | 'PARTIALLY_FILLED' | 'FILLED' | 'CANCELLED';

export type PaymentMethodType = 'CRYPTO_USDT' | 'BANK_TRANSFER' | 'CREDIT_CARD' | 'EASYPAISA' | 'JAZZCASH';
export type DepositStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type WithdrawalStatus = 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'PROCESSING' | 'COMPLETED' | 'REJECTED';

export type SupportTicketStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
export type SupportTicketPriority = 'LOW' | 'MEDIUM' | 'HIGH';
export type AssetCategory = 'STOCK' | 'CRYPTO' | 'FOREX' | 'COMMODITY';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  phone: string;
  country: string;
  balance: number;
  availableCash: number;
  investedAmount: number;
  todayPL: number;
  totalPL: number;
  referralCode: string;
  referredBy?: string;
  isBlocked: boolean;
  twoFactorEnabled: boolean;
  createdAt: string;
  avatar?: string;
  role: 'USER' | 'ADMIN';
}

export interface ChartPoint {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface Asset {
  symbol: string;
  name: string;
  category: AssetCategory;
  price: number;
  change24h: number;
  change24hAmount: number;
  high24h: number;
  low24h: number;
  openPrice: number;
  prevClose: number;
  volume: number;
  marketCap: string;
  bid: number;
  ask: number;
  status: 'ACTIVE' | 'HALTED';
  chartHistory: ChartPoint[];
}

export interface Order {
  id: string;
  userId: string;
  userName: string;
  symbol: string;
  assetName: string;
  type: OrderType;
  side: OrderSide;
  quantity: number;
  targetPrice?: number;
  stopPrice?: number;
  executedPrice?: number;
  totalValue: number;
  status: OrderStatus;
  createdAt: string;
  filledAt?: string;
}

export interface Position {
  id: string;
  userId: string;
  symbol: string;
  assetName: string;
  side: OrderSide;
  quantity: number;
  avgBuyPrice: number;
  currentPrice: number;
  totalInvestment: number;
  currentMarketValue: number;
  unrealizedPL: number;
  unrealizedPLPercent: number;
  openedAt: string;
}

export interface ManagedStrategy {
  id: string;
  name: string;
  category: 'CONSERVATIVE' | 'BALANCED' | 'AGGRESSIVE';
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  minInvestment: number;
  historicalReturn30d: number; // Estimated based on past performance
  description: string;
  activeSubscribers: number;
  assetAllocations: { symbol: string; percentage: number }[];
}

export interface UserStrategySubscription {
  id: string;
  userId: string;
  strategyId: string;
  strategyName: string;
  investedAmount: number;
  currentValuation: number;
  pl: number;
  plPercent: number;
  startedAt: string;
  lastRebalancedAt: string;
  autoRebalance: boolean;
}

export interface DepositRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  amount: number;
  paymentMethod: PaymentMethodType;
  transactionId: string;
  proofUrl?: string;
  status: DepositStatus;
  createdAt: string;
  processedAt?: string;
  adminNote?: string;
}

export interface WithdrawalRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  amount: number;
  fee?: number;
  netAmount?: number;
  paymentMethod: PaymentMethodType;
  accountDetails: string;
  status: WithdrawalStatus;
  securityVerificationPassed: boolean;
  createdAt: string;
  processedAt?: string;
  adminNote?: string;
}

export interface ReferralRecord {
  id: string;
  referrerId: string;
  referredUserId: string;
  referredUserName: string;
  referredUserEmail: string;
  referralCode: string;
  commissionEarned: number;
  level: 1 | 2;
  status: 'QUALIFIED' | 'PENDING';
  registeredAt: string;
}

export interface SupportMessage {
  id: string;
  ticketId: string;
  senderId: string;
  senderName: string;
  senderType: 'USER' | 'ADMIN';
  message: string;
  attachmentUrl?: string;
  attachmentName?: string;
  attachmentType?: 'IMAGE' | 'DOCUMENT' | 'PDF';
  agentAlias?: string;
  agentAvatar?: string;
  timestamp: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  subject: string;
  status: SupportTicketStatus;
  priority: SupportTicketPriority;
  assignedAgent?: string;
  createdAt: string;
  updatedAt: string;
  messages: SupportMessage[];
}



export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'ORDER' | 'SECURITY' | 'ANNOUNCEMENT' | 'SUPPORT';
  read: boolean;
  timestamp: string;
}

export interface AuditLog {
  id: string;
  actionBy: string;
  actionType: string;
  targetUserId?: string;
  details: string;
  timestamp: string;
  ipAddress: string;
}

export interface PaymentMethodConfig {
  id: string;
  type: PaymentMethodType;
  name: string;
  destinationAddress: string;
  instructions: string;
  minAmount: number;
  enabled: boolean;
}

export interface UserPlan {
  id: string;
  userId: string;
  userEmail?: string;
  planName: string;
  hashRate?: string;
  gpuModel?: string;
  investedAmount: number;
  dailyProfit: number;
  totalTargetReturn: number;
  startDate: string;
  durationDays: number;
  claimedDaysCount: number;
  lastClaimDate?: string;
  lapsedDaysCount: number;
  status: 'ACTIVE' | 'COMPLETED';
  miningStartedAt?: string;
  miningCycleStatus?: 'MINING' | 'READY_TO_CLAIM' | 'IDLE' | 'COMPLETED';
  minedCoin?: string;
}

export interface PlanTier {
  id: string;
  name: string;
  badge: string;
  minAmount: number;
  maxAmount: number;
  durationDays: number;
  multiplier: number;
  hashRate: string;
  gpuModel: string;
  description: string;
}

export interface SystemAnnouncement {
  enabled: boolean;
  message: string;
  type: 'INFO' | 'PROMO' | 'ALERT' | 'WARNING';
  linkText?: string;
  createdAt?: string;
}

export interface SystemSettings {
  appName: string;
  appLogo: string;
  supportEmail: string;
  maintenanceMode: boolean;
  minDeposit: number;
  minWithdrawal: number;
  withdrawalFee: number;
  tradingFeePercent: number;
  referralLevel1CommissionPercent: number;
  referralLevel2CommissionPercent: number;
  paymentMethods: PaymentMethodConfig[];
  announcement?: SystemAnnouncement;
}

export interface VIPTierInfo {
  level: number;
  name: string;
  badgeColor: string;
  minDeposit: number;
  nextTierDeposit: number;
  bonusYieldPercent: number;
  perks: string[];
}

