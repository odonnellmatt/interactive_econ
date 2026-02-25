/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import EconGraph from './components/EconGraph';
import Controls from './components/Controls';
import Explanation from './components/Explanation';
import Glossary from './components/Glossary';
import IFrameCodes from './components/IFrameCodes';
import { LineChart, ArrowDownUp, ShieldAlert, Globe, Percent, Scale, Eye, EyeOff, BookOpen, Code } from 'lucide-react';

export type ModelType = 'standard' | 'ceiling' | 'floor' | 'tax' | 'world' | 'elasticity' | 'glossary' | 'iframes';

export interface AppState {
  model: ModelType;
  baseP: number;
  baseQ: number;
  shiftD: number;
  shiftS: number;
  slopeD: number;
  slopeS: number;
  priceCeiling: number;
  priceFloor: number;
  tax: number;
  worldPrice: number;
  tariff: number;
  showWelfare: boolean;
}

const defaultState: AppState = {
  model: 'standard',
  baseP: 55,
  baseQ: 50,
  shiftD: 0,
  shiftS: 0,
  slopeD: -1,
  slopeS: 1,
  priceCeiling: 40,
  priceFloor: 65,
  tax: 20,
  worldPrice: 30,
  tariff: 0,
  showWelfare: false,
};

/** Per-module state overrides applied on top of defaultState. */
const modelOverrides: Partial<Record<ModelType, Partial<AppState>>> = {
  elasticity: { tax: 0 },
};

/** Build the initial state for a given model (applies overrides). */
const buildStateForModel = (model: ModelType): AppState => ({
  ...defaultState,
  model,
  ...(modelOverrides[model] ?? {}),
});

const modelTitles: Record<string, string> = {
  standard: 'Supply & Demand Shifts',
  ceiling: 'Price Ceiling',
  floor: 'Price Floor',
  tax: 'Taxes & Tax Incidence',
  world: 'World Price & Trade',
  elasticity: 'Elasticity',
  glossary: 'Glossary',
};

const validEmbedModels = new Set(['standard', 'ceiling', 'floor', 'tax', 'world', 'elasticity', 'glossary']);

const navModels = [
  { id: 'standard', name: 'Shifts', icon: ArrowDownUp },
  { id: 'ceiling', name: 'Price Ceiling', icon: ShieldAlert },
  { id: 'floor', name: 'Price Floor', icon: ShieldAlert },
  { id: 'tax', name: 'Taxes', icon: Scale },
  { id: 'world', name: 'World Trade', icon: Globe },
  { id: 'elasticity', name: 'Elasticity', icon: Percent },
  { id: 'glossary', name: 'Glossary', icon: BookOpen },
  { id: 'iframes', name: 'iFrame Codes', icon: Code },
] as const;

/** Non-interactive models that don't need the graph/controls layout. */
const staticModels = new Set<ModelType>(['glossary', 'iframes']);

export default function App() {
  const urlModel = (() => {
    const param = new URLSearchParams(window.location.search).get('model');
    return param && validEmbedModels.has(param) ? (param as ModelType) : null;
  })();

  const isEmbedded = urlModel !== null;

  const [state, setState] = useState<AppState>(
    urlModel ? buildStateForModel(urlModel) : defaultState
  );

  // Keep model locked to URL param when embedded.
  useEffect(() => {
    if (urlModel) setState(prev => ({ ...prev, model: urlModel }));
  }, [urlModel]);

  const handleTabClick = (modelId: ModelType) => {
    setState(buildStateForModel(modelId));
  };

  const isGraphModel = !staticModels.has(state.model);

  return (
    <div className="min-h-screen bg-[#F5F3EE] text-[#111111] font-sans selection:bg-indigo-100">
      {/* Header */}
      <header className="bg-[#E8E4DD] border-b border-gray-300 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-[#E63B2E] p-2 rounded-lg shadow-sm">
              <LineChart className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight font-sans">
              {isEmbedded ? modelTitles[urlModel] : 'EconPlayground'}
            </h1>
          </div>
          <div className="text-sm font-mono text-gray-600 hidden sm:block">
            Interactive Microeconomics
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Tab nav — hidden when embedded */}
        {!isEmbedded && (
          <div className="flex overflow-x-auto pb-3 mb-4 gap-2 hide-scrollbar">
            {navModels.map((m) => {
              const Icon = m.icon;
              const isActive = state.model === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => handleTabClick(m.id as ModelType)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${isActive
                    ? 'bg-[#111111] text-white shadow-md scale-105'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-gray-300'
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  {m.name}
                </button>
              );
            })}
          </div>
        )}

        {/* Static pages */}
        {state.model === 'glossary' && <Glossary />}
        {state.model === 'iframes' && <IFrameCodes />}

        {/* Interactive graph layout */}
        {isGraphModel && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Graph */}
            <div className="md:col-span-7 xl:col-span-8">
              <div className="sticky top-16">
                <div className="flex justify-end mb-2">
                  <button
                    onClick={() => setState(prev => ({ ...prev, showWelfare: !prev.showWelfare }))}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${state.showWelfare
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
                      }`}
                  >
                    {state.showWelfare ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    Welfare Areas
                  </button>
                </div>
                <EconGraph state={state} setState={setState} />
              </div>
            </div>

            {/* Controls & Explanation */}
            <div className="md:col-span-5 xl:col-span-4 flex flex-col gap-4">
              <Controls state={state} setState={setState} />
              <Explanation state={state} />
              {/* Glossary link in embedded mode */}
              {isEmbedded && (
                <a
                  href="?model=glossary"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all"
                >
                  <BookOpen className="w-4 h-4" />
                  Key Terms &amp; Glossary ↗
                </a>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
