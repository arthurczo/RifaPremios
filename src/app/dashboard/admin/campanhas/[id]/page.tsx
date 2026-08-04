import Link from 'next/link';
import { notFound } from 'next/navigation';

import { getCampaignById } from '@/modules/campaigns/service';
import { listOrdersByCampaign } from '@/modules/orders/service';

export const dynamic = 'force-dynamic';

interface CampaignDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function CampaignDetailPage({ params }: CampaignDetailPageProps) {
  const { id } = await params;

  const campaign = await getCampaignById(id);

  if (!campaign) {
    notFound();
  }

  const orders = (await listOrdersByCampaign(id)).slice(0, 10);

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-5xl space-y-6">
        <Link href="/dashboard/admin/campanhas" className="inline-flex rounded-xl border border-white/20 px-4 py-2">
          Voltar para campanhas
        </Link>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <h1 className="text-3xl font-bold">{campaign.name}</h1>
              <p className="mt-2 max-w-2xl text-slate-300">{campaign.description}</p>
            </div>
            <div className="rounded-2xl bg-slate-900/70 p-4 text-right">
              <p className="text-sm text-slate-400">Preco</p>
              <p className="text-2xl font-bold text-amber-300">R$ {campaign.price.toFixed(2)}</p>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-4">
          <StatCard label="Status" value={campaign.status} />
          <StatCard label="Vendidos" value={String(campaign.soldNumbers)} />
          <StatCard label="Pendentes" value={String(campaign.pendingNumbers)} />
          <StatCard label="Roleta" value={campaign.roletaEnabled ? 'Ativa' : 'Desligada'} />
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <h2 className="text-xl font-semibold">Pedidos recentes</h2>
          <div className="mt-4 space-y-3">
            {orders.length === 0 ? (
              <p className="text-slate-400">Nenhum pedido registrado ainda.</p>
            ) : (
              orders.map((order) => (
                <div key={order.id} className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="font-medium">{order.code}</p>
                      <p className="text-sm text-slate-400">{order.user.name} - {order.user.email}</p>
                    </div>
                    <div className="text-sm text-slate-300">
                      {order.quantity} numeros - R$ {order.totalAmount.toFixed(2)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-bold">{value}</p>
    </div>
  );
}
