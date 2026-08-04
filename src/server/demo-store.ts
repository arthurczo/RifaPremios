import { hashPassword } from '@/lib/password';

export type CampaignStatus = 'ACTIVE' | 'PAUSED' | 'FINISHED';
export type OrderStatus = 'PENDING' | 'PAID' | 'CANCELLED' | 'EXPIRED';
export type PrizeType = 'DISCOUNT_PERCENT' | 'DISCOUNT_FIXED' | 'FREE_NUMBERS' | 'NONE';

export interface DemoCampaignRecord {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string | null;
  status: CampaignStatus;
  price: number;
  totalNumbers: number;
  soldNumbers: number;
  pendingNumbers: number;
  minPurchase: number;
  maxPurchase: number;
  drawDate: string | null;
  roletaEnabled: boolean;
  roletaRules: Record<string, number> | null;
  createdAt: string;
  updatedAt: string;
}

export interface DemoUserRecord {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DemoOrderRecord {
  id: string;
  userId: string;
  campaignId: string;
  code: string;
  quantity: number;
  totalAmount: number;
  discountAmount?: number | null;
  status: OrderStatus;
  numbers: string[];
  paymentMethod?: string | null;
  paymentId?: string | null;
  pixCode?: string | null;
  expiresAt?: string | null;
  createdAt: string;
}

export interface DemoRoletaRecord {
  id: string;
  userId: string;
  orderId: string;
  campaignId: string;
  quantity: number;
  used: number;
  available: number;
  prizesWon?: string[] | null;
  expiresAt?: string | null;
  createdAt: string;
}

export interface DemoPrizeRecord {
  id: string;
  name: string;
  type: PrizeType;
  value: number;
  probability: number;
  color: string;
  active: boolean;
}

export interface DemoSpinRecord {
  id: string;
  roletaId: string;
  prizeId: string;
  prizeName: string;
  prizeType: PrizeType;
  prizeValue: number;
  createdAt: string;
}

export interface DemoState {
  user: DemoUserRecord;
  campaigns: DemoCampaignRecord[];
  orders: DemoOrderRecord[];
  roletas: DemoRoletaRecord[];
  prizes: DemoPrizeRecord[];
  spins: DemoSpinRecord[];
}

const globalForDemo = globalThis as typeof globalThis & {
  demoState?: DemoState;
};

export function nowIso() {
  return new Date().toISOString();
}

function createInitialState(): DemoState {
  const createdAt = nowIso();
  const user: DemoUserRecord = {
    id: 'user-demo',
    email: 'teste@teste.com',
    name: 'Usuario Demo',
    passwordHash: hashPassword('senha123'),
    isAdmin: true,
    createdAt,
    updatedAt: createdAt,
  };

  const campaigns: DemoCampaignRecord[] = [
    {
      id: 'camp-1',
      name: 'Honda Civic 2020',
      slug: 'honda-civic-2020',
      description: 'Campanha principal de validacao do fluxo. Compra acima de 100 numeros libera roletas.',
      image: null,
      status: 'ACTIVE',
      price: 0.07,
      totalNumbers: 1000,
      soldNumbers: 120,
      pendingNumbers: 0,
      minPurchase: 10,
      maxPurchase: 100,
      drawDate: null,
      roletaEnabled: true,
      roletaRules: { '50': 1, '100': 3 },
      createdAt,
      updatedAt: createdAt,
    },
    {
      id: 'camp-2',
      name: 'iPhone 15 Pro',
      slug: 'iphone-15-pro',
      description: 'Rifa secundaria para validar listagem e detalhe de campanha com compra simples.',
      image: null,
      status: 'ACTIVE',
      price: 0.15,
      totalNumbers: 500,
      soldNumbers: 45,
      pendingNumbers: 0,
      minPurchase: 10,
      maxPurchase: 100,
      drawDate: null,
      roletaEnabled: false,
      roletaRules: null,
      createdAt,
      updatedAt: createdAt,
    },
  ];

  const initialOrder: DemoOrderRecord = {
    id: 'order-seed',
    userId: user.id,
    campaignId: campaigns[0].id,
    code: 'PED-SEED01',
    quantity: 100,
    totalAmount: 7,
    status: 'PAID',
    numbers: ['0001', '0002', '0003'],
    createdAt,
  };

  const roletas: DemoRoletaRecord[] = [
    {
      id: 'roleta-seed',
      userId: user.id,
      orderId: initialOrder.id,
      campaignId: campaigns[0].id,
      quantity: 3,
      used: 0,
      available: 3,
      createdAt,
    },
  ];

  const prizes: DemoPrizeRecord[] = [
    { id: 'prize-1', name: '5% OFF', type: 'DISCOUNT_PERCENT', value: 5, probability: 30, color: '#FF6B6B', active: true },
    { id: 'prize-2', name: '10% OFF', type: 'DISCOUNT_PERCENT', value: 10, probability: 25, color: '#4ECDC4', active: true },
    { id: 'prize-3', name: '20% OFF', type: 'DISCOUNT_PERCENT', value: 20, probability: 15, color: '#FFD93D', active: true },
    { id: 'prize-4', name: '10 numeros gratis', type: 'FREE_NUMBERS', value: 10, probability: 20, color: '#6BCF7F', active: true },
    { id: 'prize-5', name: 'Tente novamente', type: 'NONE', value: 0, probability: 10, color: '#C77DFF', active: true },
  ];

  return {
    user,
    campaigns,
    orders: [initialOrder],
    roletas,
    prizes,
    spins: [],
  };
}

export function getDemoState() {
  if (!globalForDemo.demoState) {
    globalForDemo.demoState = createInitialState();
  }

  return globalForDemo.demoState;
}

export function getDemoUserRecord() {
  return getDemoState().user;
}

export function findDemoUserByEmail(email: string) {
  const user = getDemoState().user;

  return user.email.toLowerCase() === email.toLowerCase()
    ? { ...user, createdAt: asDate(user.createdAt), updatedAt: asDate(user.updatedAt) }
    : null;
}

export function findDemoUserById(id: string) {
  const user = getDemoState().user;

  return user.id === id
    ? { ...user, createdAt: asDate(user.createdAt), updatedAt: asDate(user.updatedAt) }
    : null;
}

export function createDemoUser(input: {
  name: string;
  email: string;
  passwordHash: string;
}) {
  const state = getDemoState();

  if (state.user.email.toLowerCase() === input.email.toLowerCase()) {
    throw new Error('Email ja cadastrado');
  }

  const now = nowIso();
  const user: DemoUserRecord = {
    id: generateId(),
    name: input.name,
    email: input.email.toLowerCase(),
    passwordHash: input.passwordHash,
    isAdmin: false,
    createdAt: now,
    updatedAt: now,
  };

  state.user = user;

  return {
    ...user,
    createdAt: asDate(user.createdAt),
    updatedAt: asDate(user.updatedAt),
  };
}

function asDate(value: string) {
  return new Date(value);
}

function asNullableDate(value?: string | null) {
  return value ? new Date(value) : null;
}

export function listDemoCampaignRecords() {
  return getDemoState().campaigns.map((campaign) => ({
    ...campaign,
    createdAt: asDate(campaign.createdAt),
    updatedAt: asDate(campaign.updatedAt),
  }));
}

export function findDemoCampaignRecordById(id: string) {
  const campaign = getDemoState().campaigns.find((item) => item.id === id) ?? null;

  return campaign
    ? {
        ...campaign,
        createdAt: asDate(campaign.createdAt),
        updatedAt: asDate(campaign.updatedAt),
      }
    : null;
}

export function findDemoCampaignRecordBySlug(slug: string) {
  const campaign = getDemoState().campaigns.find((item) => item.slug === slug) ?? null;

  return campaign
    ? {
        ...campaign,
        createdAt: asDate(campaign.createdAt),
        updatedAt: asDate(campaign.updatedAt),
      }
    : null;
}

export function incrementDemoCampaignSoldNumbers(campaignId: string, quantity: number) {
  const campaign = findDemoCampaignRecordById(campaignId);

  if (!campaign) {
    return null;
  }

  const stateCampaign = getDemoState().campaigns.find((item) => item.id === campaignId);

  if (stateCampaign) {
    stateCampaign.soldNumbers += quantity;
    stateCampaign.updatedAt = nowIso();
  }

  return {
    ...campaign,
    soldNumbers: campaign.soldNumbers + quantity,
    updatedAt: new Date(),
  };
}

export function incrementDemoCampaignPendingNumbers(campaignId: string, quantity: number) {
  const campaign = findDemoCampaignRecordById(campaignId);

  if (!campaign) {
    return null;
  }

  const stateCampaign = getDemoState().campaigns.find((item) => item.id === campaignId);

  if (stateCampaign) {
    stateCampaign.pendingNumbers += quantity;
    stateCampaign.updatedAt = nowIso();
  }

  return {
    ...campaign,
    pendingNumbers: campaign.pendingNumbers + quantity,
    updatedAt: new Date(),
  };
}

export function settleDemoCampaignPurchase(campaignId: string, quantity: number) {
  const stateCampaign = getDemoState().campaigns.find((item) => item.id === campaignId);

  if (!stateCampaign) {
    return null;
  }

  stateCampaign.pendingNumbers = Math.max(0, stateCampaign.pendingNumbers - quantity);
  stateCampaign.soldNumbers += quantity;
  stateCampaign.updatedAt = nowIso();

  return {
    ...stateCampaign,
    createdAt: asDate(stateCampaign.createdAt),
    updatedAt: asDate(stateCampaign.updatedAt),
  };
}

export function releaseDemoCampaignPendingNumbers(campaignId: string, quantity: number) {
  const stateCampaign = getDemoState().campaigns.find((item) => item.id === campaignId);

  if (!stateCampaign) {
    return null;
  }

  stateCampaign.pendingNumbers = Math.max(0, stateCampaign.pendingNumbers - quantity);
  stateCampaign.updatedAt = nowIso();

  return {
    ...stateCampaign,
    createdAt: asDate(stateCampaign.createdAt),
    updatedAt: asDate(stateCampaign.updatedAt),
  };
}

export function listDemoOrders() {
  const state = getDemoState();

  return state.orders
    .slice()
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt))
    .map((order) => {
      const campaign = state.campaigns.find((item) => item.id === order.campaignId);

      return {
        ...order,
        discountAmount: order.discountAmount ?? null,
        createdAt: asDate(order.createdAt),
        expiresAt: asNullableDate(order.expiresAt),
        user: {
          id: state.user.id,
          email: state.user.email,
          name: state.user.name,
        },
        campaign: campaign
          ? {
              ...campaign,
              createdAt: asDate(campaign.createdAt),
              updatedAt: asDate(campaign.updatedAt),
            }
          : null,
      };
    });
}

