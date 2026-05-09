import React from 'react';
import { AppProvider } from './lib/store';
import { AppLayout } from './components/AppLayout';

export default function App() {
  return (
    <AppProvider>
      <AppLayout />
    </AppProvider>
  );
}
