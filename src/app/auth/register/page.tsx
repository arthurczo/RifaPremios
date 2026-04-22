import Link from 'next/link';

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-12 text-white">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
        <h1 className="text-3xl font-bold">Cadastro</h1>
        <p className="mt-2 text-sm text-slate-300">
          A etapa de cadastro real ainda nao foi implementada. O projeto esta operando com um usuario demo para validar o fluxo principal.
        </p>
        <div className="mt-6 flex gap-3">
          <Link href="/" className="rounded-xl bg-amber-400 px-4 py-2 font-semibold text-slate-950">
            Ver campanhas
          </Link>
          <Link href="/auth/login" className="rounded-xl border border-white/20 px-4 py-2 font-semibold">
            Voltar para login
          </Link>
        </div>
      </div>
    </main>
  );
}
