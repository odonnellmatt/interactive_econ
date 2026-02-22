import React from 'react';
import { AppState } from '../App';
import { getGraphData, getQD, getQS } from '../utils/econMath';

interface ExplanationProps {
  state: AppState;
}

const Explanation: React.FC<ExplanationProps> = ({ state }) => {
  const data = getGraphData(state);
  const { model, showWelfare } = state;
  const hasTax = (model === 'tax' || model === 'elasticity') && state.tax > 0;

  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200">
      <h3 className="text-lg font-bold mb-4 text-gray-900 tracking-tight">Economic Analysis</h3>

      <div className="space-y-4 text-gray-700 leading-relaxed">
        {/* Equilibrium display: free-market + intervention outcome */}
        <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 space-y-1">
          {state.shiftD !== 0 || state.shiftS !== 0 ? (
            <>
              <p className="text-sm">
                <strong className="text-gray-900">Base Equilibrium:</strong>{' '}
                P₁ = <span className="font-mono font-bold text-gray-500">${data.baseEq.Peq.toFixed(1)}</span>,{' '}
                Q₁ = <span className="font-mono font-bold text-gray-500">{data.baseEq.Qeq.toFixed(1)}</span>
              </p>
              <p className="text-sm">
                <strong className="text-gray-900">New Free-Market Equilibrium:</strong>{' '}
                P₂ = <span className="font-mono font-bold text-indigo-600">${data.freeMarketEq.Peq.toFixed(1)}</span>,{' '}
                Q₂ = <span className="font-mono font-bold text-indigo-600">{data.freeMarketEq.Qeq.toFixed(1)}</span>
              </p>
            </>
          ) : (
            <p className="text-sm">
              <strong className="text-gray-900">Free-Market Equilibrium:</strong>{' '}
              P = <span className="font-mono font-bold text-indigo-600">${data.freeMarketEq.Peq.toFixed(1)}</span>,{' '}
              Q = <span className="font-mono font-bold text-indigo-600">{data.freeMarketEq.Qeq.toFixed(1)}</span>
            </p>
          )}
          {(Math.abs(data.P_C - data.freeMarketEq.Peq) > 0.5 || Math.abs(data.Q_traded - data.freeMarketEq.Qeq) > 0.5) && (
            <p className="text-sm pt-2 mt-2 border-t border-gray-200">
              <strong className="text-gray-900">Market Outcome:</strong>{' '}
              P = <span className="font-mono font-bold text-indigo-600">${data.P_C.toFixed(1)}</span>,{' '}
              Q = <span className="font-mono font-bold text-indigo-600">{data.Q_traded.toFixed(1)}</span>
              {hasTax && (
                <span className="text-gray-500"> (Producers receive <span className="font-mono font-bold text-red-600">${data.P_P.toFixed(1)}</span>)</span>
              )}
            </p>
          )}
        </div>

        {model === 'standard' && (
          <div className="space-y-3 text-sm">
            {state.shiftD > 0 && <p>An <strong className="text-gray-900">increase in demand</strong> shifts the demand curve to the right. Consumers are willing to buy more at every price. The <strong className="text-gray-900">equilibrium price increases</strong> from <span className="font-mono font-bold text-gray-500">${data.baseEq.Peq.toFixed(1)}</span> to <span className="font-mono font-bold text-indigo-600">${data.freeMarketEq.Peq.toFixed(1)}</span>, and the <strong className="text-gray-900">equilibrium quantity increases</strong> from <span className="font-mono font-bold text-gray-500">{data.baseEq.Qeq.toFixed(1)}</span> to <span className="font-mono font-bold text-indigo-600">{data.freeMarketEq.Qeq.toFixed(1)}</span>.</p>}
            {state.shiftD < 0 && <p>A <strong className="text-gray-900">decrease in demand</strong> shifts the demand curve to the left. Consumers want to buy less at every price. The <strong className="text-gray-900">equilibrium price decreases</strong> from <span className="font-mono font-bold text-gray-500">${data.baseEq.Peq.toFixed(1)}</span> to <span className="font-mono font-bold text-indigo-600">${data.freeMarketEq.Peq.toFixed(1)}</span>, and the <strong className="text-gray-900">equilibrium quantity decreases</strong> from <span className="font-mono font-bold text-gray-500">{data.baseEq.Qeq.toFixed(1)}</span> to <span className="font-mono font-bold text-indigo-600">{data.freeMarketEq.Qeq.toFixed(1)}</span>.</p>}
            {state.shiftS > 0 && <p>An <strong className="text-gray-900">increase in supply</strong> shifts the supply curve to the right. Producers are willing to sell more at every price. The <strong className="text-gray-900">equilibrium price decreases</strong> from <span className="font-mono font-bold text-gray-500">${data.baseEq.Peq.toFixed(1)}</span> to <span className="font-mono font-bold text-indigo-600">${data.freeMarketEq.Peq.toFixed(1)}</span>, and the <strong className="text-gray-900">equilibrium quantity increases</strong> from <span className="font-mono font-bold text-gray-500">{data.baseEq.Qeq.toFixed(1)}</span> to <span className="font-mono font-bold text-indigo-600">{data.freeMarketEq.Qeq.toFixed(1)}</span>.</p>}
            {state.shiftS < 0 && <p>A <strong className="text-gray-900">decrease in supply</strong> shifts the supply curve to the left. Producers are willing to sell less at every price. The <strong className="text-gray-900">equilibrium price increases</strong> from <span className="font-mono font-bold text-gray-500">${data.baseEq.Peq.toFixed(1)}</span> to <span className="font-mono font-bold text-indigo-600">${data.freeMarketEq.Peq.toFixed(1)}</span>, and the <strong className="text-gray-900">equilibrium quantity decreases</strong> from <span className="font-mono font-bold text-gray-500">{data.baseEq.Qeq.toFixed(1)}</span> to <span className="font-mono font-bold text-indigo-600">{data.freeMarketEq.Qeq.toFixed(1)}</span>.</p>}
            {state.shiftD === 0 && state.shiftS === 0 && <p>Use the sliders to shift the demand or supply curves and observe how the equilibrium price and quantity change.</p>}
          </div>
        )}

        {model === 'ceiling' && (
          <div className="space-y-3 text-sm">
            <p>A <strong className="text-gray-900">Price Ceiling</strong> is a legal maximum price. It is currently set at <span className="font-mono font-bold">${state.priceCeiling}</span>.</p>
            {state.priceCeiling < data.freeMarketEq.Peq ? (
              <p className="text-red-700 bg-red-50 p-3 rounded-lg border border-red-100">
                Because the ceiling is below the equilibrium price, it is <em>binding</em>. This creates a <strong className="font-bold">shortage</strong> of {data.shortage.toFixed(1)} units
                {' '}(Qd = {getQD(state.priceCeiling, state.shiftD, state.slopeD).toFixed(1)}, Qs = {getQS(state.priceCeiling, state.shiftS, state.slopeS).toFixed(1)}),
                as quantity demanded exceeds quantity supplied. A deadweight loss occurs due to mutually beneficial trades being blocked.
              </p>
            ) : (
              <p className="text-emerald-700 bg-emerald-50 p-3 rounded-lg border border-emerald-100">Because the ceiling is above the equilibrium price, it is <em>non-binding</em> and has no effect on the market.</p>
            )}
          </div>
        )}

        {model === 'floor' && (
          <div className="space-y-3 text-sm">
            <p>A <strong className="text-gray-900">Price Floor</strong> is a legal minimum price. It is currently set at <span className="font-mono font-bold">${state.priceFloor}</span>.</p>
            {state.priceFloor > data.freeMarketEq.Peq ? (
              <p className="text-red-700 bg-red-50 p-3 rounded-lg border border-red-100">
                Because the floor is above the equilibrium price, it is <em>binding</em>. This creates a <strong className="font-bold">surplus</strong> of {data.surplus.toFixed(1)} units
                {' '}(Qd = {getQD(state.priceFloor, state.shiftD, state.slopeD).toFixed(1)}, Qs = {getQS(state.priceFloor, state.shiftS, state.slopeS).toFixed(1)}),
                as quantity supplied exceeds quantity demanded. A deadweight loss occurs.
              </p>
            ) : (
              <p className="text-emerald-700 bg-emerald-50 p-3 rounded-lg border border-emerald-100">Because the floor is below the equilibrium price, it is <em>non-binding</em> and has no effect on the market.</p>
            )}
          </div>
        )}

        {model === 'tax' && state.tax > 0 && (
          <div className="space-y-3 text-sm">
            <p>A <strong className="text-gray-900">per-unit tax</strong> of <span className="font-mono font-bold">${state.tax}</span> is imposed on sellers, shifting the supply curve up by the amount of the tax.</p>
            <ul className="list-disc pl-5 space-y-1 text-gray-600">
              <li>Consumers pay: <span className="font-mono font-bold text-gray-900">${data.P_C.toFixed(1)}</span></li>
              <li>Producers receive: <span className="font-mono font-bold text-gray-900">${data.P_P.toFixed(1)}</span></li>
              <li>Quantity traded falls to: <span className="font-mono font-bold text-gray-900">{data.Q_traded.toFixed(1)}</span></li>
            </ul>
            <p>The government collects tax revenue (green area), but the market suffers a deadweight loss (gray area) due to reduced trade.</p>
          </div>
        )}
        {model === 'tax' && state.tax === 0 && (
          <p className="text-sm">Use the slider to impose a per-unit tax and observe the tax wedge, tax revenue, and deadweight loss.</p>
        )}

        {model === 'world' && (
          <div className="space-y-3 text-sm">
            <p>The <strong className="text-gray-900">World Price</strong> is <span className="font-mono font-bold">${state.worldPrice}</span>.</p>
            {state.worldPrice < data.freeMarketEq.Peq ? (
              <>
                <p>Since the world price is below the domestic equilibrium, this country will <strong className="text-gray-900">import</strong> the good.</p>
                {state.tariff > 0 ? (
                  <p className="text-purple-800 bg-purple-50 p-3 rounded-lg border border-purple-100">A <strong className="font-bold">tariff</strong> of <span className="font-mono font-bold">${state.tariff}</span> raises the domestic price to <span className="font-mono font-bold">${(state.worldPrice + state.tariff).toFixed(1)}</span>. This reduces imports to {data.imports.toFixed(1)} units, generates tariff revenue (purple area), and creates deadweight loss (gray triangles) compared to free trade.</p>
                ) : (
                  <p className="text-blue-800 bg-blue-50 p-3 rounded-lg border border-blue-100">Under free trade, the country imports {data.imports.toFixed(1)} units. Consumer surplus is maximized.</p>
                )}
              </>
            ) : (
              <p className="text-emerald-700 bg-emerald-50 p-3 rounded-lg border border-emerald-100">Since the world price is above the domestic equilibrium, this country has a comparative advantage and will <strong className="font-bold">export</strong> the good.</p>
            )}
          </div>
        )}

        {model === 'elasticity' && (
          <div className="space-y-3 text-sm">
            <p><strong className="text-gray-900">Elasticity</strong> measures how responsive quantity is to a change in price.</p>
            <p>A steeper curve (slope further from 0) is more <em>inelastic</em> (less responsive). A flatter curve (slope closer to 0) is more <em>elastic</em> (more responsive).</p>
            {state.tax > 0 ? (
              <>
                <p>A <strong className="text-gray-900">per-unit tax</strong> of <span className="font-mono font-bold">${state.tax}</span> creates a tax wedge between what consumers pay and producers receive.</p>
                <ul className="list-disc pl-5 space-y-1 text-gray-600">
                  <li>Consumers pay: <span className="font-mono font-bold text-gray-900">${data.P_C.toFixed(1)}</span></li>
                  <li>Producers receive: <span className="font-mono font-bold text-gray-900">${data.P_P.toFixed(1)}</span></li>
                </ul>
                {(() => {
                  const consumerBurden = data.P_C - data.freeMarketEq.Peq;
                  const producerBurden = data.freeMarketEq.Peq - data.P_P;
                  const consumerPct = (consumerBurden / state.tax) * 100;
                  const producerPct = (producerBurden / state.tax) * 100;
                  const demandMoreInelastic = Math.abs(state.slopeD) > Math.abs(state.slopeS);
                  return (
                    <div className="bg-indigo-50 text-indigo-800 p-3 rounded-lg border border-indigo-100 space-y-2">
                      <p><strong>Tax Incidence:</strong> Consumers bear <span className="font-mono font-bold">{consumerPct.toFixed(0)}%</span> of the tax ($<span className="font-mono">{consumerBurden.toFixed(1)}</span>), producers bear <span className="font-mono font-bold">{producerPct.toFixed(0)}%</span> ($<span className="font-mono">{producerBurden.toFixed(1)}</span>).</p>
                      <p className="text-xs">
                        {demandMoreInelastic
                          ? 'Demand is more inelastic (steeper), so consumers bear a larger share of the tax. The side that is less able to adjust bears more of the burden.'
                          : 'Supply is more inelastic (steeper), so producers bear a larger share of the tax. The side that is less able to adjust bears more of the burden.'}
                      </p>
                    </div>
                  );
                })()}
              </>
            ) : (
              <p className="bg-indigo-50 text-indigo-800 p-3 rounded-lg border border-indigo-100">Try shifting demand or supply while changing the slopes to see how elasticity affects the magnitude of price and quantity changes. Add a tax to explore how elasticity determines tax incidence!</p>
            )}
          </div>
        )}

        {/* Welfare values — only when toggle is on */}
        {showWelfare && (
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
            <p className="text-sm font-bold text-gray-900 mb-3">Welfare Analysis</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>Consumer Surplus: <span className="font-mono font-bold text-blue-600">{data.CS.toFixed(1)}</span></div>
              <div>Producer Surplus: <span className="font-mono font-bold text-red-600">{data.PS.toFixed(1)}</span></div>
              {data.DWL > 0 && <div>Deadweight Loss: <span className="font-mono font-bold text-gray-600">{data.DWL.toFixed(1)}</span></div>}
              {data.taxRevenue > 0 && <div>Tax Revenue: <span className="font-mono font-bold text-green-600">{data.taxRevenue.toFixed(1)}</span></div>}
              {data.tariffRevenue > 0 && <div>Tariff Revenue: <span className="font-mono font-bold text-purple-600">{data.tariffRevenue.toFixed(1)}</span></div>}
              <div className="col-span-2 pt-2 border-t border-gray-200 mt-1">
                Total Surplus: <span className="font-mono font-bold text-indigo-600">{(data.CS + data.PS + data.taxRevenue + data.tariffRevenue).toFixed(1)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Welfare legend — only when toggle is on */}
        {showWelfare && (
          <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-2 gap-3 text-xs font-medium text-gray-600">
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-500/20 border border-blue-500/30 rounded-sm"></div> Consumer Surplus</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-red-500/20 border border-red-500/30 rounded-sm"></div> Producer Surplus</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-gray-500/30 border border-gray-500/40 rounded-sm"></div> Deadweight Loss</div>
            {(model === 'tax' || (model === 'elasticity' && state.tax > 0)) && <div className="flex items-center gap-2"><div className="w-3 h-3 bg-green-500/30 border border-green-500/40 rounded-sm"></div> Tax Revenue</div>}
            {model === 'world' && <div className="flex items-center gap-2"><div className="w-3 h-3 bg-purple-500/30 border border-purple-500/40 rounded-sm"></div> Tariff Revenue</div>}
          </div>
        )}
      </div>
    </div>
  );
};

export default Explanation;
