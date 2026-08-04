'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

import { DEMO_USER_EMAIL } from '@/lib/constants';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState(DEMO_USER_EMAIL);
  const [password, setPassword] = useState('senha123');
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

      const nextPath =
        typeof window !== 'undefined'
          ? new URLSearchParams(window.location.search).get('next')
          : null;

      router.push(nextPath || '/');
      router.refresh();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(26,48,102,0.92),_#08111f_55%,_#030712_100%)] px-6 py-12 text-white">
      <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(10,18,34,0.92),rgba(6,12,24,0.84))] p-8 shadow-2xl backdrop-blur">
        <h1 className="text-3xl font-bold">Login</h1>
        <p className="mt-2 text-sm text-slate-300">
          Acesse a area autenticada para acompanhar roletas, historico de giros e operacoes administrativas basicas.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm text-slate-300">Email</span>
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 outline-none transition focus:border-amber-300"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm text-slate-300">Senha</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
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
          <p className="font-medium text-white">Acesso de demonstracao</p>
          <p className="mt-2">Email: {DEMO_USER_EMAIL}</p>
          <p>Senha: senha123</p>
        </div>

        <div className="mt-6 flex gap-3">
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