export function createDemoOrder(input: {
  userId: string;
  campaignId: string;
  code: string;
  quantity: number;
  totalAmount: number;
  status: OrderStatus;
  numbers: string[];
  paymentMethod?: string | null;
  paymentId?: string | null;
  pixCode?: string | null;
  expiresAt?: string | Date | null;
}) {
  const state = getDemoState();
  const order = {
    id: generateId(),
    createdAt: nowIso(),
    ...input,
    discountAmount: null,
    paymentMethod: input.paymentMethod ?? null,
    paymentId: input.paymentId ?? null,
    pixCode: input.pixCode ?? null,
    expiresAt: input.expiresAt ? new Date(input.expiresAt).toISOString() : null,
  };

  state.orders.unshift(order);

  return {
    ...order,
    createdAt: asDate(order.createdAt),
  };
}

export function findDemoOrderByCode(code: string) {
  const order = getDemoState().orders.find((entry) => entry.code === code) ?? null;

  if (!order) {
    return null;
  }

  const campaign = getDemoState().campaigns.find((item) => item.id === order.campaignId);

  return {
    ...order,
    totalAmount: order.totalAmount,
    discountAmount: order.discountAmount ?? null,
    createdAt: asDate(order.createdAt),
    expiresAt: asNullableDate(order.expiresAt),
    user: {
      id: getDemoState().user.id,
      email: getDemoState().user.email,
      name: getDemoState().user.name,
    },
    campaign: campaign
      ? {
          ...campaign,
          createdAt: asDate(campaign.createdAt),
          updatedAt: asDate(campaign.updatedAt),
        }
      : null,
  };
}

