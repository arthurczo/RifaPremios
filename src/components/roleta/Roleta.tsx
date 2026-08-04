'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface Prize {
  id: string;
  name: string;
  type: string;
  value: number;
  color: string;
}

interface SpinHistoryItem {
  id: string;
  prizeName: string;
  prizeType: string;
  prizeValue: number;
  createdAt: string;
}

interface RoletaProps {
  available: number;
  history: SpinHistoryItem[];
  onSpin: () => Promise<{ prize: Prize; remaining: number; history?: SpinHistoryItem[] }>;
}

const wheelSegments = [
  { color: '#B91C1C', label: '5% OFF' },
  { color: '#0F766E', label: '10% OFF' },
  { color: '#A16207', label: '20% OFF' },
  { color: '#166534', label: '10 Numeros' },
  { color: '#6D28D9', label: 'Tente de novo' },
];

const wheelSize = 520;
const center = wheelSize / 2;
const radius = 220;
const innerRadius = 52;

export function Roleta({ available, history, onSpin }: RoletaProps) {
  const [spinning, setSpinning] = useState(false);
  const [prize, setPrize] = useState<Prize | null>(null);
  const [remaining, setRemaining] = useState(available);
  const [spinHistory, setSpinHistory] = useState(history);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setRemaining(available);
  }, [available]);

  useEffect(() => {
    setSpinHistory(history);
  }, [history]);

  async function handleSpin() {
    if (remaining === 0 || spinning) {
      return;
    }

    setSpinning(true);
    setError(null);

    try {
      const result = await onSpin();

      setTimeout(() => {
        setSpinning(false);
        setPrize(result.prize);
        setRemaining(result.remaining);
        if (result.history) {
          setSpinHistory(result.history);
        }
        setShowModal(true);
      }, 3600);
    } catch (requestError) {
      console.error(requestError);
      setSpinning(false);
      setError(requestError instanceof Error ? requestError.message : 'Nao foi possivel girar a roleta.');
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-6 pb-12 pt-8">
      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="rounded-[2rem] border border-white/10 bg-slate-950/35 p-6 text-white shadow-2xl backdrop-blur">
          <div className="flex flex-col gap-4 border-b border-white/10 pb-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.22em] text-cyan-200/70">Painel de giros</p>
              <h2 className="mt-2 text-4xl font-black tracking-tight">Minhas roletas</h2>
              <p className="mt-2 max-w-xl text-sm text-slate-300 md:text-base">
                Acompanhe seus giros, consulte os ultimos premios recebidos e use suas roletas com uma interface mais clara.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 self-start md:self-auto">
              <StatusCard label="Disponiveis" value={String(remaining)} tone="amber" />
              <StatusCard label="Historico" value={String(spinHistory.length)} tone="cyan" />
            </div>
          </div>

          <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
            <div className="flex min-w-0 flex-col items-center justify-center">
              {remaining === 0 ? (
                <EmptyWheelState />
              ) : (
                <div className="w-full max-w-[34rem]">
                  <div className="relative">
                    <div className="absolute left-1/2 top-2 z-20 -translate-x-1/2">
                      <div className="h-0 w-0 border-l-[18px] border-r-[18px] border-b-[30px] border-l-transparent border-r-transparent border-b-white drop-shadow-[0_10px_20px_rgba(255,255,255,0.24)]" />
                    </div>

                    <motion.div
                      className="mx-auto aspect-square w-full"
                      animate={{ rotate: spinning ? 1800 : 0 }}
                      transition={{ duration: 3.6, ease: [0.12, 0.78, 0.2, 1] }}
                    >
                      <svg viewBox={`0 0 ${wheelSize} ${wheelSize}`} className="h-full w-full drop-shadow-[0_28px_60px_rgba(2,8,23,0.55)]">
                        <defs>
                          <radialGradient id="wheel-shell" cx="50%" cy="45%" r="60%">
                            <stop offset="0%" stopColor="#1E293B" />
                            <stop offset="100%" stopColor="#020617" />
                          </radialGradient>
                        </defs>

                        <circle cx={center} cy={center} r={radius + 20} fill="url(#wheel-shell)" />
                        <circle cx={center} cy={center} r={radius + 10} fill="none" stroke="#EAB308" strokeWidth="14" />

                        {wheelSegments.map((segment, index) => {
                          const angleSize = 360 / wheelSegments.length;
                          const startAngle = index * angleSize - 90;
                          const endAngle = startAngle + angleSize;
                          const midAngle = startAngle + angleSize / 2;
                          const labelPoint = polarToCartesian(center, center, 144, midAngle);

                          return (
                            <g key={segment.label}>
                              <path d={describeSector(center, center, radius, startAngle, endAngle)} fill={segment.color} />
                              <line
                                x1={center}
                                y1={center}
                                x2={polarToCartesian(center, center, radius, startAngle).x}
                                y2={polarToCartesian(center, center, radius, startAngle).y}
                                stroke="rgba(255,255,255,0.12)"
                                strokeWidth="2"
                              />
                              <text
                                x={labelPoint.x}
                                y={labelPoint.y}
                                fill="#F8FAFC"
                                fontSize="18"
                                fontWeight="700"
                                textAnchor="middle"
                                dominantBaseline="middle"
                                transform={`rotate(${midAngle + 90}, ${labelPoint.x}, ${labelPoint.y})`}
                              >
                                {segment.label}
                              </text>
                            </g>
                          );
                        })}

                        <circle cx={center} cy={center} r={innerRadius + 12} fill="#EAB308" />
                        <circle cx={center} cy={center} r={innerRadius} fill="#0F172A" />
                        <circle cx={center} cy={center} r="8" fill="#F8FAFC" />
                      </svg>
                    </motion.div>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5">
                <p className="text-sm uppercase tracking-[0.18em] text-white/55">Acao principal</p>
                <h3 className="mt-2 text-2xl font-bold">Girar agora</h3>
                <p className="mt-2 text-sm text-slate-300">
                  Cada giro consome uma roleta. Os resultados recentes aparecem abaixo junto com o tipo de premio recebido.
                </p>

                <Button
                  size="lg"
                  onClick={handleSpin}
                  disabled={spinning || remaining === 0}
                  className="mt-5 h-14 w-full rounded-2xl bg-[linear-gradient(135deg,#f5c542,#d18d00)] text-base font-bold text-slate-950 hover:brightness-105"
                >
                  {spinning ? 'Girando a roleta...' : remaining === 0 ? 'Sem roletas disponiveis' : 'Girar roleta'}
                </Button>

                {error ? <p className="mt-3 rounded-2xl bg-red-500/10 p-3 text-sm text-red-100">{error}</p> : null}
              </div>

              <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5">
                <p className="text-sm uppercase tracking-[0.18em] text-white/55">Faixas de premio</p>
                <div className="mt-4 space-y-3">
                  {wheelSegments.map((segment) => (
                    <div key={segment.label} className="flex items-center gap-3 rounded-2xl border border-white/8 bg-slate-950/30 px-4 py-3">
                      <span className="h-3 w-3 rounded-full" style={{ backgroundColor: segment.color }} />
                      <span className="font-medium text-white">{segment.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-white/10 bg-slate-950/35 p-6 text-white shadow-2xl backdrop-blur">
          <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-5">
            <div>
              <p className="text-sm uppercase tracking-[0.18em] text-white/55">Registro recente</p>
              <h3 className="mt-2 text-2xl font-bold">Historico de giros</h3>
            </div>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-white/70">
              {spinHistory.length} resultado(s)
            </span>
          </div>

          <div className="mt-5 space-y-3">
            {spinHistory.length === 0 ? (
              <div className="rounded-[1.5rem] border border-dashed border-white/15 bg-white/5 p-6 text-sm text-slate-300">
                Nenhum giro foi registrado ainda. Assim que voce usar a roleta, os resultados aparecerao aqui.
              </div>
            ) : (
              spinHistory.map((item, index) => (
                <div key={item.id} className="rounded-[1.5rem] border border-white/8 bg-slate-950/30 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-white/45">Giro {String(index + 1).padStart(2, '0')}</p>
                      <p className="mt-1 text-lg font-semibold text-white">{item.prizeName}</p>
                      <p className="mt-1 text-sm text-slate-300">{formatPrizeMeta(item.prizeType, item.prizeValue)}</p>
                    </div>
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/60">
                      {new Date(item.createdAt).toLocaleString('pt-BR')}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-center text-3xl font-black text-slate-950">Resultado do giro</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-center">
            <div
              className="rounded-[1.5rem] p-6 text-white shadow-lg"
              style={{ background: prize?.color ? `linear-gradient(135deg, ${prize.color}, #0f172a)` : 'linear-gradient(135deg, #0f172a, #1e293b)' }}
            >
              <p className="text-sm uppercase tracking-[0.18em] text-white/70">Premio recebido</p>
              <p className="mt-3 text-3xl font-black">{prize?.name}</p>
              <p className="mt-2 text-sm text-white/80">{prize ? formatPrizeMeta(prize.type, prize.value) : ''}</p>
            </div>
            <p className="text-muted-foreground">
              Restam <strong>{remaining}</strong> roleta(s) disponiveis na sua conta.
            </p>
            <Button onClick={() => setShowModal(false)} className="w-full">
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function StatusCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: 'amber' | 'cyan';
}) {
  return (
    <div
      className={`rounded-2xl border px-4 py-3 ${
        tone === 'amber'
          ? 'border-amber-300/20 bg-amber-300/10 text-amber-100'
          : 'border-cyan-300/20 bg-cyan-300/10 text-cyan-100'
      }`}
    >
      <p className="text-xs uppercase tracking-[0.18em] opacity-70">{label}</p>
      <p className="mt-1 text-2xl font-black">{value}</p>
    </div>
  );
}

function EmptyWheelState() {
  return (
    <div className="flex w-full max-w-[34rem] flex-col items-center justify-center rounded-[2rem] border border-dashed border-white/15 bg-slate-950/30 px-8 py-14 text-center">
      <div className="rounded-full border border-amber-300/20 bg-amber-300/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-amber-100">
        Nenhuma roleta ativa
      </div>
      <h3 className="mt-5 text-3xl font-black text-white">Voce nao tem giros disponiveis no momento.</h3>
      <p className="mt-3 max-w-md text-sm text-slate-300 md:text-base">
        Compre bilhetes em campanhas que oferecem roletas para liberar novos giros e voltar a participar dos premios instantaneos.
      </p>
    </div>
  );
}

function polarToCartesian(cx: number, cy: number, r: number, angle: number) {
  const radians = (angle * Math.PI) / 180;

  return {
    x: cx + r * Math.cos(radians),
    y: cy + r * Math.sin(radians),
  };
}

function describeSector(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

  return ['M', cx, cy, 'L', start.x, start.y, 'A', r, r, 0, largeArcFlag, 0, end.x, end.y, 'Z'].join(' ');
}

function formatPrizeMeta(type: string, value: number) {
  if (type === 'DISCOUNT_PERCENT') {
    return `${value}% de desconto`;
  }

  if (type === 'FREE_NUMBERS') {
    return `${value} numeros gratis`;
  }

  if (type === 'DISCOUNT_FIXED') {
    return `R$ ${value.toFixed(2)} de desconto`;
  }

  return 'Premio sem aplicacao financeira direta';
}
