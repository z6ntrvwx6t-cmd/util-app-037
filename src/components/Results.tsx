import React from 'react';
import { useApp } from '../lib/store';
import { calcZone, calcAudio, calcGrandTotals, formatCurrency } from '../lib/calc';

export function Results() {
  const { state } = useApp();

  const zoneResults = state.zones.map((z) => calcZone(z));
  const audioResult = calcAudio(state.audio);
  const totals = calcGrandTotals(zoneResults, audioResult);

  return (
    <div className="flex flex-col gap-4 p-4">
      <h2 className="text-gold text-lg font-bold text-center">Results</h2>

      {/* Grand totals */}
      <div className="grid grid-cols-3 gap-2">
        <TierCard
          label="Premium-RGB"
          total={totals.premiumRgb}
          variant="dark"
        />
        <TierCard
          label="Premium"
          total={totals.premium}
          variant="gold"
        />
        <TierCard
          label="Essential"
          total={totals.essential}
          variant="light"
        />
      </div>

      {/* Fixture count & protection plan */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-black rounded-lg p-3 text-center">
          <p className="text-gold text-xs font-medium">Total Fixtures</p>
          <p className="text-white text-xl font-bold">{Math.round(totals.totalFixtures)}</p>
        </div>
        <div className="bg-black rounded-lg p-3 text-center">
          <p className="text-gold text-xs font-medium">Protection Plan</p>
          <p className="text-white text-xl font-bold">{formatCurrency(totals.totalProtectionPlan)}</p>
        </div>
      </div>

      {/* Per-zone breakdown */}
      {zoneResults.map((zr, i) => {
        const hasInputs = state.zones[i].fixtures > 0 || state.zones[i].peakLights > 0 ||
          state.zones[i].stripLighting > 0 || state.zones[i].moonLights > 0;
        if (!hasInputs) return null;

        return (
          <div key={i} className="bg-neutral-900 rounded-lg p-3">
            <h3 className="text-gold text-sm font-bold mb-2">Zone {i + 1}</h3>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div>
                <p className="text-gold">Premium-RGB</p>
                <p className="text-white font-bold">{formatCurrency(zr.premiumRgb)}</p>
                <p className="text-gray-400">{formatCurrency(zr.financingPremiumRgb)}/mo</p>
              </div>
              <div>
                <p className="text-gold">Premium</p>
                <p className="text-white font-bold">{formatCurrency(zr.premium)}</p>
                <p className="text-gray-400">{formatCurrency(zr.financingPremium)}/mo</p>
              </div>
              <div>
                <p className="text-gold">Essential</p>
                <p className="text-white font-bold">{formatCurrency(zr.essential)}</p>
                <p className="text-gray-400">{formatCurrency(zr.financingEssential)}/mo</p>
              </div>
            </div>
          </div>
        );
      })}

      {/* Audio total */}
      {audioResult.total > 0 && (
        <div className="bg-neutral-900 rounded-lg p-3 text-center">
          <p className="text-gold text-sm font-bold">Audio</p>
          <p className="text-white text-xl font-bold">{formatCurrency(audioResult.total)}</p>
          <p className="text-gray-400 text-xs">{formatCurrency(audioResult.financing)}/mo</p>
        </div>
      )}
    </div>
  );
}

function TierCard({ label, total, variant }: { label: string; total: number; variant: 'dark' | 'gold' | 'light' }) {
  const bg = variant === 'dark' ? 'bg-neutral-800'
    : variant === 'gold' ? 'bg-gold'
    : 'bg-white';
  const textColor = variant === 'gold' ? 'text-white' : variant === 'light' ? 'text-gold' : 'text-gold';
  const valueColor = variant === 'gold' ? 'text-white' : variant === 'light' ? 'text-gold' : 'text-white';

  return (
    <div className={`${bg} rounded-lg p-3 text-center`}>
      <p className={`${textColor} text-xs font-medium`}>{label}</p>
      <p className={`${valueColor} text-lg font-bold`}>{formatCurrency(total)}</p>
    </div>
  );
}
