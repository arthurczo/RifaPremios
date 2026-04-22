'use client';

import { useState } from 'react';

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
  const [message, setMessage] = useState<string | null>(null);

  async function handlePurchase() {
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch('/api/pedidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ campaignId, quantity }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Nao foi possivel criar o pedido');
      }

      setMessage(
        `Pedido ${data.code} criado com ${data.quantity} numeros. ${data.roletasEarned > 0 ? `Voce ganhou ${data.roletasEarned} roleta(s).` : 'Sem roletas nesta compra.'}`,
      );
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Erro ao criar pedido');
    } finally {
      setLoading(false);
    }
  }

  const total = quantity * price;

  return (
    <aside className="rounded-3xl border border-white/10 bg-white/5 p-6 text-white">
      <h2 className="text-2xl font-bold">Comprar numeros</h2>
      <p className="mt-2 text-sm text-slate-300">
        Fluxo simplificado para o usuario demo. O pedido e criado como pago para validar a roleta.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-3">
        {PURCHASE_OPTIONS.map((option) => {
          const disabled = option < minPurchase || option > maxPurchase;
          return (
            <button
              key={option}
              type="button"
              disabled={disabled}
              onClick={() => setQuantity(option)}
              className={`rounded-2xl px-4 py-3 text-left transition ${
                quantity === option ? 'bg-amber-400 text-slate-950' : 'bg-slate-900/70 text-white hover:bg-slate-800'
              } disabled:cursor-not-allowed disabled:opacity-40`}
            >
              <span className="block text-lg font-bold">{option}</span>
              <span className="text-xs">numeros</span>
            </button>
          );
        })}
      </div>

      <div className="mt-6 rounded-2xl bg-slate-900/70 p-4">
        <p className="text-sm text-slate-400">Total</p>
        <p className="mt-1 text-3xl font-black">R$ {total.toFixed(2)}</p>
      </div>

      <button
        type="button"
        onClick={handlePurchase}
        disabled={loading}
        className="mt-6 w-full rounded-2xl bg-emerald-400 px-4 py-3 font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:opacity-60"
      >
        {loading ? 'Processando...' : 'Comprar agora'}
      </button>

      <p className="mt-3 text-xs text-slate-400">
        Limites da campanha: minimo {minPurchase}, maximo {maxPurchase}. {roletaEnabled ? 'Roleta habilitada.' : 'Roleta desabilitada.'}
      </p>

      {message ? <p className="mt-4 rounded-2xl bg-white/10 p-4 text-sm">{message}</p> : null}
    </aside>
  );
}
