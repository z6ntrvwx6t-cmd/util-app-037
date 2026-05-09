// MCOL Pricing Calculator — Core Calculation Engine
// All formulas extracted from the MCOL Designer spreadsheet

export interface FixtureType {
  key: string;
  label: string;
  basePrice: number;
  inputKind?: 'count' | 'ft';
  fixturesPerUnit?: number; // for converting ft to fixture count
}

export interface AudioProduct {
  key: string;
  label: string;
  price: number;
}

export interface ZoneInputs {
  [key: string]: number; // fixture key -> quantity
}

export interface ZoneResult {
  premiumRgb: number;
  premium: number;
  essential: number;
  subtotalPremiumRgb: number;
  subtotalPremium: number;
  subtotalEssential: number;
  financingPremiumRgb: number;
  financingPremium: number;
  financingEssential: number;
  fixtureCount: number;
  protectionPlan: number;
}

export interface AudioInputs {
  [key: string]: number;
}

export interface AudioResult {
  subtotal: number;
  total: number;
  financing: number;
}

// -------------------------------------------------------------------
// MCOL fixture types with base prices
// -------------------------------------------------------------------
export const FIXTURE_TYPES: FixtureType[] = [
  { key: 'fixtures', label: 'Fixtures', basePrice: 440 },
  { key: 'peakLights', label: 'Peak Lights', basePrice: 540 },
  { key: 'transformers', label: 'Transformers', basePrice: 1000 },
  { key: 'stripLighting', label: 'Strip Lighting', basePrice: 100, inputKind: 'ft', fixturesPerUnit: 4.4 },
  { key: 'bistroLighting', label: 'Bistro Lighting', basePrice: 30, inputKind: 'ft', fixturesPerUnit: 14.6 },
  { key: 'metalStakes', label: 'Metal Stakes', basePrice: 40 },
  { key: 'extraCosts', label: 'Extra Costs', basePrice: 1 }, // raw dollar amount
  { key: 'moonLights', label: 'Moon Lights', basePrice: 1000 },
  { key: 'transformer300', label: '300W Transformer', basePrice: 1200 },
  { key: 'transformer600', label: '600W Transformer', basePrice: 1500 },
  { key: 'smartTransformer', label: 'Smart Transformer', basePrice: 1800 },
  { key: 'modularUpgrade', label: 'Modular Upgrade', basePrice: 75 },
];

// -------------------------------------------------------------------
// MCOL audio products with prices
// -------------------------------------------------------------------
export const AUDIO_PRODUCTS: AudioProduct[] = [
  { key: 'ultrascapePro', label: 'Ultrascape Pro', price: 10562 },
  { key: 'leaConnect4', label: 'Lea Connect - 4', price: 12071 },
  { key: 'leaConnect6', label: 'Lea Connect - 6', price: 15542 },
  { key: 'vssl', label: 'VSSL', price: 819 },
  { key: 'sonosPort', label: 'Sonos Port', price: 819 },
  { key: 'sonosAmp', label: 'Sonos Amp', price: 1223 },
  { key: 'additionalSpeakers', label: 'Additional Speakers', price: 717 },
  { key: 'inGroundSub', label: 'In-Ground Sub', price: 2214 },
  { key: 'hardscapeSub', label: 'Hardscape Sub', price: 2512 },
  { key: 'audioExtraCosts', label: 'Extra Costs', price: 1 },
];

// -------------------------------------------------------------------
// Tier multipliers
// -------------------------------------------------------------------
export const TIER_MULTIPLIERS = {
  premiumRgb: 1.788,
  premium: 1.0,
  essential: 0.894,
};

// Keys that get the Premium-RGB multiplier applied
const RGB_MULTIPLIED_KEYS = [
  'fixtures', 'peakLights', 'transformers', 'stripLighting',
  'bistroLighting', 'moonLights', 'transformer300', 'transformer600',
];

// Keys that get the Essential multiplier applied
const ESSENTIAL_MULTIPLIED_KEYS = [
  'fixtures', 'peakLights', 'moonLights',
];

// Keys that are always at base (no multiplier in any tier)
// metalStakes, smartTransformer, modularUpgrade, extraCosts

// -------------------------------------------------------------------
// Constants
// -------------------------------------------------------------------
const MARKUP = 1.03;
const PROTECTION_PLAN_PER_FIXTURE = 19.79;
const FINANCING_MONTHS = 12;

// -------------------------------------------------------------------
// Calculate line item cost (quantity × base price)
// -------------------------------------------------------------------
function lineItemCost(key: string, quantity: number): number {
  const fixture = FIXTURE_TYPES.find(f => f.key === key);
  if (!fixture) return 0;
  if (key === 'extraCosts') return quantity; // raw dollar amount
  return quantity * fixture.basePrice;
}

// -------------------------------------------------------------------
// Calculate fixture count for protection plan
// (fixtures + peakLights + stripFt/4.4 + bistroFt/14.6 + moonLights)
// -------------------------------------------------------------------
export function calcFixtureCount(inputs: ZoneInputs): number {
  const fixtures = inputs.fixtures || 0;
  const peakLights = inputs.peakLights || 0;
  const stripFt = inputs.stripLighting || 0;
  const bistroFt = inputs.bistroLighting || 0;
  const moonLights = inputs.moonLights || 0;
  return fixtures + peakLights + (stripFt / 4.4) + (bistroFt / 14.6) + moonLights;
}

