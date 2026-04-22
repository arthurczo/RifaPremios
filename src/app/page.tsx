import Link from 'next/link';

import { CampanhaCard } from '@/components/campanha/CampanhaCard';
import { LogoutButton } from '@/components/layout/LogoutButton';
import { getSessionUser } from '@/lib/auth';
import { listActiveCampaigns } from '@/modules/campaigns/service';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const user = await getSessionUser();
  const campaigns = await listActiveCampaigns();

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(26,48,102,0.92),_#08111f_52%,_#030712_100%)] px-6 py-10 text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-10">
        <section className="rounded-[2.25rem] border border-white/10 bg-[linear-gradient(135deg,rgba(13,26,52,0.88),rgba(9,17,31,0.82))] p-8 shadow-2xl backdrop-blur md:p-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl space-y-4">
              <span className="inline-flex rounded-full border border-cyan-300/25 bg-cyan-300/10 px-3 py-1 text-sm text-cyan-100">
                Plataforma de rifas premiadas
              </span>
              <h1 className="text-4xl font-black tracking-tight md:text-6xl">
                Rifas e roletas premiadas
              </h1>
              <p className="text-lg text-slate-200/90">
                Explore campanhas ativas, acompanhe suas compras e utilize as roletas disponiveis.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 md:max-w-[15rem] md:justify-end">
              {user ? (
                <>
                  <Link
                    href="/dashboard/minhas-roletas"
                    className="rounded-2xl bg-[linear-gradient(135deg,#f4c24d,#bb8500)] px-5 py-3 font-semibold text-slate-950 transition hover:brightness-105"
                  >
                    Minhas roletas
                  </Link>
                  <LogoutButton />
                </>
              ) : (
                <Link
                  href="/auth/login"
                  className="rounded-2xl bg-[linear-gradient(135deg,#f4c24d,#bb8500)] px-5 py-3 font-semibold text-slate-950 transition hover:brightness-105"
                >
                  Entrar
                </Link>
              )}
              <Link
                href="/dashboard/admin/campanhas"
                className="rounded-2xl border border-white/15 bg-white/4 px-5 py-3 font-semibold text-white transition hover:bg-white/10"
              >
                Painel admin
              </Link>
            </div>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {campaigns.map((campaign) => (
            <CampanhaCard key={campaign.id} campaign={campaign} />
          ))}
        </section>
      </div>
    </main>
  );
}
