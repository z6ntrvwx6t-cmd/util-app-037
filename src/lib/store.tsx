import React, { createContext, useContext, useReducer } from 'react';
import type { ZoneInputs, AudioInputs } from './calc';

// -------------------------------------------------------------------
// State shape
// -------------------------------------------------------------------
export interface AppState {
  zones: ZoneInputs[];
  audio: AudioInputs;
  activeZone: number;
  activeTab: 'calculator' | 'results' | 'audio' | 'protection';
  customerInfo: {
    name: string;
    address: string;
    phone: string;
    email: string;
    contact: string;
    contactPhone: string;
  };
}

const NUM_ZONES = 4;

function emptyZone(): ZoneInputs {
  return {
    fixtures: 0,
    peakLights: 0,
    transformers: 0,
    stripLighting: 0,
    bistroLighting: 0,
    metalStakes: 0,
    extraCosts: 0,
    moonLights: 0,
    transformer300: 0,
    transformer600: 0,
    smartTransformer: 0,
    modularUpgrade: 0,
    discount: 0,
  };
}

function emptyAudio(): AudioInputs {
  return {
    ultrascapePro: 0,
    leaConnect4: 0,
    leaConnect6: 0,
    vssl: 0,
    sonosPort: 0,
    sonosAmp: 0,
    additionalSpeakers: 0,
    inGroundSub: 0,
    hardscapeSub: 0,
    audioExtraCosts: 0,
    audioDiscount: 0,
  };
}

const initialState: AppState = {
  zones: Array.from({ length: NUM_ZONES }, emptyZone),
  audio: emptyAudio(),
  activeZone: 0,
  activeTab: 'calculator',
  customerInfo: { name: '', address: '', phone: '', email: '', contact: '', contactPhone: '' },
};

// -------------------------------------------------------------------
// Actions
// -------------------------------------------------------------------
type Action =
  | { type: 'SET_ZONE_INPUT'; zone: number; key: string; value: number }
  | { type: 'SET_AUDIO_INPUT'; key: string; value: number }
  | { type: 'SET_ACTIVE_ZONE'; zone: number }
  | { type: 'SET_ACTIVE_TAB'; tab: AppState['activeTab'] }
  | { type: 'SET_CUSTOMER_INFO'; field: string; value: string }
  | { type: 'RESET_ALL' };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_ZONE_INPUT': {
      const zones = [...state.zones];
      zones[action.zone] = { ...zones[action.zone], [action.key]: action.value };
      return { ...state, zones };
    }
    case 'SET_AUDIO_INPUT':
      return { ...state, audio: { ...state.audio, [action.key]: action.value } };
    case 'SET_ACTIVE_ZONE':
      return { ...state, activeZone: action.zone };
    case 'SET_ACTIVE_TAB':
      return { ...state, activeTab: action.tab };
    case 'SET_CUSTOMER_INFO':
      return { ...state, customerInfo: { ...state.customerInfo, [action.field]: action.value } };
    case 'RESET_ALL':
      return initialState;
    default:
      return state;
  }
}

// -------------------------------------------------------------------
// Context
// -------------------------------------------------------------------
const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<Action>;
} | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
