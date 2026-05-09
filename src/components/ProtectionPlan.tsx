import React from 'react';
import { useApp } from '../lib/store';
import { calcZone, calcFixtureCount, formatCurrency } from '../lib/calc';

const PROTECTION_RATE = 19.79;
const MARKUP = 1.03;

export function ProtectionPlan() {
  const { state } = useApp();

  const totalFixtures = state.zones.reduce((sum, z) => sum + calcFixtureCount(z), 0);
  const annualCost = totalFixtures * PROTECTION_RATE * MARKUP;
  const semiAnnualCost = annualCost * 2;

  return (
    <div className="flex flex-col gap-4 p-4">
      <h2 className="text-gold text-lg font-bold text-center">Protection Plan</h2>

      <div className="bg-black rounded-lg p-4 text-center">
        <p className="text-gold text-xs font-medium mb-1">Total Fixtures</p>
        <p className="text-white text-3xl font-bold">{Math.round(totalFixtures)}</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-neutral-800 rounded-lg p-4 text-center">
          <p className="text-gold text-xs font-medium mb-1">Annual</p>
          <p className="text-white text-xl font-bold">{formatCurrency(annualCost)}</p>
          <p className="text-gray-400 text-xs mt-1">1× per year</p>
        </div>
        <div className="bg-neutral-800 rounded-lg p-4 text-center">
          <p className="text-gold text-xs font-medium mb-1">Semi-Annual</p>
          <p className="text-white text-xl font-bold">{formatCurrency(semiAnnualCost)}</p>
          <p className="text-gray-400 text-xs mt-1">2× per year</p>
        </div>
      </div>

      <div className="bg-neutral-900 rounded-lg p-3 text-center">
        <p className="text-gray-400 text-xs">
          Rate: ${PROTECTION_RATE}/fixture × {MARKUP} markup
        </p>
      </div>
    </div>
  );
}