// -------------------------------------------------------------------
// Calculate modular upgrade cost
// Modular upgrade count = fixtures + peakLights + moonLights
// Cost = count × $75
// -------------------------------------------------------------------
function calcModularUpgradeCost(inputs: ZoneInputs): number {
  const modularEnabled = inputs.modularUpgrade || 0;
  if (modularEnabled === 0) return 0;
  const count = (inputs.fixtures || 0) + (inputs.peakLights || 0) + (inputs.moonLights || 0);
  return count * 75;
}

// -------------------------------------------------------------------
// Calculate zone subtotal for a given tier
// -------------------------------------------------------------------
function calcSubtotal(inputs: ZoneInputs, tier: 'premiumRgb' | 'premium' | 'essential'): number {
  let subtotal = 0;
  const multipliedKeys = tier === 'premiumRgb' ? RGB_MULTIPLIED_KEYS
    : tier === 'essential' ? ESSENTIAL_MULTIPLIED_KEYS
    : [];
  const multiplier = TIER_MULTIPLIERS[tier];

  for (const ft of FIXTURE_TYPES) {
    if (ft.key === 'extraCosts' || ft.key === 'modularUpgrade') continue;
    const qty = inputs[ft.key] || 0;
    const cost = lineItemCost(ft.key, qty);
    if (multipliedKeys.includes(ft.key)) {
      subtotal += cost * multiplier;
    } else if (tier === 'premium') {
      subtotal += cost; // everything at 1.0
    } else {
      subtotal += cost; // non-multiplied items stay at base
    }
  }

  // Add modular upgrade
  subtotal += calcModularUpgradeCost(inputs);

  return subtotal;
}

// -------------------------------------------------------------------
// Calculate zone total: (discount × subtotal) × 1.03 + extraCosts
// -------------------------------------------------------------------
function calcZoneTotal(inputs: ZoneInputs, tier: 'premiumRgb' | 'premium' | 'essential'): number {
  const subtotal = calcSubtotal(inputs, tier);
  const discount = 1 - (inputs.discount || 0); // discount is 0-1
  const extraCosts = inputs.extraCosts || 0;
  return (discount * subtotal) * MARKUP + extraCosts;
}

// -------------------------------------------------------------------
// Calculate full zone result
// -------------------------------------------------------------------
export function calcZone(inputs: ZoneInputs): ZoneResult {
  const subtotalPremiumRgb = calcSubtotal(inputs, 'premiumRgb');
  const subtotalPremium = calcSubtotal(inputs, 'premium');
  const subtotalEssential = calcSubtotal(inputs, 'essential');

  const premiumRgb = calcZoneTotal(inputs, 'premiumRgb');
  const premium = calcZoneTotal(inputs, 'premium');
  const essential = calcZoneTotal(inputs, 'essential');

  const fixtureCount = calcFixtureCount(inputs);
  const protectionPlan = fixtureCount * PROTECTION_PLAN_PER_FIXTURE * MARKUP;

  return {
    premiumRgb,
    premium,
    essential,
    subtotalPremiumRgb,
    subtotalPremium,
    subtotalEssential,
    financingPremiumRgb: premiumRgb / FINANCING_MONTHS,
    financingPremium: premium / FINANCING_MONTHS,
    financingEssential: essential / FINANCING_MONTHS,
    fixtureCount,
    protectionPlan,
  };
}

// -------------------------------------------------------------------
// Calculate audio totals
// -------------------------------------------------------------------
export function calcAudio(inputs: AudioInputs): AudioResult {
  let subtotal = 0;
  for (const product of AUDIO_PRODUCTS) {
    if (product.key === 'audioExtraCosts') continue;
    const qty = inputs[product.key] || 0;
    subtotal += qty * product.price;
  }

  const extraCosts = inputs.audioExtraCosts || 0;
  const discount = 1 - (inputs.audioDiscount || 0);
  const total = (discount * subtotal) * MARKUP + extraCosts;
  const financing = total / FINANCING_MONTHS;

  return { subtotal, total, financing };
}

// -------------------------------------------------------------------
// Calculate grand totals across all zones
// -------------------------------------------------------------------
export function calcGrandTotals(zones: ZoneResult[], audio: AudioResult) {
  const totalFixtures = zones.reduce((sum, z) => sum + z.fixtureCount, 0);
  const totalProtectionPlan = totalFixtures * PROTECTION_PLAN_PER_FIXTURE * MARKUP;

  return {
    premiumRgb: zones.reduce((sum, z) => sum + z.premiumRgb, 0) + audio.total,
    premium: zones.reduce((sum, z) => sum + z.premium, 0) + audio.total,
    essential: zones.reduce((sum, z) => sum + z.essential, 0) + audio.total,
    totalFixtures,
    totalProtectionPlan,
    audioTotal: audio.total,
  };
}

// -------------------------------------------------------------------
// Format currency
// -------------------------------------------------------------------
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}
