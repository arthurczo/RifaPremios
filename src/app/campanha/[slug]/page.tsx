import Link from 'next/link';
import { notFound } from 'next/navigation';

import { CompraBilhetes } from '@/components/campanha/CompraBilhetes';
import { RoletasSection } from '@/components/campanha/RoletasSection';
import { getCampaignBySlug } from '@/modules/campaigns/service';

export const dynamic = 'force-dynamic';

interface CampaignPageProps {
  params: Promise<{ slug: string }>;
}

export default async function CampaignPage({ params }: CampaignPageProps) {
  const { slug } = await params;

  const campaign = await getCampaignBySlug(slug);

  if (!campaign) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <section className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <Link href="/" className="inline-flex rounded-xl border border-white/20 px-4 py-2 text-sm">
            Voltar
          </Link>
          <h1 className="mt-6 text-4xl font-black">{campaign.name}</h1>
          <p className="mt-4 text-lg text-slate-300">{campaign.description}</p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <InfoCard label="Preco por numero" value={`R$ ${campaign.price.toFixed(2)}`} />
            <InfoCard label="Disponiveis" value={String(campaign.totalNumbers - campaign.soldNumbers)} />
            <InfoCard label="Compra minima" value={String(campaign.minPurchase)} />
          </div>

          <RoletasSection roletaEnabled={campaign.roletaEnabled} roletaRules={campaign.roletaRules} />
        </section>

        <CompraBilhetes
          campaignId={campaign.id}
          price={campaign.price}
          minPurchase={campaign.minPurchase}
          maxPurchase={campaign.maxPurchase}
          roletaEnabled={campaign.roletaEnabled}
        />
      </div>
    </main>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-bold">{value}</p>
    </div>
  );
}
