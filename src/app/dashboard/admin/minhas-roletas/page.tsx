'use client';

import { Roleta } from '@/components/roleta/Roleta';
import { useEffect, useState } from 'react';

export default function MinhasRoletasPage() {
    const [available, setAvailable] = useState(5); // Mock - depois buscar do banco

    async function handleSpin() {
        const res = await fetch('/api/roleta/spin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: 'user-id-aqui' }), // Pegar do session
        });

        const data = await res.json();
        return data;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-700">
            <Roleta available={available} onSpin={handleSpin} />
        </div>
    );
}