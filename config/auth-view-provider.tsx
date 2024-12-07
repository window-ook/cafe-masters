'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface AuthViewContextType {
  view: string;
  setView: (value: string) => void;
}

const AuthViewContext = createContext<AuthViewContextType | undefined>(
  undefined,
);

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
    throw new Error('컨텍스트가 제대로 지정되지 않았습니다');
  }
  return context;
}
