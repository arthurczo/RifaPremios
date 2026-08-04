import { getDemoAuthUser } from '@/modules/auth/service';
import { campaignsRepository } from '@/modules/campaigns/repository';
import { ordersRepository } from '@/modules/orders/repository';
import { calculateRoletasEarned, grantRoletasForOrder } from '@/modules/roleta/service';
import { createMercadoPagoCheckout, getMercadoPagoPaymentById } from '@/lib/mercadopago';

type CheckoutRequest = {
  campaignId: string;
  quantity: number;
  appUrl?: string;
};

type CheckoutResult = {
  orderCode: string;
  checkoutUrl: string;
  preferenceId: string;
  mode: 'production' | 'sandbox' | 'demo';
  totalAmount: number;
  quantity: number;
};

function generateOrderCode() {
  return Math.random().toString(36).slice(2, 10).toUpperCase();
}

function generateOrderNumbers(quantity: number, totalNumbers: number) {
  return Array.from({ length: quantity }, () =>
    String(Math.floor(Math.random() * totalNumbers) + 1).padStart(4, '0'),
  );
}

function normalizePaymentStatus(status?: string | null) {
  const value = String(status ?? '').toLowerCase();

  if (value === 'approved') {
    return 'PAID' as const;
  }

  if (value === 'rejected' || value === 'cancelled') {
    return 'CANCELLED' as const;
  }

  if (value === 'expired') {
    return 'EXPIRED' as const;
  }

  return 'PENDING' as const;
}

export async function createMercadoPagoCheckoutForCurrentUser(input: CheckoutRequest): Promise<CheckoutResult> {
  const user = await getDemoAuthUser();
  const campaign = await campaignsRepository.findById(input.campaignId);

  if (!campaign) {
    throw new Error('Campanha nao encontrada');
  }

  if (input.quantity < campaign.minPurchase || input.quantity > campaign.maxPurchase) {
    throw new Error('Quantidade fora do limite permitido');
  }

  const orderCode = `PED-${generateOrderCode()}`;
  const totalAmount = Number((campaign.price * input.quantity).toFixed(2));
  const order = await ordersRepository.create({
    userId: user.id,
    campaignId: campaign.id,
    code: orderCode,
    quantity: input.quantity,
    totalAmount,
    status: 'PENDING',
    numbers: generateOrderNumbers(input.quantity, campaign.totalNumbers),
  });

  await campaignsRepository.incrementPendingNumbers(campaign.id, input.quantity);

  try {
    const checkout = await createMercadoPagoCheckout({
      orderCode,
      title: campaign.name,
      description: campaign.description,
      quantity: input.quantity,
      unitPrice: campaign.price,
      payerEmail: user.email,
      campaignId: campaign.id,
      appUrl: input.appUrl,
    });

    return {
      orderCode: order.code,
      checkoutUrl: checkout.checkoutUrl,
      preferenceId: checkout.preferenceId,
      mode: checkout.mode,
      totalAmount,
      quantity: order.quantity,
    };
  } catch (error) {
    await ordersRepository.updateByCode(orderCode, { status: 'CANCELLED' });
    await campaignsRepository.releasePendingPurchase(campaign.id, input.quantity);
    throw error;
  }
}

export async function reconcileMercadoPagoPayment(input: {
  paymentId: string;
  fallbackExternalReference?: string | null;
}) {
  const payment = await getMercadoPagoPaymentById(input.paymentId);
  const orderCode = String(payment.external_reference ?? input.fallbackExternalReference ?? '').trim();

  if (!orderCode) {
    throw new Error('Pagamento sem referencia externa');
  }

  const order = await ordersRepository.findByCode(orderCode);

  if (!order) {
    throw new Error('Pedido nao encontrado');
  }

  const normalizedStatus = normalizePaymentStatus(payment.status);

  if (normalizedStatus === 'PAID' && order.status !== 'PAID') {
    await ordersRepository.updateByCode(orderCode, {
      status: 'PAID',
      paymentId: String(payment.id),
      paymentMethod: payment.payment_type_id ?? payment.payment_method_id ?? null,
      pixCode: payment.point_of_interaction?.transaction_data?.qr_code ?? null,
      expiresAt: payment.date_of_expiration ?? null,
    });

    await campaignsRepository.settlePendingPurchase(order.campaignId, order.quantity);

    const campaign = order.campaign ?? (await campaignsRepository.findById(order.campaignId));
    const roletasEarned = campaign?.roletaEnabled
      ? calculateRoletasEarned(order.quantity, campaign.roletaRules)
      : 0;

    if (roletasEarned > 0) {
      await grantRoletasForOrder({
        userId: order.userId,
        orderId: order.id,
        campaignId: order.campaignId,
        quantity: roletasEarned,
      });
    }

    return {
      orderCode,
      paymentStatus: normalizedStatus,
      roletasEarned,
    };
  }

  if ((normalizedStatus === 'CANCELLED' || normalizedStatus === 'EXPIRED') && order.status === 'PENDING') {
    await ordersRepository.updateByCode(orderCode, {
      status: normalizedStatus,
      paymentId: String(payment.id),
      paymentMethod: payment.payment_type_id ?? payment.payment_method_id ?? null,
      expiresAt: payment.date_of_expiration ?? null,
    });

    await campaignsRepository.releasePendingPurchase(order.campaignId, order.quantity);
  }

  return {
    orderCode,
    paymentStatus: normalizedStatus,
    roletasEarned: 0,
  };
}
