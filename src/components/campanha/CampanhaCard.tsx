import Link from 'next/link';

import { CampaignSummary } from '@/types';

export function CampanhaCard({ campaign }: { campaign: CampaignSummary }) {
  const availableNumbers = campaign.totalNumbers - campaign.soldNumbers;

  return (
    <article className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur">
      <div className="flex h-full flex-col gap-5">
        <div className="space-y-3">
          <span className="inline-flex rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-200">
            {campaign.roletaEnabled ? 'Com roleta' : 'Rifa'}
          </span>
          <h2 className="text-2xl font-bold text-white">{campaign.name}</h2>
          <p className="line-clamp-3 text-sm text-slate-300">{campaign.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm text-slate-200">
          <Info label="Preco" value={`R$ ${campaign.price.toFixed(2)}`} />
          <Info label="Disponiveis" value={String(availableNumbers)} />
        </div>

        <Link
          href={`/campanha/${campaign.slug}`}
          className="mt-auto rounded-2xl bg-amber-400 px-4 py-3 text-center font-semibold text-slate-950 transition hover:bg-amber-300"
        >
          Ver campanha
        </Link>
      </div>
    </article>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-900/60 p-3">
      <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 font-semibold">{value}</p>
    </div>
  );
}
