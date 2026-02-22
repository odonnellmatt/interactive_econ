/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import EconGraph from './components/EconGraph';
import Controls from './components/Controls';
import Explanation from './components/Explanation';
import Glossary from './components/Glossary';
import { LineChart, ArrowDownUp, ShieldAlert, Globe, Percent, Scale, Eye, EyeOff, BookOpen } from 'lucide-react';

export type ModelType = 'standard' | 'ceiling' | 'floor' | 'tax' | 'world' | 'elasticity' | 'glossary';

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
  baseP: 50,
  baseQ: 50,
  shiftD: 0,
  shiftS: 0,
  slopeD: -1,
  slopeS: 0.8,
  priceCeiling: 40,
  priceFloor: 65,
  tax: 20,
  worldPrice: 30,
  tariff: 0,
  showWelfare: false,
};

const models = [
  { id: 'standard', name: 'Shifts', icon: ArrowDownUp },
  { id: 'ceiling', name: 'Price Ceiling', icon: ShieldAlert },
  { id: 'floor', name: 'Price Floor', icon: ShieldAlert },
  { id: 'tax', name: 'Taxes', icon: Scale },
  { id: 'world', name: 'World Trade', icon: Globe },
  { id: 'elasticity', name: 'Elasticity', icon: Percent },
  { id: 'glossary', name: 'Glossary', icon: BookOpen },
] as const;

export default function App() {
  const [state, setState] = useState<AppState>(defaultState);

  return (
    <div className="min-h-screen bg-[#F5F3EE] text-[#111111] font-sans selection:bg-indigo-100">
      {/* Header */}
      <header className="bg-[#E8E4DD] border-b border-gray-300 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-[#E63B2E] p-2 rounded-lg shadow-sm">
              <LineChart className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight font-sans">EconPlayground</h1>
          </div>
          <div className="text-sm font-mono text-gray-600 hidden sm:block">
            Interactive Microeconomics Models
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Model Selector */}
        <div className="flex overflow-x-auto pb-3 mb-4 gap-2 hide-scrollbar">
          {models.map((m) => {
            const Icon = m.icon;
            const isActive = state.model === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setState({ ...defaultState, model: m.id as ModelType })}
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

        {state.model === 'glossary' ? (
          <Glossary />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Graph Area */}
            <div className="lg:col-span-7 xl:col-span-8">
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
            <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-5">
              <Controls state={state} setState={setState} />
              <Explanation state={state} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
