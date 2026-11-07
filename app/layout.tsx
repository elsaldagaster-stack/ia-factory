import React from 'react';
import { ClerkProvider } from '@clerk/nextjs';
import type { Metadata } from 'next';
import '@tabler/core/dist/css/tabler.min.css';

export const metadata: Metadata = {
  title: 'IA Factory',
  description: 'Plataforma de producción de software con IA',
};

export default function RootLayout({ children }: { children: React.ReactNode }): React.ReactElement {
  return (
    <html lang="es">
      <body>
        <ClerkProvider>{children}</ClerkProvider>
      </body>
    </html>
  );
}
