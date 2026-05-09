import React from 'react';
import { useApp } from '../lib/store';
import { ZoneCalculator } from './ZoneCalculator';
import { Results } from './Results';
import { AudioCalculator } from './AudioCalculator';
import { ProtectionPlan } from './ProtectionPlan';

export function AppLayout() {
  const { state, dispatch } = useApp();

  const tabs = [
    { key: 'calculator' as const, label: 'Calculator' },
    { key: 'results' as const, label: 'Results' },
    { key: 'audio' as const, label: 'Audio' },
    { key: 'protection' as const, label: 'Protection' },
  ];

  const zoneTabs = [0, 1, 2, 3];

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header */}
      <header className="bg-black border-b border-neutral-800 px-4 py-3 flex items-center justify-center">
        <h1 className="text-gold text-xl font-bold tracking-wide">
          MCOL Designer
        </h1>
      </header>

      {/* Main nav tabs */}
      <nav className="bg-neutral-900 flex border-b border-neutral-800">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => dispatch({ type: 'SET_ACTIVE_TAB', tab: tab.key })}
            className={`flex-1 py-2.5 text-xs font-medium text-center transition-colors ${
              state.activeTab === tab.key
                ? 'text-gold border-b-2 border-gold'
                : 'text-gray-500'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Zone tabs (only on calculator tab) */}
      {state.activeTab === 'calculator' && (
        <div className="bg-neutral-900 flex px-4 gap-2 py-2">
          {zoneTabs.map((i) => (
            <button
              key={i}
              onClick={() => dispatch({ type: 'SET_ACTIVE_ZONE', zone: i })}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${
                state.activeZone === i
                  ? 'bg-gold text-black'
                  : 'bg-neutral-800 text-gray-400'
              }`}
            >
              Zone {i + 1}
            </button>
          ))}
        </div>
      )}

      {/* Content */}
      <main className="flex-1 overflow-y-auto pb-20">
        {state.activeTab === 'calculator' && <ZoneCalculator />}
        {state.activeTab === 'results' && <Results />}
        {state.activeTab === 'audio' && <AudioCalculator />}
        {state.activeTab === 'protection' && <ProtectionPlan />}
      </main>
    </div>
  );
}
