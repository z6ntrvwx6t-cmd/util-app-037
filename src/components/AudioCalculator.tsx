import React from 'react';
import { useApp } from '../lib/store';
import { AUDIO_PRODUCTS, calcAudio, formatCurrency } from '../lib/calc';
import { Counter } from './Counter';

export function AudioCalculator() {
  const { state, dispatch } = useApp();
  const audio = state.audio;
  const result = calcAudio(audio);

  const setInput = (key: string, value: number) => {
    dispatch({ type: 'SET_AUDIO_INPUT', key, value });
  };

  return (
    <div className="flex flex-col gap-3 p-4">
      <h2 className="text-gold text-lg font-bold text-center">Audio</h2>

      {/* Audio total at top */}
      <div className="grid grid-cols-2 gap-2 mb-2">
        <div className="bg-black rounded-lg p-3 text-center">
          <p className="text-gold text-xs font-medium">Audio Total</p>
          <p className="text-white text-xl font-bold">{formatCurrency(result.total)}</p>
        </div>
        <div className="bg-neutral-800 rounded-lg p-3 text-center">
          <p className="text-gold text-xs font-medium">12-Month Financing</p>
          <p className="text-gold text-xl font-bold">{formatCurrency(result.financing)}</p>
        </div>
      </div>

      {/* Audio product counters */}
      {AUDIO_PRODUCTS.map((product) => (
        <Counter
          key={product.key}
          label={product.label}
          value={audio[product.key] || 0}
          onChange={(v) => setInput(product.key, v)}
          inputKind={product.key === 'audioExtraCosts' ? 'dollar' : 'count'}
          step={product.key === 'audioExtraCosts' ? 100 : 1}
        />
      ))}

      {/* Audio discount */}
      <div className="bg-black rounded-lg px-4 py-3 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gold">Discount</span>
          <span className="text-gold font-bold">{Math.round((audio.audioDiscount || 0) * 100)}%</span>
        </div>
        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={audio.audioDiscount || 0}
          onChange={(e) => setInput('audioDiscount', parseFloat(e.target.value))}
          className="w-full accent-gold"
        />
      </div>
    </div>
  );
}
