'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface Prize {
    id: string;
    name: string;
    type: string;
    value: number;
    color: string;
}

interface RoletaProps {
    available: number;
    onSpin: () => Promise<{ prize: Prize; remaining: number }>;
}

export function Roleta({ available, onSpin }: RoletaProps) {
    const [spinning, setSpinning] = useState(false);
    const [prize, setPrize] = useState<Prize | null>(null);
    const [remaining, setRemaining] = useState(available);
    const [showModal, setShowModal] = useState(false);

    const PRIZES = [
        { color: '#FF6B6B', label: '5% OFF' },
        { color: '#4ECDC4', label: '10% OFF' },
        { color: '#FFD93D', label: '20% OFF' },
        { color: '#6BCF7F', label: '10 Grátis' },
        { color: '#C77DFF', label: 'Tente +' },
    ];

    async function handleSpin() {
        if (remaining === 0 || spinning) return;

        setSpinning(true);

        try {
            const result = await onSpin();

            setTimeout(() => {
                setSpinning(false);
                setPrize(result.prize);
                setRemaining(result.remaining);
                setShowModal(true);
            }, 4000);
        } catch (error) {
            console.error(error);
            setSpinning(false);
            alert('Erro ao girar roleta');
        }
    }

    return (
        <div className="flex flex-col items-center gap-8 p-8">
            <div className="text-center">
                <h1 className="text-3xl font-bold mb-2">🎰 Minhas Roletas</h1>
                <p className="text-lg text-muted-foreground">
                    Você tem <span className="text-2xl font-bold text-yellow-500">{remaining}</span> roleta(s)
                </p>
            </div>

            {/* Seta */}
            <div className="relative w-96 h-96">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 z-10">
                    <div className="w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-t-[40px] border-t-red-500 drop-shadow-lg" />
                </div>

                {/* Roleta */}
                <motion.div
                    className="w-full h-full rounded-full border-[10px] border-yellow-400 relative overflow-hidden shadow-2xl"
                    animate={{ rotate: spinning ? 1800 : 0 }}
                    transition={{ duration: 4, ease: 'easeOut' }}
                    style={{
                        background: `conic-gradient(
              ${PRIZES[0].color} 0deg 72deg,
              ${PRIZES[1].color} 72deg 144deg,
              ${PRIZES[2].color} 144deg 216deg,
              ${PRIZES[3].color} 216deg 288deg,
              ${PRIZES[4].color} 288deg 360deg
            )`,
                    }}
                >
                    {/* Centro da roleta */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-white rounded-full border-4 border-yellow-400 flex items-center justify-center text-3xl shadow-lg z-10">
                        🎁
                    </div>

                    {/* Labels dos prêmios */}
                    {PRIZES.map((prize, i) => (
                        <div
                            key={i}
                            className="absolute top-[30%] left-[60%] text-white font-bold text-sm drop-shadow-lg"
                            style={{
                                transform: `rotate(${i * 72 + 36}deg)`,
                                transformOrigin: 'center',
                            }}
                        >
                            {prize.label}
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* Botão */}
            <Button
                size="lg"
                onClick={handleSpin}
                disabled={spinning || remaining === 0}
                className="w-64 h-14 text-lg font-bold bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600"
            >
                {spinning ? '🔄 Girando...' : remaining === 0 ? '😔 Sem roletas' : '🎯 GIRAR ROLETA'}
            </Button>

            {/* Modal de Prêmio */}
            <Dialog open={showModal} onOpenChange={setShowModal}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-3xl text-center text-yellow-500">
                            🎉 PARABÉNS!
                        </DialogTitle>
                    </DialogHeader>
                    <div className="text-center space-y-4">
                        <div className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent p-6 bg-gray-50 rounded-lg">
                            {prize?.name}
                        </div>
                        <p className="text-muted-foreground">
                            Você ainda tem <strong>{remaining}</strong> roleta(s)
                        </p>
                        <Button onClick={() => setShowModal(false)} className="w-full">
                            ✨ FECHAR
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}