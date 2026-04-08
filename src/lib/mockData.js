// Mock data for development — will be replaced by InfluxDB + Supabase queries
// Uses a seeded PRNG to avoid hydration mismatches (no Math.random())

function seededRandom(seed) {
  let s = seed;
  return function () {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

import { MOCK_USERS } from './mockUsers';

function getTenantForMeter(meterId) {
  const user = MOCK_USERS.find(u => u.meterIds && u.meterIds.includes(meterId));
  return user ? user.name : 'Unassigned';
}

// ---------- Meters (deterministic) ----------
const rng = seededRandom(42);

export const MOCK_METERS = Array.from({ length: 5 }, (_, i) => {
  const unitNum = `${String(Math.floor(i / 4) + 1).padStart(2, '0')}${String.fromCharCode(65 + (i % 4))}`;
  const isOnline = rng() > 0.2;
  const currentLoad = isOnline ? +(rng() * 4.5 + 0.1).toFixed(2) : 0;
  const totalKwh = +(rng() * 2000 + 100).toFixed(1);
  const creditBalance = +(rng() * 500 + 5).toFixed(2);
  // Use a fixed reference date instead of Date.now()
  const REF = 1775484000000; // 2026-04-06T14:00:00Z
  const lastSeen = isOnline
    ? new Date(REF - rng() * 300000)
    : new Date(REF - rng() * 86400000 * 3);

  return {
    id: `meter-${i + 1}`,
    meterSerial: `NXA-APM01-${String(1000 + i)}`,
    meterName: `Unit ${unitNum}`,
    unitNumber: unitNum,
    tenantName: getTenantForMeter(`meter-${i + 1}`),
    status: isOnline ? 'online' : 'offline',
    currentLoad,
    totalKwh,
    creditBalance,
    lastSeenAt: lastSeen.toISOString(),
    voltage: isOnline ? +(220 + rng() * 15 - 7.5).toFixed(1) : 0,
    current: isOnline ? +(currentLoad * 1000 / 230).toFixed(2) : 0,
    powerFactor: isOnline ? +(0.85 + rng() * 0.13).toFixed(2) : 0,
  };
});

export function getMeterSummary(meters) {
  const totalLoad = meters.reduce((sum, m) => sum + m.currentLoad, 0);
  const onlineCount = meters.filter(m => m.status === 'online').length;
  const offlineCount = meters.filter(m => m.status === 'offline').length;
  const lowCreditCount = meters.filter(m => m.creditBalance < 50).length;
  const totalRevenue = meters.reduce((sum, m) => sum + m.totalKwh * 0.85, 0);

  return {
    totalLoad: +totalLoad.toFixed(2),
    onlineCount,
    offlineCount,
    totalCount: meters.length,
    lowCreditCount,
    criticalAlerts: offlineCount + lowCreditCount,
    totalRevenue: +totalRevenue.toFixed(2),
  };
}

// ---------- Hourly usage (deterministic) ----------
export function generateHourlyUsage(meterId) {
  // Use a different seed for each meter if needed
  const meterSeed = meterId ? parseInt(meterId.split('-')[1]) * 100 : 100;
  const r = seededRandom(meterSeed);
  const data = [];
  for (let i = 23; i >= 0; i--) {
    const h = (19 - i + 24) % 24; // deterministic hour labels starting from a fixed point
    const label = `${String(h).padStart(2, '0')}:00`;
    const baseLoad = (h >= 6 && h <= 9) ? 35 : (h >= 17 && h <= 22) ? 45 : 15;
    const load = baseLoad + r() * 15 - 5;
    data.push({
      time: label,
      hour: h,
      consumption: +load.toFixed(1),
      cost: +(load * 0.85).toFixed(2),
    });
  }
  return data;
}

// ---------- Daily usage (deterministic) ----------
export function generateDailyUsage(meterId) {
  const meterSeed = meterId ? parseInt(meterId.split('-')[1]) * 200 : 200;
  const r = seededRandom(meterSeed);
  const data = [];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  // Use fixed reference date: Apr 6
  for (let i = 29; i >= 0; i--) {
    const dayOffset = 6 - i; // relative to Apr 6
    let month = 3; // April (0-indexed)
    let day = 6 - i;
    if (day <= 0) {
      month = 2; // March
      day = 31 + day;
    }
    const dateStr = `${months[month]} ${day}`;
    const base = 600 + r() * 200;
    data.push({
      date: dateStr,
      consumption: +base.toFixed(1),
      cost: +(base * 0.85).toFixed(2),
      peak: +(base * 0.6).toFixed(1),
      offPeak: +(base * 0.4).toFixed(1),
    });
  }
  return data;
}

// ---------- Alerts (deterministic) ----------
export function generateAlerts() {
  const r = seededRandom(300);
  const types = [
    { type: 'low_credit', message: 'Credit balance below ₵50.00' },
    { type: 'offline', message: 'Meter went offline' },
    { type: 'spike', message: 'Unusual consumption spike detected' },
    { type: 'tamper', message: 'Possible tamper event detected' },
  ];

  const REF = 1775484000000;
  const alerts = Array.from({ length: 12 }, (_, i) => {
    const t = types[i % types.length];
    const meterIdx = Math.floor(r() * MOCK_METERS.length);
    return {
      id: `alert-${i + 1}`,
      meterId: MOCK_METERS[meterIdx].id,
      meterName: MOCK_METERS[meterIdx].meterName,
      tenantName: MOCK_METERS[meterIdx].tenantName,
      alertType: t.type,
      message: t.message,
      isRead: i > 4,
      createdAt: new Date(REF - r() * 86400000 * 2).toISOString(),
    };
  });
  return alerts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

// ---------- Transactions (deterministic) ----------
export function generateTransactions(meterId) {
  const meterSeed = meterId ? parseInt(meterId.split('-')[1]) * 400 : 400;
  const r = seededRandom(meterSeed);
  const types = ['topup', 'consumption', 'adjustment'];
  const REF = 1775484000000;
  
  // Filter by meter if meterId provided
  const targetMeter = meterId 
    ? MOCK_METERS.find(m => m.id === meterId) 
    : null;

  const txns = Array.from({ length: 20 }, (_, i) => {
    const type = types[i % 3];
    const amount = type === 'topup'
      ? +(r() * 200 + 50).toFixed(2)
      : type === 'consumption'
        ? -(r() * 30 + 2).toFixed(2)
        : +(r() * 20 - 10).toFixed(2);
    
    // If we have a target meter, use it, otherwise pick random
    const currentMeter = targetMeter || MOCK_METERS[Math.floor(r() * MOCK_METERS.length)];
    
    return {
      id: `txn-${i + 1}`,
      tenantName: currentMeter.tenantName,
      meterName: currentMeter.meterName,
      meterId: currentMeter.id,
      type,
      amount: +amount,
      description: type === 'topup' ? 'Paystack top-up' : type === 'consumption' ? 'Hourly deduction' : 'Admin adjustment',
      createdAt: new Date(REF - r() * 86400000 * 7).toISOString(),
    };
  });
  return txns.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export const TARIFF_RATE = 0.85; // GHS per kWh
