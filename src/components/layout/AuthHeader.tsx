import Link from 'next/link';

import { LogoutButton } from '@/components/layout/LogoutButton';

interface AuthHeaderProps {
  title: string;
  subtitle: string;
}

export function AuthHeader({ title, subtitle }: AuthHeaderProps) {
  return (
    <header className="rounded-[2rem] border border-white/10 bg-slate-950/35 px-6 py-5 text-white shadow-2xl backdrop-blur">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200/70">
            <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1">Area autenticada</span>
            <span className="text-white/40">RifaPremios</span>
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight">{title}</h1>
            <p className="mt-1 max-w-2xl text-sm text-slate-300 md:text-base">{subtitle}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/"
            className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
          >
            Campanhas
          </Link>
          <Link
            href="/dashboard/admin/campanhas"
            className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
          >
            Painel
          </Link>
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
