import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import '../styles/globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Rifa Premios',
    template: '%s | Rifa Premios',
  },
  description: 'Plataforma de rifas com checkout Mercado Pago, cadastro e roletas.',
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="bg-slate-950 text-white antialiased">{children}</body>
    </html>
  );
}