export function updateDemoOrderByCode(
  code: string,
  patch: {
    status?: OrderStatus;
    paymentMethod?: string | null;
    paymentId?: string | null;
    pixCode?: string | null;
    expiresAt?: string | Date | null;
  },
) {
  const order = getDemoState().orders.find((entry) => entry.code === code);

  if (!order) {
    return null;
  }

  Object.assign(order, patch);

  if (patch.expiresAt !== undefined) {
    order.expiresAt = patch.expiresAt ? new Date(patch.expiresAt).toISOString() : null;
  }

  return {
    ...order,
    createdAt: asDate(order.createdAt),
    expiresAt: asNullableDate(order.expiresAt),
  };
}

export function listDemoAvailableRoletasByUser(userId: string) {
  return getDemoState()
    .roletas.filter((roleta) => roleta.userId === userId && roleta.available > 0)
    .slice()
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt))
    .map((roleta) => ({
      ...roleta,
      createdAt: asDate(roleta.createdAt),
      expiresAt: asNullableDate(roleta.expiresAt),
      prizesWon: roleta.prizesWon ?? [],
    }));
}

export function listDemoActivePrizes() {
  return getDemoState()
    .prizes.filter((prize) => prize.active)
    .map((prize) => ({ ...prize }));
}

export function listDemoSpinHistoryByUser(userId: string) {
  const state = getDemoState();

  return state.spins
    .filter((spin) => {
      const roleta = state.roletas.find((entry) => entry.id === spin.roletaId);
      return roleta?.userId === userId;
    })
    .slice()
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt))
    .map((spin) => {
      const prize = state.prizes.find((entry) => entry.id === spin.prizeId);

      return {
        id: spin.id,
        roletaId: spin.roletaId,
        prizeId: spin.prizeId,
        prizeName: prize?.name ?? 'Premio indisponivel',
        prizeType: prize?.type ?? 'NONE',
        prizeValue: prize?.value ?? 0,
        createdAt: spin.createdAt,
      };
    });
}

