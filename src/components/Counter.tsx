import React from 'react';

interface CounterProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  step?: number;
  inputKind?: 'count' | 'ft' | 'dollar' | 'percent';
}

export function Counter({ label, value, onChange, min = 0, step = 1, inputKind = 'count' }: CounterProps) {
  const decrement = () => onChange(Math.max(min, value - step));
  const increment = () => onChange(value + step);

  const displayValue = inputKind === 'dollar'
    ? `$${value.toLocaleString()}`
    : inputKind === 'percent'
    ? `${Math.round(value * 100)}%`
    : inputKind === 'ft'
    ? `${value} ft`
    : value.toString();

  return (
    <div className="flex items-center justify-between bg-white rounded-lg px-4 py-3 shadow-sm">
      <span className="text-sm font-medium text-gray-800">{label}</span>
      <div className="flex items-center gap-3">
        <button
          onClick={decrement}
          className="w-9 h-9 rounded-full bg-black text-gold flex items-center justify-center text-xl font-bold active:scale-95 transition-transform"
          disabled={value <= min}
        >
          −
        </button>
        <span className="w-16 text-center text-lg font-bold text-gray-900 tabular-nums">
          {displayValue}
        </span>
        <button
          onClick={increment}
          className="w-9 h-9 rounded-full bg-gold text-black flex items-center justify-center text-xl font-bold active:scale-95 transition-transform"
        >
          +
        </button>
      </div>
    </div>
  );
}
