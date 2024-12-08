'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface AuthViewContext {
  view: string;
  setView: (value: string) => void;
}

const AuthViewContext = createContext<AuthViewContext | undefined>(undefined);

export function AuthViewProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState('SIGNIN');
  return (
    <AuthViewContext.Provider value={{ view, setView }}>
      {children}
    </AuthViewContext.Provider>
  );
}

export function useAuthView() {
  const context = useContext(AuthViewContext);
  if (context === undefined) {
    throw new Error(
      'useAuthView는 AuthViewProvider 내부의 컴포넌트에서만 사용 가능합니다',
    );
  }
  return context;
}
