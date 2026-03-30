import type { Metadata } from 'next';
import '../styles/globals.css';   // ← caminho relativo a partir de src/app

export const metadata: Metadata = {
    title: 'Rifa Premios',
    description: 'Plataforma de rifas',
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="pt-BR">
        <body>{children}</body>
        </html>
    );
}