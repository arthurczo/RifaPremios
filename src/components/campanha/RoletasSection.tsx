interface RoletasSectionProps {
  roletaEnabled: boolean;
  roletaRules: unknown;
}

export function RoletasSection({ roletaEnabled, roletaRules }: RoletasSectionProps) {
  const rules =
    roletaRules && typeof roletaRules === 'object' && !Array.isArray(roletaRules)
      ? Object.entries(roletaRules as Record<string, unknown>)
      : [];

  return (
    <section className="mt-8 rounded-3xl border border-white/10 bg-slate-900/60 p-6">
      <h2 className="text-2xl font-bold">Regras da roleta</h2>
      {!roletaEnabled ? (
        <p className="mt-3 text-slate-300">Esta campanha ainda nao libera giros de roleta.</p>
      ) : (
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {rules.length === 0 ? (
            <p className="text-slate-300">Nenhuma regra configurada.</p>
          ) : (
            rules.map(([threshold, spins]) => (
              <div key={threshold} className="rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4">
                <p className="text-sm text-amber-100">A cada {threshold} numeros</p>
                <p className="mt-2 text-2xl font-bold text-white">{String(spins)} roleta(s)</p>
              </div>
            ))
          )}
        </div>
      )}
    </section>
  );
}
