import Link from 'next/link';
import { ArrowLeft, CheckSquare2, Square } from 'lucide-react';

import { roadmapPhases } from '@/lib/roadmap';

export const dynamic = 'force-dynamic';

export default function RoadmapPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="flex flex-col gap-4 border-b border-white/10 pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.22em] text-cyan-200/70">Plano de entrega</p>
            <h1 className="mt-2 text-4xl font-black tracking-tight">Roadmap</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-300">
              A base de execução já está estável. O próximo foco é MercadoPago e, depois, a preparação para multi-tenant.
            </p>
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-4 py-3 font-medium text-white transition hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Link>
        </div>

        <div className="space-y-4">
          {roadmapPhases.map((phase) => (
            <section key={phase.title} className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h2 className="text-lg font-semibold">{phase.title}</h2>
              <div className="mt-4 space-y-3">
                {phase.items.map((item) => {
                  const Icon = item.status === 'done' ? CheckSquare2 : Square;
                  const tone =
                    item.status === 'done'
                      ? 'text-emerald-300'
                      : item.status === 'next'
                        ? 'text-amber-300'
                        : 'text-slate-400';

                  return (
                    <div
                      key={item.label}
                      className="flex items-start gap-3 rounded-xl border border-white/8 bg-slate-950/30 px-4 py-3"
                    >
                      <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${tone}`} />
                      <span className="text-sm text-slate-100">{item.label}</span>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
