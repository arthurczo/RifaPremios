import MercadoPagoConfig, { InvalidWebhookSignatureError, Payment, Preference, WebhookSignatureValidator } from 'mercadopago';

import { getPublicAppUrl, isLocalhostUrl } from '@/lib/site';

export interface MercadoPagoCheckoutInput {
  orderCode: string;
  title: string;
  description: string;
  quantity: number;
  unitPrice: number;
  payerEmail: string;
  campaignId: string;
  appUrl?: string;
}

export interface MercadoPagoCheckoutSession {
  preferenceId: string;
  checkoutUrl: string;
  mode: 'production' | 'sandbox' | 'demo';
}

function getAccessToken() {
  return process.env.MERCADOPAGO_ACCESS_TOKEN?.trim() || process.env.MP_ACCESS_TOKEN?.trim() || '';
}

function getWebhookSecret() {
  return process.env.MERCADOPAGO_WEBHOOK_SECRET?.trim() || process.env.MP_WEBHOOK_SECRET?.trim() || '';
}

function useSandboxCheckout() {
  return process.env.MERCADOPAGO_USE_SANDBOX === '1' || process.env.MERCADOPAGO_ENVIRONMENT === 'sandbox';
}

function resolveAppUrl(override?: string) {
  const appUrl = override?.trim() || getPublicAppUrl();

  if (!appUrl) {
    return null;
  }

  return appUrl;
}

export function canUseMercadoPago() {
  return Boolean(getAccessToken());
}

export function createMercadoPagoClient() {
  const accessToken = getAccessToken();

  if (!accessToken) {
    throw new Error('MERCADOPAGO_ACCESS_TOKEN nao configurado');
  }

  return new MercadoPagoConfig({
    accessToken,
  });
}

export async function createMercadoPagoCheckout(input: MercadoPagoCheckoutInput): Promise<MercadoPagoCheckoutSession> {
  const appUrl = resolveAppUrl(input.appUrl);
  const accessToken = getAccessToken();

  if (!accessToken) {
    if (!appUrl) {
      throw new Error('Configure APP_URL para habilitar o fluxo de pagamento local');
    }

    return {
      preferenceId: `demo-${input.orderCode}`,
      checkoutUrl: `${appUrl}/checkout/retorno?mode=demo&order=${encodeURIComponent(input.orderCode)}&status=pending`,
      mode: 'demo',
    };
  }

  if (!appUrl) {
    throw new Error('Configure APP_URL ou NEXT_PUBLIC_APP_URL com uma URL publica valida');
  }

  if (isLocalhostUrl(appUrl)) {
    throw new Error('APP_URL precisa apontar para uma URL publica para o checkout do Mercado Pago');
  }

  const client = createMercadoPagoClient();
  const preference = new Preference(client);
  const webhookUrl = `${appUrl}/api/pagamentos/mercadopago/webhook`;
  const checkoutBaseUrl = useSandboxCheckout() ? 'sandbox' : 'production';

  const response = await preference.create({
    body: {
      external_reference: input.orderCode,
      notification_url: webhookUrl,
      auto_return: 'approved',
      back_urls: {
        success: `${appUrl}/checkout/retorno?status=approved&order=${encodeURIComponent(input.orderCode)}`,
        pending: `${appUrl}/checkout/retorno?status=pending&order=${encodeURIComponent(input.orderCode)}`,
        failure: `${appUrl}/checkout/retorno?status=failed&order=${encodeURIComponent(input.orderCode)}`,
      },
      date_of_expiration: new Date(Date.now() + 1000 * 60 * 15).toISOString(),
      items: [
        {
          id: input.campaignId,
          title: input.title,
          description: input.description,
          quantity: input.quantity,
          currency_id: 'BRL',
          unit_price: input.unitPrice,
          type: 'digital',
        },
      ],
      payer: {
        email: input.payerEmail,
      },
      payment_methods: {
        installments: 12,
        default_installments: 1,
        excluded_payment_types: [{ id: 'ticket' }],
      },
      metadata: {
        campaignId: input.campaignId,
        orderCode: input.orderCode,
      },
    },
  });

  const checkoutUrl = checkoutBaseUrl === 'sandbox' ? response.sandbox_init_point ?? response.init_point : response.init_point ?? response.sandbox_init_point;

  if (!checkoutUrl) {
    throw new Error('Mercado Pago nao retornou uma URL de checkout');
  }

  return {
    preferenceId: response.id ?? `pref-${input.orderCode}`,
    checkoutUrl,
    mode: checkoutBaseUrl,
  };
}

export async function getMercadoPagoPaymentById(paymentId: string) {
  const client = createMercadoPagoClient();
  const payment = new Payment(client);
  return payment.get({ id: paymentId });
}

export function validateMercadoPagoWebhookSignature(options: {
  xSignature: string | string[] | null | undefined;
  xRequestId: string | string[] | null | undefined;
  dataId: string | string[] | null | undefined;
}) {
  const secret = getWebhookSecret();

  if (!secret) {
    throw new Error('MERCADOPAGO_WEBHOOK_SECRET nao configurado');
  }

  WebhookSignatureValidator.validate({
    xSignature: options.xSignature,
    xRequestId: options.xRequestId,
    dataId: options.dataId,
    secret,
    toleranceSeconds: 300,
  });
}

export { InvalidWebhookSignatureError };