export function findDemoNextAvailableRoletaByUser(userId: string) {
  const roleta = getDemoState()
    .roletas.slice()
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt))
    .find((entry) => entry.userId === userId && entry.available > 0);

  return roleta
    ? {
        ...roleta,
        createdAt: asDate(roleta.createdAt),
        expiresAt: asNullableDate(roleta.expiresAt),
        prizesWon: roleta.prizesWon ?? [],
      }
    : null;
}

export function grantDemoRoletas(input: {
  userId: string;
  orderId: string;
  campaignId: string;
  quantity: number;
}) {
  const state = getDemoState();
  const roleta = {
    id: generateId(),
    userId: input.userId,
    orderId: input.orderId,
    campaignId: input.campaignId,
    quantity: input.quantity,
    used: 0,
    available: input.quantity,
    prizesWon: [],
    expiresAt: null,
    createdAt: nowIso(),
  };

  state.roletas.unshift(roleta);

  return {
    ...roleta,
    createdAt: asDate(roleta.createdAt),
    expiresAt: null,
    prizesWon: roleta.prizesWon ?? [],
  };
}

export function consumeDemoRoleta(roletaId: string) {
  const roleta = getDemoState().roletas.find((entry) => entry.id === roletaId);

  if (!roleta) {
    return null;
  }

  roleta.available = Math.max(0, roleta.available - 1);
  roleta.used += 1;

  return {
    ...roleta,
    createdAt: asDate(roleta.createdAt),
    expiresAt: asNullableDate(roleta.expiresAt),
    prizesWon: roleta.prizesWon ?? [],
  };
}

export function createDemoSpin(input: {
  roletaId: string;
  prizeId: string;
}) {
  const state = getDemoState();
  const spin = {
    id: String(state.spins.length + 1),
    roletaId: input.roletaId,
    prizeId: input.prizeId,
    prizeName: '',
    prizeType: 'NONE' as PrizeType,
    prizeValue: 0,
    createdAt: nowIso(),
  };

  state.spins.unshift(spin);

  return {
    id: state.spins.length,
    customerRoletaId: input.roletaId,
    prizeId: input.prizeId,
    spinDate: new Date(spin.createdAt),
  };
}

export function generateId() {
  return crypto.randomUUID();
}
