import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { AppState } from '../App';
import { getPD, getPS, getGraphData, getQD, getQS } from '../utils/econMath';

interface EconGraphProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}

const EconGraph: React.FC<EconGraphProps> = ({ state, setState }) => {
  const { model, baseP, baseQ, shiftD, shiftS, slopeD, slopeS, priceCeiling, priceFloor, tax, worldPrice, tariff, showWelfare } = state;
  const data = getGraphData(state);

  const mapX = (q: number) => 50 + (q / 100) * 400;
  const mapY = (p: number) => 450 - (p / 100) * 400;

  const dX1 = 0, dY1 = getPD(0, shiftD, slopeD, baseP, baseQ);
  const dX2 = 100, dY2 = getPD(100, shiftD, slopeD, baseP, baseQ);

  const sX1 = 0, sY1 = getPS(0, shiftS, slopeS, baseP, baseQ);
  const sX2 = 100, sY2 = getPS(100, shiftS, slopeS, baseP, baseQ);

  const showTaxCurve = (model === 'tax' || model === 'elasticity') && tax > 0;
  const stX1 = 0, stY1 = sY1 + tax;
  const stX2 = 100, stY2 = sY2 + tax;

  // CS polygon
  const csPoints = `
    ${mapX(0)},${mapY(data.P_C)}
    ${mapX(data.Q_traded)},${mapY(data.P_C)}
    ${mapX(data.Q_traded)},${mapY(getPD(data.Q_traded, shiftD, slopeD, baseP, baseQ))}
    ${mapX(0)},${mapY(getPD(0, shiftD, slopeD, baseP, baseQ))}
  `;

  // PS polygon
  let psPoints = `
    ${mapX(0)},${mapY(data.P_P)}
    ${mapX(data.Q_traded)},${mapY(data.P_P)}
    ${mapX(data.Q_traded)},${mapY(getPS(data.Q_traded, shiftS, slopeS, baseP, baseQ))}
    ${mapX(0)},${mapY(getPS(0, shiftS, slopeS, baseP, baseQ))}
  `;

  if (model === 'world') {
    const qS = getQS(data.P_P, shiftS, slopeS, baseP, baseQ);
    psPoints = `
      ${mapX(0)},${mapY(data.P_P)}
      ${mapX(qS)},${mapY(data.P_P)}
      ${mapX(qS)},${mapY(getPS(qS, shiftS, slopeS, baseP, baseQ))}
      ${mapX(0)},${mapY(getPS(0, shiftS, slopeS, baseP, baseQ))}
    `;
  }

  // DWL polygon(s)
  let dwlPoints = '';
  let dwlPoints2 = '';
  if (model === 'world' && tariff > 0 && data.imports > 0) {
    const qS_free = getQS(worldPrice, shiftS, slopeS, baseP, baseQ);
    const qS_tariff = getQS(data.P_C, shiftS, slopeS, baseP, baseQ);
    const qD_free = getQD(worldPrice, shiftD, slopeD, baseP, baseQ);
    const qD_tariff = getQD(data.P_C, shiftD, slopeD, baseP, baseQ);

    dwlPoints = `
      ${mapX(qS_free)},${mapY(worldPrice)}
      ${mapX(qS_tariff)},${mapY(worldPrice)}
      ${mapX(qS_tariff)},${mapY(data.P_C)}
    `;
    dwlPoints2 = `
      ${mapX(qD_tariff)},${mapY(data.P_C)}
      ${mapX(qD_tariff)},${mapY(worldPrice)}
      ${mapX(qD_free)},${mapY(worldPrice)}
    `;
  } else if (data.Q_traded < data.freeMarketEq.Qeq) {
    dwlPoints = `
      ${mapX(data.Q_traded)},${mapY(getPD(data.Q_traded, shiftD, slopeD, baseP, baseQ))}
      ${mapX(data.freeMarketEq.Qeq)},${mapY(data.freeMarketEq.Peq)}
      ${mapX(data.Q_traded)},${mapY(getPS(data.Q_traded, shiftS, slopeS, baseP, baseQ))}
    `;
  }

  // Tax Revenue polygon
  let taxRevPoints = '';
  if ((model === 'tax' || model === 'elasticity') && tax > 0) {
    taxRevPoints = `
      ${mapX(0)},${mapY(data.P_C)}
      ${mapX(data.Q_traded)},${mapY(data.P_C)}
      ${mapX(data.Q_traded)},${mapY(data.P_P)}
      ${mapX(0)},${mapY(data.P_P)}
    `;
  }

  // Tariff Revenue polygon
  let tariffRevPoints = '';
  if (model === 'world' && tariff > 0 && data.imports > 0) {
    const qS = getQS(data.P_C, shiftS, slopeS, baseP, baseQ);
    const qD = getQD(data.P_C, shiftD, slopeD, baseP, baseQ);
    tariffRevPoints = `
      ${mapX(qS)},${mapY(data.P_C)}
      ${mapX(qD)},${mapY(data.P_C)}
      ${mapX(qD)},${mapY(worldPrice)}
      ${mapX(qS)},${mapY(worldPrice)}
    `;
  }

  // Phase 5: Axis indicators
  const P1 = data.baseEq.Peq;
  const Q1 = data.baseEq.Qeq;
  let P2: number | null = null;
  let Q2: number | null = null;
  let Pp: number | null = null; // producer price for tax

  const hasIntervention = model === 'ceiling' || model === 'floor' ||
    (model === 'tax' && tax > 0) || (model === 'elasticity' && tax > 0) ||
    (model === 'world' && worldPrice + tariff !== data.freeMarketEq.Peq) ||
    shiftD !== 0 || shiftS !== 0;

  if (hasIntervention) {
    if (Math.abs(data.P_C - P1) > 1) P2 = data.P_C;
    if (Math.abs(data.Q_traded - Q1) > 1) Q2 = data.Q_traded;
    if ((model === 'tax' || model === 'elasticity') && tax > 0 && Math.abs(data.P_P - P1) > 1) {
      Pp = data.P_P;
    }
  }

  // Anti-overlap: check if P labels are too close
  const pLabelTooClose = (a: number, b: number) => Math.abs(mapY(a) - mapY(b)) < 16;

  // Clamp helper for label Y positions
  const clampY = (y: number) => Math.max(55, Math.min(445, y));

  // Shortage/surplus data for Phase 6
  const isBindingCeiling = model === 'ceiling' && priceCeiling < data.freeMarketEq.Peq;
  const isBindingFloor = model === 'floor' && priceFloor > data.freeMarketEq.Peq;

  let shortageQs = 0, shortageQd = 0;
  if (isBindingCeiling) {
    shortageQs = getQS(priceCeiling, shiftS, slopeS, baseP, baseQ);
    shortageQd = getQD(priceCeiling, shiftD, slopeD, baseP, baseQ);
  }

  let surplusQd = 0, surplusQs = 0;
  if (isBindingFloor) {
    surplusQd = getQD(priceFloor, shiftD, slopeD, baseP, baseQ);
    surplusQs = getQS(priceFloor, shiftS, slopeS, baseP, baseQ);
  }

  // --- DRAG LOGIC ---
  const svgRef = useRef<SVGSVGElement>(null);
  const [draggingTarget, setDraggingTarget] = useState<'D' | 'S' | 'C' | 'F' | 'W' | 'T' | null>(null);
  const [dragStart, setDragStart] = useState<{ x: number, y: number, initialValue: number } | null>(null);

  const getSvgCoordinates = useCallback((e: React.PointerEvent | PointerEvent) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const CTM = svgRef.current.getScreenCTM();
    if (!CTM) return { x: 0, y: 0 };
    return {
      x: (e.clientX - CTM.e) / CTM.a,
      y: (e.clientY - CTM.f) / CTM.d
    };
  }, []);

  const handlePointerDown = (e: React.PointerEvent, target: 'D' | 'S' | 'C' | 'F' | 'W' | 'T') => {
    e.currentTarget.setPointerCapture(e.pointerId);

    const coords = getSvgCoordinates(e);
    setDraggingTarget(target);

    let initialValue = 0;
    if (target === 'D') initialValue = shiftD;
    else if (target === 'S') initialValue = shiftS;
    else if (target === 'C') initialValue = priceCeiling;
    else if (target === 'F') initialValue = priceFloor;
    else if (target === 'W') initialValue = worldPrice;
    else if (target === 'T') initialValue = tax;

    setDragStart({
      x: coords.x,
      y: coords.y,
      initialValue
    });
  };

  const handlePointerMove = useCallback((e: PointerEvent) => {
    if (!draggingTarget || !dragStart) return;

    const currentCoords = getSvgCoordinates(e);
    const dx = (currentCoords.x - dragStart.x) * 0.25;
    const dy = (currentCoords.y - dragStart.y) * -0.25;

    if (draggingTarget === 'C') {
      let newPrice = dragStart.initialValue + dy;
      newPrice = Math.max(10, Math.min(90, newPrice));
      setState(prev => ({ ...prev, priceCeiling: Math.round(newPrice) }));
      return;
    }
    if (draggingTarget === 'F') {
      let newPrice = dragStart.initialValue + dy;
      newPrice = Math.max(10, Math.min(90, newPrice));
      setState(prev => ({ ...prev, priceFloor: Math.round(newPrice) }));
      return;
    }
    if (draggingTarget === 'W') {
      let newWP = dragStart.initialValue + dy;
      newWP = Math.max(10, Math.min(90, newWP));
      setState(prev => ({ ...prev, worldPrice: Math.round(newWP) }));
      return;
    }
    if (draggingTarget === 'T') {
      let newTax = dragStart.initialValue + dy;
      newTax = Math.max(0, Math.min(40, newTax));
      setState(prev => ({ ...prev, tax: Math.round(newTax) }));
      return;
    }

    let newShift = dragStart.initialValue;

    if (draggingTarget === 'D') {
      newShift = dragStart.initialValue + dx - (dy / slopeD);
    } else if (draggingTarget === 'S') {
      newShift = dragStart.initialValue + dx - (dy / slopeS);
    }

    // Clamp shift to a reasonable range e.g. -40 to +40 matches Controls.tsx
    newShift = Math.max(-40, Math.min(40, newShift));

    setState(prev => ({
      ...prev,
      [draggingTarget === 'D' ? 'shiftD' : 'shiftS']: Math.round(newShift)
    }));

  }, [draggingTarget, dragStart, getSvgCoordinates, slopeD, slopeS, setState]);

  const handlePointerUp = useCallback((e: PointerEvent) => {
    if (draggingTarget) {
      setDraggingTarget(null);
      setDragStart(null);
    }
  }, [draggingTarget]);

  useEffect(() => {
    if (draggingTarget) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
    }
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [draggingTarget, handlePointerMove, handlePointerUp]);

  return (
    <div className="relative w-full aspect-square bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden select-none" style={{ minWidth: 320, touchAction: 'none' }}>
      <svg ref={svgRef} viewBox="0 0 500 500" className="w-full h-full">
        <defs>
          <clipPath id="graph-clip">
            <rect x="50" y="50" width="400" height="400" />
          </clipPath>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#f3f4f6" strokeWidth="1" />
          </pattern>
          {/* Arrow markers for shortage/surplus */}
          <marker id="arrow-right" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#b45309" />
          </marker>
          <marker id="arrow-left" viewBox="0 0 10 10" refX="1" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 10 0 L 0 5 L 10 10 z" fill="#b45309" />
          </marker>
        </defs>

        <rect x="50" y="50" width="400" height="400" fill="url(#grid)" />

        {/* Axes */}
        <line x1="50" y1="50" x2="50" y2="450" stroke="#111827" strokeWidth="2" />
        <line x1="50" y1="450" x2="450" y2="450" stroke="#111827" strokeWidth="2" />
        <text x="20" y="60" className="text-sm font-bold font-mono fill-gray-900">P</text>
        <text x="440" y="480" className="text-sm font-bold font-mono fill-gray-900">Q</text>
        <text x="30" y="470" className="text-sm font-mono fill-gray-500">0</text>

        {/* Phase 5: Y-axis indicators */}
        {/* P1 */}
        <line x1="52" y1={mapY(data.baseEq.Peq)} x2={mapX(data.baseEq.Qeq)} y2={mapY(data.baseEq.Peq)} stroke="#9ca3af" strokeWidth="1" strokeDasharray="4,4" />
        <text x="48" y={mapY(data.baseEq.Peq) + 4} textAnchor="end" className="text-[9px] font-bold font-mono fill-gray-500">P₁:{parseFloat(data.baseEq.Peq.toFixed(1))}</text>
        {/* P2 */}
        {P2 !== null && (
          <>
            <line x1="52" y1={mapY(P2)} x2={mapX(Q2 || data.Q_traded)} y2={mapY(P2)} stroke="#4f46e5" strokeWidth="1" strokeDasharray="4,4" />
            <text x="48" y={pLabelTooClose(P1, P2) ? mapY(P2) + (P2 < P1 ? 14 : -6) : mapY(P2) + 4} textAnchor="end" className="text-[9px] font-bold font-mono fill-indigo-600">P₂:{parseFloat(P2.toFixed(1))}</text>
          </>
        )}
        {/* Pp (producer price under tax) */}
        {Pp !== null && (
          <>
            <line x1="52" y1={mapY(Pp)} x2={mapX(Q2 || data.Q_traded)} y2={mapY(Pp)} stroke="#dc2626" strokeWidth="1" strokeDasharray="4,4" />
            <text x="48" y={pLabelTooClose(P1, Pp) ? mapY(Pp) + 14 : mapY(Pp) + 4} textAnchor="end" className="text-[9px] font-bold font-mono fill-red-600">Pₚ:{parseFloat(Pp.toFixed(1))}</text>
          </>
        )}

        {/* Phase 5: X-axis anti-overlap helpers */}
        {(() => {
          const placedLabels: { id: string, x: number, y: number, text: React.ReactNode, line: React.ReactNode | null }[] = [];

          const addLabel = (id: string, value: number, textNode: (x: number, y: number) => React.ReactNode, lineNode: ((x: number) => React.ReactNode) | null = null) => {
            const x = mapX(value);
            let y = 464;
            let conflict = true;
            while (conflict) {
              // require at least 26px gap to avoid overlap
              conflict = placedLabels.some(l => Math.abs(l.x - x) < 26 && l.y === y);
              if (conflict) y += 12; // bump down vertically
            }
            placedLabels.push({ id, x, y, text: textNode(x, y), line: lineNode ? lineNode(x) : null });
          };

          const q1Value = data.baseEq.Qeq;
          addLabel('Q1', q1Value,
            (x, y) => <text key="t-q1" x={x} y={y} textAnchor="middle" className="text-[9px] font-bold font-mono fill-gray-500">Q₁:{parseFloat(q1Value.toFixed(1))}</text>,
            (x) => <line key="l-q1" x1={x} y1="448" x2={x} y2={mapY(data.baseEq.Peq)} stroke="#9ca3af" strokeWidth="1" strokeDasharray="4,4" />
          );

          if (Q2 !== null) {
            addLabel('Q2', Q2,
              (x, y) => <text key="t-q2" x={x} y={y} textAnchor="middle" className="text-[9px] font-bold font-mono fill-indigo-600">Q₂:{parseFloat(Q2.toFixed(1))}</text>,
              (x) => <line key="l-q2" x1={x} y1="448" x2={x} y2={mapY(P2 || data.P_C)} stroke="#4f46e5" strokeWidth="1" strokeDasharray="4,4" />
            );
          }

          let qdTarget = isBindingCeiling ? shortageQd : (isBindingFloor ? surplusQd : null);
          let qsTarget = isBindingCeiling ? shortageQs : (isBindingFloor ? surplusQs : null);

          if (qdTarget !== null) {
            addLabel('Qd', qdTarget,
              (x, y) => <text key="t-qd" x={x} y={y} textAnchor="middle" className="text-[8px] font-bold font-mono fill-[#b45309]">Qd:{parseFloat(qdTarget.toFixed(1))}</text>
            );
          }

          if (qsTarget !== null) {
            addLabel('Qs', qsTarget,
              (x, y) => <text key="t-qs" x={x} y={y} textAnchor="middle" className="text-[8px] font-bold font-mono fill-[#b45309]">Qs:{parseFloat(qsTarget.toFixed(1))}</text>
            );
          }

          return (
            <>
              {placedLabels.map(l => l.line)}
              {placedLabels.map(l => l.text)}
            </>
          );
        })()}

        <g clipPath="url(#graph-clip)">
          {/* Welfare Shaded Areas — conditional on showWelfare */}
          {showWelfare && (
            <>
              <motion.polygon points={csPoints} fill="rgba(59, 130, 246, 0.15)" stroke="rgba(59, 130, 246, 0.35)" strokeWidth="1" transition={{ duration: 0 }} />
              <motion.polygon points={psPoints} fill="rgba(239, 68, 68, 0.15)" stroke="rgba(239, 68, 68, 0.35)" strokeWidth="1" transition={{ duration: 0 }} />
              {dwlPoints && <motion.polygon points={dwlPoints} fill="rgba(107, 114, 128, 0.3)" stroke="rgba(107, 114, 128, 0.5)" strokeWidth="1" transition={{ duration: 0 }} />}
              {dwlPoints2 && <motion.polygon points={dwlPoints2} fill="rgba(107, 114, 128, 0.3)" stroke="rgba(107, 114, 128, 0.5)" strokeWidth="1" transition={{ duration: 0 }} />}
              {taxRevPoints && <motion.polygon points={taxRevPoints} fill="rgba(34, 197, 94, 0.25)" stroke="rgba(34, 197, 94, 0.45)" strokeWidth="1" transition={{ duration: 0 }} />}
              {tariffRevPoints && <motion.polygon points={tariffRevPoints} fill="rgba(168, 85, 247, 0.25)" stroke="rgba(168, 85, 247, 0.45)" strokeWidth="1" transition={{ duration: 0 }} />}
            </>
          )}

          {/* Base Curves (dashed, shown when shifted) */}
          {(shiftD !== 0 || slopeD !== -1 || baseP !== 50 || baseQ !== 45) && (
            <line x1={mapX(0)} y1={mapY(getPD(0, 0, -1, baseP, baseQ))} x2={mapX(100)} y2={mapY(getPD(100, 0, -1, baseP, baseQ))} stroke="#9ca3af" strokeWidth="2" strokeDasharray="6,6" />
          )}
          {(shiftS !== 0 || slopeS !== 0.8 || baseP !== 50 || baseQ !== 45) && (
            <line x1={mapX(0)} y1={mapY(getPS(0, 0, 0.8, baseP, baseQ))} x2={mapX(100)} y2={mapY(getPS(100, 0, 0.8, baseP, baseQ))} stroke="#9ca3af" strokeWidth="2" strokeDasharray="6,6" />
          )}

          {/* Current Curves */}
          <motion.line x1={mapX(dX1)} y1={mapY(dY1)} x2={mapX(dX2)} y2={mapY(dY2)} stroke="#2563eb" strokeWidth="3" strokeLinecap="round" transition={{ duration: 0 }} />
          <motion.line x1={mapX(sX1)} y1={mapY(sY1)} x2={mapX(sX2)} y2={mapY(sY2)} stroke="#dc2626" strokeWidth="3" strokeLinecap="round" transition={{ duration: 0 }} />

          {/* Invisible enlarged hit areas for dragging curves */}
          <line
            x1={mapX(dX1)} y1={mapY(dY1)} x2={mapX(dX2)} y2={mapY(dY2)}
            stroke="transparent" strokeWidth="30" strokeLinecap="round"
            className="cursor-move"
            onPointerDown={(e) => handlePointerDown(e, 'D')}
          />
          <line
            x1={mapX(sX1)} y1={mapY(sY1)} x2={mapX(sX2)} y2={mapY(sY2)}
            stroke="transparent" strokeWidth="30" strokeLinecap="round"
            className="cursor-move"
            onPointerDown={(e) => handlePointerDown(e, 'S')}
          />

          {/* S+tax Supply Curve (tax and elasticity models) */}
          {showTaxCurve && (
            <>
              <motion.line x1={mapX(stX1)} y1={mapY(stY1)} x2={mapX(stX2)} y2={mapY(stY2)} stroke="#dc2626" strokeWidth="3" strokeDasharray="6,6" strokeLinecap="round" transition={{ duration: 0 }} />
              <line
                x1={mapX(stX1)} y1={mapY(stY1)} x2={mapX(stX2)} y2={mapY(stY2)}
                stroke="transparent" strokeWidth="30" strokeLinecap="round"
                className="cursor-move"
                onPointerDown={(e) => handlePointerDown(e, 'T')}
              />
            </>
          )}

          {/* Equilibrium dashed lines */}
          <motion.line x1="52" y1={mapY(data.P_C)} x2={mapX(data.Q_traded)} y2={mapY(data.P_C)} stroke="#111827" strokeWidth="1.5" strokeDasharray="4,4" transition={{ duration: 0 }} />
          <motion.line x1={mapX(data.Q_traded)} y1="448" x2={mapX(data.Q_traded)} y2={mapY(data.P_C)} stroke="#111827" strokeWidth="1.5" strokeDasharray="4,4" transition={{ duration: 0 }} />

          {/* Interventions */}
          {model === 'ceiling' && (
            <>
              <motion.line x1="50" y1={mapY(priceCeiling)} x2="450" y2={mapY(priceCeiling)} stroke="#d97706" strokeWidth="2" transition={{ duration: 0 }} />
              <line
                x1="50" y1={mapY(priceCeiling)} x2="450" y2={mapY(priceCeiling)}
                stroke="transparent" strokeWidth="20" className="cursor-ns-resize"
                onPointerDown={(e) => handlePointerDown(e, 'C')}
              />
            </>
          )}
          {model === 'floor' && (
            <>
              <motion.line x1="50" y1={mapY(priceFloor)} x2="450" y2={mapY(priceFloor)} stroke="#d97706" strokeWidth="2" transition={{ duration: 0 }} />
              <line
                x1="50" y1={mapY(priceFloor)} x2="450" y2={mapY(priceFloor)}
                stroke="transparent" strokeWidth="20" className="cursor-ns-resize"
                onPointerDown={(e) => handlePointerDown(e, 'F')}
              />
            </>
          )}
          {model === 'world' && (
            <>
              <motion.line x1="50" y1={mapY(worldPrice)} x2="450" y2={mapY(worldPrice)} stroke="#059669" strokeWidth="2" transition={{ duration: 0 }} />
              <line
                x1="50" y1={mapY(worldPrice)} x2="450" y2={mapY(worldPrice)}
                stroke="transparent" strokeWidth="20" className="cursor-ns-resize"
                onPointerDown={(e) => handlePointerDown(e, 'W')}
              />
              {tariff > 0 && (
                <motion.line x1="50" y1={mapY(worldPrice + tariff)} x2="450" y2={mapY(worldPrice + tariff)} stroke="#059669" strokeWidth="2" strokeDasharray="4,4" transition={{ duration: 0 }} />
              )}
            </>
          )}

          {/* Phase 6: Shortage visualization (binding price ceiling) */}
          {isBindingCeiling && (
            <>
              {/* Dashed vertical lines from Qs and Qd down to x-axis */}
              <line x1={mapX(shortageQs)} y1={mapY(priceCeiling)} x2={mapX(shortageQs)} y2="450" stroke="#b45309" strokeWidth="1.5" strokeDasharray="4,4" />
              <line x1={mapX(shortageQd)} y1={mapY(priceCeiling)} x2={mapX(shortageQd)} y2="450" stroke="#b45309" strokeWidth="1.5" strokeDasharray="4,4" />
              {/* Double arrow */}
              <line
                x1={mapX(shortageQs) + 8}
                y1={mapY(priceCeiling) + 12}
                x2={mapX(shortageQd) - 8}
                y2={mapY(priceCeiling) + 12}
                stroke="#b45309" strokeWidth="2"
                markerStart="url(#arrow-left)" markerEnd="url(#arrow-right)"
              />
              <text
                x={(mapX(shortageQs) + mapX(shortageQd)) / 2}
                y={mapY(priceCeiling) + 28}
                textAnchor="middle"
                className="text-[10px] font-bold font-mono" fill="#b45309"
              >Shortage: {data.shortage.toFixed(1)}</text>
            </>
          )}

          {/* Phase 6: Surplus visualization (binding price floor) */}
          {isBindingFloor && (
            <>
              <line x1={mapX(surplusQd)} y1={mapY(priceFloor)} x2={mapX(surplusQd)} y2="450" stroke="#b45309" strokeWidth="1.5" strokeDasharray="4,4" />
              <line x1={mapX(surplusQs)} y1={mapY(priceFloor)} x2={mapX(surplusQs)} y2="450" stroke="#b45309" strokeWidth="1.5" strokeDasharray="4,4" />
              <line
                x1={mapX(surplusQd) + 8}
                y1={mapY(priceFloor) - 12}
                x2={mapX(surplusQs) - 8}
                y2={mapY(priceFloor) - 12}
                stroke="#b45309" strokeWidth="2"
                markerStart="url(#arrow-left)" markerEnd="url(#arrow-right)"
              />
              <text
                x={(mapX(surplusQd) + mapX(surplusQs)) / 2}
                y={mapY(priceFloor) - 20}
                textAnchor="middle"
                className="text-[10px] font-bold font-mono" fill="#b45309"
              >Surplus: {data.surplus.toFixed(1)}</text>
            </>
          )}

          {/* Phase 7: Dot markers at equilibrium */}
          <motion.circle cx={mapX(data.Q_traded)} cy={mapY(data.P_C)} r="5" fill="#111827" stroke="white" strokeWidth="2" transition={{ duration: 0 }} pointerEvents="none" />
          {/* If tax, also show producer-price intersection */}
          {(model === 'tax' || (model === 'elasticity' && tax > 0)) && (
            <motion.circle cx={mapX(data.Q_traded)} cy={mapY(data.P_P)} r="4" fill="#dc2626" stroke="white" strokeWidth="2" transition={{ duration: 0 }} pointerEvents="none" />
          )}
        </g>

        {/* Labels — outside clip group */}
        <text x={mapX(85)} y={clampY(mapY(getPD(85, shiftD, slopeD, baseP, baseQ)) - 15)} fill="#2563eb" className="font-bold text-lg font-mono">D</text>
        <text x={mapX(85)} y={clampY(mapY(getPS(85, shiftS, slopeS, baseP, baseQ)) + 25)} fill="#dc2626" className="font-bold text-lg font-mono">S</text>
        {showTaxCurve && (
          <text x={mapX(85)} y={clampY(mapY(getPS(85, shiftS, slopeS, baseP, baseQ) + tax) - 10)} fill="#dc2626" className="font-bold text-sm font-mono">S+tax</text>
        )}
        {model === 'ceiling' && <text x="380" y={clampY(mapY(priceCeiling) - 8)} fill="#d97706" className="text-xs font-bold font-mono">Price Ceiling</text>}
        {model === 'floor' && <text x="380" y={clampY(mapY(priceFloor) - 8)} fill="#d97706" className="text-xs font-bold font-mono">Price Floor</text>}
        {model === 'world' && <text x="380" y={clampY(mapY(worldPrice) - 8)} fill="#059669" className="text-xs font-bold font-mono">World Price</text>}
        {model === 'world' && tariff > 0 && <text x="380" y={clampY(mapY(worldPrice + tariff) - 8)} fill="#059669" className="text-xs font-bold font-mono">WP + Tariff</text>}

        {/* Phase 6: Qs/Qd labels on x-axis for shortage/surplus (Moved to Phase 5 Anti-Overlap Block) */}

        {/* Phase 8: Trade text for World Price mode */}
        {model === 'world' && (
          <text x="250" y="490" textAnchor="middle" className="text-[11px] font-bold font-mono" fill="#059669">
            {worldPrice + tariff < data.freeMarketEq.Peq
              ? `Domestic Production: ${getQS(worldPrice + tariff, shiftS, slopeS, baseP, baseQ).toFixed(1)} | Imports: ${data.imports.toFixed(1)}`
              : `Domestic Consumption: ${getQD(worldPrice + tariff, shiftD, slopeD, baseP, baseQ).toFixed(1)} | Exports: ${(getQS(worldPrice + tariff, shiftS, slopeS, baseP, baseQ) - getQD(worldPrice + tariff, shiftD, slopeD, baseP, baseQ)).toFixed(1)}`
            }
          </text>
        )}
      </svg>
    </div>
  );
};

export default EconGraph;
