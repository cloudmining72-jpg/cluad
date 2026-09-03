/**
 * ClaudeMining - Custom Local & Cloud-Ready Database Engine
 * Manages collections: Users, Mining Plans, Deposits, Withdrawals, KYC, Audit Logs, Settings.
 */

import type {
  User,
  UserPlan,
  DepositRequest,
  WithdrawalRequest,
  AuditLog,
  SystemSettings,
  PlanTier,
  Asset,
} from '../types';
import {
  DEMO_USER,
  ADMIN_USER,
  INITIAL_ASSETS,
  INITIAL_SYSTEM_SETTINGS,
} from './mockData';

const DB_STORAGE_KEY = 'CLAUDEMINING_DATABASE_V1';

export interface DatabaseSchema {
  users: User[];
  userPlans: UserPlan[];
  deposits: DepositRequest[];
  withdrawals: WithdrawalRequest[];
  auditLogs: AuditLog[];
  settings: SystemSettings;
  planTiers: PlanTier[];
  assets: Asset[];
}

// Initial Database Seed
const INITIAL_DB_SEED: DatabaseSchema = {
  users: [
    { ...DEMO_USER },
    { ...ADMIN_USER },
  ],
  userPlans: [
    {
      id: 'PLAN-101',
      userId: 'usr_001',
      planName: 'Antminer S19 Pro Rig ($100)',
      investedAmount: 100,
      dailyProfit: 6.67,
      totalTargetReturn: 200,
      startDate: new Date(Date.now() - 5 * 86400000).toISOString(),
      durationDays: 30,
      claimedDaysCount: 5,
      lapsedDaysCount: 0,
      status: 'ACTIVE',
      hashRate: '55 TH/s',
      gpuModel: 'Bitmain ASIC',
    },
  ],
  deposits: [
    {
      id: 'DEP-8801',
      userId: 'usr_001',
      userName: 'Asim Raza',
      userEmail: 'asim.raza@example.com',
      amount: 500,
      paymentMethod: 'CRYPTO_USDT',
      transactionId: 'TXN-7712',
      status: 'APPROVED',
      createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      processedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    },
  ],
  withdrawals: [
    {
      id: 'WTH-9901',
      userId: 'usr_001',
      userName: 'Asim Raza',
      userEmail: 'asim.raza@example.com',
      amount: 150,
      paymentMethod: 'CRYPTO_USDT',
      accountDetails: 'TYD2v9kH8sL7wQ1mNpR4xZ3vB5nK8jP6qW',
      status: 'APPROVED',
      securityVerificationPassed: true,
      createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
      processedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    },
  ],

  auditLogs: [
    {
      id: 'log-001',
      actionBy: 'System',
      actionType: 'SYSTEM_BOOT',
      details: 'Database Engine Initialized Successfully',
      timestamp: new Date().toISOString(),
      ipAddress: '127.0.0.1',
    },
  ],
  settings: { ...INITIAL_SYSTEM_SETTINGS },
  planTiers: [
    {
      id: 'tier-10',
      name: 'Starter Micro Rig ($10 Plan)',
      badge: 'Starter Rig',
      minAmount: 10,
      maxAmount: 49,
      durationDays: 30,
      multiplier: 2,
      hashRate: '25 TH/s',
      gpuModel: 'Bitmain ASIC S19',
      description: '30-Day Mining Rig with 2x Total Return',
    },
    {
      id: 'tier-50',
      name: 'Bronze ASIC Rig ($50 Plan)',
      badge: 'Bronze Rig',
      minAmount: 50,
      maxAmount: 99,
      durationDays: 30,
      multiplier: 2,
      hashRate: '45 TH/s',
      gpuModel: 'Bitmain ASIC S19',
      description: '30-Day Mining Rig with 2x Total Return',
    },
    {
      id: 'tier-100',
      name: 'Silver Pro Rig ($100 Plan)',
      badge: 'Popular Rig',
      minAmount: 100,
      maxAmount: 199,
      durationDays: 30,
      multiplier: 2,
      hashRate: '85 TH/s',
      gpuModel: 'Bitmain ASIC S19 Pro',
      description: '30-Day Mining Rig with 2x Total Return',
    },
    {
      id: 'tier-200',
      name: 'Gold Power Cluster ($200 Plan)',
      badge: 'Advanced Rig',
      minAmount: 200,
      maxAmount: 499,
      durationDays: 30,
      multiplier: 2,
      hashRate: '180 TH/s',
      gpuModel: 'MicroBT WhatsMiner',
      description: '30-Day Mining Rig with 2x Total Return',
    },
    {
      id: 'tier-500',
      name: 'Platinum GPU Farm ($500 Plan)',
      badge: 'High Yield',
      minAmount: 500,
      maxAmount: 999,
      durationDays: 30,
      multiplier: 2,
      hashRate: '450 TH/s',
      gpuModel: '8x RTX 4090 Array',
      description: '30-Day Mining Rig with 2x Total Return',
    },
    {
      id: 'tier-1000',
      name: 'Diamond SuperNode ($1000 Plan)',
      badge: 'Pro Node',
      minAmount: 1000,
      maxAmount: 2499,
      durationDays: 30,
      multiplier: 2,
      hashRate: '1,000 TH/s',
      gpuModel: 'Canaan Avalon SuperNode',
      description: '30-Day Mining Rig with 2x Total Return',
    },
    {
      id: 'tier-2500',
      name: 'VIP Hydro DataCenter ($2500 Plan)',
      badge: 'VIP DataCenter',
      minAmount: 2500,
      maxAmount: 10000,
      durationDays: 30,
      multiplier: 2,
      hashRate: '2,500 TH/s',
      gpuModel: 'Hydro Cooling ASIC Farm',
      description: '30-Day Mining Rig with 2x Total Return',
    },
  ],
  assets: [...INITIAL_ASSETS],
};

class DatabaseEngine {
  private schema: DatabaseSchema;

  constructor() {
    this.schema = this.loadFromDisk();
  }

  private loadFromDisk(): DatabaseSchema {
    try {
      const raw = localStorage.getItem(DB_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object' && Array.isArray(parsed.users)) {
          return {
            ...INITIAL_DB_SEED,
            ...parsed,
          };
        }
      }
    } catch (err) {
      console.error('Failed to load database from disk:', err);
    }
    return { ...INITIAL_DB_SEED };
  }

  public saveToDisk(): void {
    try {
      localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(this.schema));
    } catch (err) {
      console.error('Failed to save database to disk:', err);
    }
  }

  // Collection Accessors
  public get<K extends keyof DatabaseSchema>(collection: K): DatabaseSchema[K] {
    return this.schema[collection];
  }

  public set<K extends keyof DatabaseSchema>(collection: K, data: DatabaseSchema[K]): void {
    this.schema[collection] = data;
    this.saveToDisk();
  }

  public getFullSchema(): DatabaseSchema {
    return this.schema;
  }

  // Backup & Restore Utilities
  public exportBackupJSON(): string {
    return JSON.stringify(this.schema, null, 2);
  }

  public importBackupJSON(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed && typeof parsed === 'object' && Array.isArray(parsed.users)) {
        this.schema = { ...INITIAL_DB_SEED, ...parsed };
        this.saveToDisk();
        return true;
      }
    } catch (err) {
      console.error('Invalid JSON database import:', err);
    }
    return false;
  }

  public resetToFactorySeed(): void {
    this.schema = { ...INITIAL_DB_SEED };
    this.saveToDisk();
  }
}

export const db = new DatabaseEngine();
