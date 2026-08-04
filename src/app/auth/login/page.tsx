'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { ShieldCheck, Sparkles } from 'lucide-react';

import { DEMO_USER_EMAIL } from '@/lib/constants';
import { APP_VERSION } from '@/lib/version';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get('next');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Falha no login');
      }

      router.push(nextPath || '/');
      router.refresh();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(19,33,66,0.95),_#08111f_55%,_#030712_100%)] px-6 py-12 text-white">
      <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(10,18,34,0.94),rgba(6,12,24,0.88))] p-8 shadow-2xl backdrop-blur">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.22em] text-cyan-200/70">Acesso seguro</p>
            <h1 className="mt-2 text-3xl font-bold">Entrar</h1>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-cyan-100">
            <ShieldCheck className="h-5 w-5" />
          </div>
        </div>

        <p className="mt-3 text-sm text-slate-300">
          Entre para concluir compras, acompanhar roletas e operar o painel da plataforma.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm text-slate-300">Email</span>
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              inputMode="email"
              className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 outline-none transition focus:border-amber-300"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm text-slate-300">Senha</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 outline-none transition focus:border-amber-300"
            />
          </label>

          {error ? <p className="rounded-xl bg-red-500/10 p-3 text-sm text-red-200">{error}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-amber-400 px-4 py-3 font-semibold text-slate-950 transition hover:bg-amber-300 disabled:opacity-60"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className="mt-6 rounded-2xl border border-white/8 bg-slate-900/70 p-4 text-sm text-slate-200">
          <p className="flex items-center gap-2 font-medium text-white">
            <Sparkles className="h-4 w-4 text-amber-300" />
            Acesso de demonstracao
          </p>
          <p className="mt-2">Email: {DEMO_USER_EMAIL}</p>
          <p>Senha: senha123</p>
          <p className="mt-3 text-xs uppercase tracking-[0.18em] text-slate-400">Versao {APP_VERSION}</p>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/" className="rounded-xl border border-white/20 px-4 py-2 font-semibold">
            Ir para inicio
          </Link>
          <Link href="/auth/register" className="rounded-xl border border-white/20 px-4 py-2 font-semibold">
            Criar conta
          </Link>
        </div>
      </div>
    </main>
  );
}
