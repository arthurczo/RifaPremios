'use client';

import { useEffect, useState } from 'react';

import { AuthHeader } from '@/components/layout/AuthHeader';
import { Roleta } from '@/components/roleta/Roleta';

interface SpinHistoryItem {
  id: string;
  prizeName: string;
  prizeType: string;
  prizeValue: number;
  createdAt: string;
}

export default function MinhasRoletasPage() {
  const [available, setAvailable] = useState(0);
  const [history, setHistory] = useState<SpinHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRoletas() {
      try {
        const res = await fetch('/api/roleta', {
          method: 'GET',
        });
        const data = await res.json();
        setAvailable(data.total || 0);
        setHistory(data.history || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchRoletas();
  }, []);

  async function handleSpin() {
    const res = await fetch('/api/roleta/spin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || 'Erro ao girar roleta');
    }

    setAvailable(data.remaining);
    setHistory(data.history || []);
    return data;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[linear-gradient(180deg,#081224_0%,#0f1d33_42%,#07111f_100%)] px-6 py-10">
        <div className="mx-auto max-w-7xl">
          <AuthHeader
            title="Minhas roletas"
            subtitle="Consulte os giros disponiveis, acompanhe seu historico e use suas tentativas com uma interface mais clara."
          />
          <div className="mt-6 rounded-[2rem] border border-white/10 bg-slate-950/35 p-10 text-center text-white shadow-2xl backdrop-blur">
            Carregando painel de roletas...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#081224_0%,#0f1d33_42%,#07111f_100%)] py-10">
      <div className="mx-auto max-w-7xl">
        <AuthHeader
          title="Minhas roletas"
          subtitle="Consulte os giros disponiveis, acompanhe seu historico e use suas tentativas com uma interface mais clara."
        />
        <Roleta available={available} history={history} onSpin={handleSpin} />
      </div>
    </div>
  );
}
