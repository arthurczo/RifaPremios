import Link from 'next/link';
import { BadgeCheck, Clock3, CreditCard, ExternalLink, ShieldCheck } from 'lucide-react';

type SearchParams = {
  status?: string | string[];
  order?: string | string[];
  payment_id?: string | string[];
  mode?: string | string[];
};

export default function CheckoutReturnPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const status = pick(searchParams.status) ?? 'pending';
  const orderCode = pick(searchParams.order) ?? 'Pedido em processamento';
  const paymentId = pick(searchParams.payment_id);
  const isApproved = status === 'approved' || status === 'PAID';
  const isDemo = pick(searchParams.mode) === 'demo';

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        <section className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl">
          <div className="flex items-start gap-4">
            <div
              className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${
                isApproved ? 'bg-emerald-400/15 text-emerald-300' : 'bg-amber-400/15 text-amber-300'
              }`}
            >
              {isApproved ? <BadgeCheck className="h-7 w-7" /> : <Clock3 className="h-7 w-7" />}
            </div>

            <div className="min-w-0">
              <p className="text-sm uppercase tracking-[0.22em] text-cyan-200/70">Checkout Mercado Pago</p>
              <h1 className="mt-2 text-3xl font-black tracking-tight">
                {isApproved ? 'Pagamento confirmado' : 'Pagamento em andamento'}
              </h1>
              <p className="mt-3 max-w-2xl text-sm text-slate-300">
                {isApproved
                  ? 'A confirmação entrou no fluxo de processamento e o pedido foi encaminhado para liberação automática.'
                  : 'O pedido foi criado e está aguardando a confirmação do Mercado Pago. Se o pagamento foi feito por Pix, a liberação pode levar alguns minutos.'}
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-3 md:grid-cols-2">
            <InfoBox label="Pedido" value={orderCode} />
            <InfoBox label="Status" value={status.toUpperCase()} />
            {paymentId ? <InfoBox label="Pagamento" value={paymentId} /> : null}
            <InfoBox label="Modo" value={isDemo ? 'DEMO' : 'PRODUCAO'} />
          </div>

          <div className="mt-8 rounded-2xl border border-white/10 bg-slate-950/40 p-5">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 text-emerald-300" />
              <div>
                <p className="font-semibold text-white">Fluxo atual</p>
                <p className="mt-1 text-sm text-slate-300">
                  O pagamento usa Checkout Pro do Mercado Pago, com webhook assinado e pedidos mantidos como pendentes ate a confirmacao.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/dashboard/minhas-roletas"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-emerald-300"
            >
              <CreditCard className="h-4 w-4" />
              Ver minhas roletas
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-5 py-3 font-semibold text-white transition hover:bg-white/10"
            >
              <ExternalLink className="h-4 w-4" />
              Voltar para a home
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/45 px-4 py-3">
      <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{label}</p>
      <p className="mt-1 break-all text-sm font-semibold text-white">{value}</p>
    </div>
  );
}

function pick(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}
