'use client';

import { useMemo, useState } from 'react';
import { ArrowRight, BadgeInfo, CreditCard, QrCode, ShoppingCart } from 'lucide-react';

import { PURCHASE_OPTIONS } from '@/lib/constants';

interface CompraBilhetesProps {
  campaignId: string;
  price: number;
  minPurchase: number;
  maxPurchase: number;
  roletaEnabled: boolean;
}

export function CompraBilhetes({
  campaignId,
  price,
  minPurchase,
  maxPurchase,
  roletaEnabled,
}: CompraBilhetesProps) {
  const [quantity, setQuantity] = useState(Math.max(minPurchase, PURCHASE_OPTIONS[0]));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const isQuantityValid = useMemo(() => {
    return Number.isInteger(quantity) && quantity >= minPurchase && quantity <= maxPurchase;
  }, [maxPurchase, minPurchase, quantity]);

  const total = useMemo(() => quantity * price, [price, quantity]);

  function validateQuantity(value: number) {
    if (!Number.isInteger(value)) {
      return 'Digite uma quantidade inteira.';
    }

    if (value < minPurchase) {
      return `O minimo para esta campanha e ${minPurchase} numeros.`;
    }

    if (value > maxPurchase) {
      return `O maximo para esta campanha e ${maxPurchase} numeros.`;
    }

    return null;
  }

  async function handlePurchase() {
    const validationError = validateQuantity(quantity);

    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const res = await fetch('/api/pagamentos/mercadopago/preference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ campaignId, quantity }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Nao foi possivel criar o checkout');
      }

      setMessage('Redirecionando para o checkout seguro do Mercado Pago...');
      window.location.assign(data.checkoutUrl);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Erro ao iniciar o pagamento');
    } finally {
      setLoading(false);
    }
  }

  return (
    <aside className="rounded-3xl border border-white/10 bg-white/5 p-6 text-white shadow-2xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-cyan-200/70">Checkout seguro</p>
          <h2 className="mt-2 text-2xl font-bold">Comprar numeros</h2>
        </div>
        <div className="rounded-2xl border border-white/10 bg-slate-950/35 p-3 text-cyan-100">
          <ShoppingCart className="h-5 w-5" />
        </div>
      </div>

      <p className="mt-3 text-sm text-slate-300">
        O pedido entra como pendente e e liberado automaticamente quando o Mercado Pago confirmar o pagamento.
      </p>

      <div className="mt-6 rounded-2xl border border-white/10 bg-slate-950/35 p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm text-slate-400">Quantidade</p>
            <p className="mt-1 text-3xl font-black">{quantity}</p>
          </div>
          <label className="min-w-[7rem]">
            <span className="sr-only">Quantidade de numeros</span>
            <input
              type="number"
              min={minPurchase}
              max={maxPurchase}
              step={1}
              value={quantity}
              onChange={(event) => {
                const nextValue = Number(event.target.value);
                setQuantity(Number.isNaN(nextValue) ? 0 : nextValue);
                setError(null);
                setMessage(null);
              }}
              className="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-right text-lg font-semibold text-white outline-none transition focus:border-cyan-300/50"
            />
          </label>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {PURCHASE_OPTIONS.map((option) => {
            const disabled = option < minPurchase || option > maxPurchase;

            return (
              <button
                key={option}
                type="button"
                disabled={disabled}
                onClick={() => {
                  setQuantity(option);
                  setError(null);
                  setMessage(null);
                }}
                className={`rounded-2xl px-4 py-3 text-left transition ${
                  quantity === option
                    ? 'bg-amber-400 text-slate-950'
                    : 'bg-slate-900/70 text-white hover:bg-slate-800'
                } disabled:cursor-not-allowed disabled:opacity-40`}
              >
                <span className="block text-lg font-bold">{option}</span>
                <span className="text-xs">numeros</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-slate-950/35 p-4">
          <p className="text-sm text-slate-400">Total estimado</p>
          <p className="mt-1 text-3xl font-black">R$ {total.toFixed(2)}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-slate-950/35 p-4">
          <p className="text-sm text-slate-400">Pagamento</p>
          <p className="mt-2 flex items-center gap-2 text-sm font-medium text-white">
            <QrCode className="h-4 w-4 text-emerald-300" />
            Pix, cartao e saldo Mercado Pago
          </p>
        </div>
      </div>

      <div className="mt-5 flex items-start gap-3 rounded-2xl border border-cyan-300/15 bg-cyan-300/10 p-4 text-sm text-cyan-50">
        <BadgeInfo className="mt-0.5 h-4 w-4 shrink-0 text-cyan-200" />
        <span>
          {roletaEnabled
            ? 'Quando o pagamento for aprovado, as roletas sao liberadas automaticamente.'
            : 'Esta campanha nao ativa roletas instantaneas.'}
        </span>
      </div>

      {error ? <p className="mt-4 rounded-2xl bg-red-500/10 p-4 text-sm text-red-100">{error}</p> : null}
      {message ? <p className="mt-4 rounded-2xl bg-emerald-400/10 p-4 text-sm text-emerald-100">{message}</p> : null}

      <button
        type="button"
        onClick={handlePurchase}
        disabled={loading || !isQuantityValid}
        className="mt-6 inline-flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#f5c542,#d18d00)] px-4 py-3 font-semibold text-slate-950 transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? 'Abrindo checkout...' : 'Pagar com Mercado Pago'}
        <ArrowRight className="h-4 w-4" />
      </button>

      <p className="mt-3 flex items-center gap-2 text-xs text-slate-400">
        <CreditCard className="h-4 w-4" />
        Compra segura com redirecionamento oficial e confirmacao por webhook.
      </p>
    </aside>
  );
}
