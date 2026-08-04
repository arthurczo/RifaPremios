import Link from 'next/link';

import { listCampaigns } from '@/modules/campaigns/service';

export const dynamic = 'force-dynamic';

export default async function AdminCampanhasPage() {
  const campaigns = (await listCampaigns()).slice();

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Campanhas</h1>
            <p className="text-slate-400">Visao administrativa inicial com dados reais do banco.</p>
          </div>
          <Link href="/" className="rounded-xl border border-white/20 px-4 py-2">
            Voltar
          </Link>
        </div>

        <div className="grid gap-4">
          {campaigns.map((campaign) => (
            <Link
              key={campaign.id}
              href={`/dashboard/admin/campanhas/${campaign.id}`}
              className="rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:bg-white/10"
            >
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-xl font-semibold">{campaign.name}</h2>
                  <p className="text-sm text-slate-400">/{campaign.slug}</p>
                </div>
                <div className="text-right text-sm text-slate-300">
                  <p>R$ {campaign.price.toFixed(2)} por numero</p>
                  <p className="text-slate-400">
                    {campaign.soldNumbers} vendidos · {campaign.pendingNumbers} pendentes
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
