import React from 'react';
import { useApp } from '../lib/store';
import { FIXTURE_TYPES } from '../lib/calc';
import { Counter } from './Counter';

export function ZoneCalculator() {
  const { state, dispatch } = useApp();
  const zone = state.zones[state.activeZone];

  const setInput = (key: string, value: number) => {
    dispatch({ type: 'SET_ZONE_INPUT', zone: state.activeZone, key, value });
  };

  return (
    <div className="flex flex-col gap-3 p-4">
      <h2 className="text-gold text-lg font-bold text-center">
        Zone {state.activeZone + 1}
      </h2>

      {FIXTURE_TYPES.map((ft) => {
        if (ft.key === 'extraCosts') {
          return (
            <Counter
              key={ft.key}
              label={ft.label}
              value={zone[ft.key] || 0}
              onChange={(v) => setInput(ft.key, v)}
              inputKind="dollar"
              step={100}
            />
          );
        }
        if (ft.key === 'modularUpgrade') {
          return (
            <Counter
              key={ft.key}
              label={ft.label}
              value={zone[ft.key] || 0}
              onChange={(v) => setInput(ft.key, v)}
              min={0}
              step={1}
            />
          );
        }
        return (
          <Counter
            key={ft.key}
            label={ft.label}
            value={zone[ft.key] || 0}
            onChange={(v) => setInput(ft.key, v)}
            inputKind={ft.inputKind === 'ft' ? 'ft' : 'count'}
            step={ft.inputKind === 'ft' ? 10 : 1}
          />
        );
      })}

      {/* Discount slider */}
      <div className="bg-black rounded-lg px-4 py-3 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gold">Discount</span>
          <span className="text-gold font-bold">{Math.round((zone.discount || 0) * 100)}%</span>
        </div>
        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={zone.discount || 0}
          onChange={(e) => setInput('discount', parseFloat(e.target.value))}
          className="w-full accent-gold"
        />
      </div>
    </div>
  );
}
