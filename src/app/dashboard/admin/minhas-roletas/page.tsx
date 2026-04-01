'use client';

import { Roleta } from '@/components/roleta/Roleta';
import { useEffect, useState } from 'react';

export default function MinhasRoletasPage() {
    const [available, setAvailable] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Buscar roletas do usuário
        async function fetchRoletas() {
            try {
                const res = await fetch('/api/roleta/minhas', {
                    method: 'GET',
                });
                const data = await res.json();
                setAvailable(data.total || 0);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }

        fetchRoletas();
    }, []);

    async function handleSpin() {
        const res = await fetch('/api/roleta/spin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: 'b340e2e3-2d33-11f1-9ada-50a13249a336' }), // TODO: pegar do session
        });

        const data = await res.json();
        setAvailable(data.remaining);
        return data;
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-indigo-700">
                <p className="text-white text-2xl">Carregando...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-700">
            <Roleta available={available} onSpin={handleSpin} />
        </div>
    );
}