'use client';

import React, { ReactNode } from 'react';
import { AuthProvider } from './AuthContext';

interface AuthClientProviderProps {
  children: ReactNode;
}

export const AuthClientProvider = ({ children }: AuthClientProviderProps) => {
  return <AuthProvider>{children}</AuthProvider>;
}; 