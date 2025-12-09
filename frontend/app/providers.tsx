'use client';

import { ReactNode } from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import { I18nProvider } from '@/contexts/I18nContext';
import { SocketProvider } from '@/contexts/SocketContext';
import PrefetchProvider from '@/components/providers/PrefetchProvider';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <I18nProvider>
      <AuthProvider>
        <SocketProvider>
          <PrefetchProvider>
            {children}
          </PrefetchProvider>
        </SocketProvider>
      </AuthProvider>
    </I18nProvider>
  );
}