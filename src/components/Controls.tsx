import React from 'react';
import { AppState } from '../App';

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  stateKey: keyof AppState;
  onChange: (key: keyof AppState, val: number) => void;
}

const Slider: React.FC<SliderProps> = ({ label, value, min, max, step, stateKey, onChange }) => {
  const [localVal, setLocalVal] = React.useState<string>(value.toString());

  React.useEffect(() => {
    setLocalVal(value.toString());
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalVal(e.target.value);
    const parsed = parseFloat(e.target.value);
    if (!isNaN(parsed)) {
      onChange(stateKey, parsed);
    }
  };

  return (
    <div className="mb-3">
      <div className="flex justify-between items-center mb-1">
        <label className="text-sm font-semibold text-gray-900">{label}</label>
        <div className="flex items-center gap-1">
          {value > 0 && stateKey.toString().includes('shift') && <span className="text-sm text-gray-500 font-mono">+</span>}
          <input
            type="number"
            value={localVal}
            onChange={handleInputChange}
            className="w-16 text-right text-sm font-mono text-gray-700 bg-gray-50 border border-gray-200 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(stateKey, parseFloat(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      />
    </div>
  );
};

interface ControlsProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}

const Controls: React.FC<ControlsProps> = ({ state, setState }) => {
  const handleChange = (key: keyof AppState, value: number) => {
    setState(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200">
      <h3 className="text-lg font-bold mb-4 text-gray-900 tracking-tight">Parameters</h3>

      <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-xl">
        <h4 className="text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Base Equilibrium</h4>
        <Slider label="Initial Price" value={state.baseP} min={10} max={90} step={1} onChange={handleChange} stateKey="baseP" />
        <Slider label="Initial Quantity" value={state.baseQ} min={10} max={90} step={1} onChange={handleChange} stateKey="baseQ" />
      </div>

      {(state.model === 'standard' || state.model === 'elasticity') && (
        <>
          <Slider label="Shift Demand" value={state.shiftD} min={-40} max={40} step={1} onChange={handleChange} stateKey="shiftD" />
          <Slider label="Shift Supply" value={state.shiftS} min={-40} max={40} step={1} onChange={handleChange} stateKey="shiftS" />
        </>
      )}

      {state.model === 'elasticity' && (
        <>
          <Slider label="Demand Slope (Elasticity)" value={state.slopeD} min={-3} max={-0.2} step={0.1} onChange={handleChange} stateKey="slopeD" />
          <Slider label="Supply Slope (Elasticity)" value={state.slopeS} min={0.2} max={3} step={0.1} onChange={handleChange} stateKey="slopeS" />
          <Slider label="Per-Unit Tax" value={state.tax} min={0} max={40} step={1} onChange={handleChange} stateKey="tax" />
        </>
      )}

      {state.model === 'ceiling' && (
        <Slider label="Price Ceiling" value={state.priceCeiling} min={10} max={90} step={0.1} onChange={handleChange} stateKey="priceCeiling" />
      )}

      {state.model === 'floor' && (
        <Slider label="Price Floor" value={state.priceFloor} min={10} max={90} step={0.1} onChange={handleChange} stateKey="priceFloor" />
      )}

      {state.model === 'tax' && (
        <Slider label="Per-Unit Tax" value={state.tax} min={0} max={40} step={1} onChange={handleChange} stateKey="tax" />
      )}

      {state.model === 'world' && (
        <>
          <Slider label="World Price" value={state.worldPrice} min={10} max={90} step={0.1} onChange={handleChange} stateKey="worldPrice" />
          <Slider label="Tariff" value={state.tariff} min={0} max={30} step={1} onChange={handleChange} stateKey="tariff" />
        </>
      )}

      <button
        onClick={() => setState(prev => ({
          ...prev,
          baseP: 55, baseQ: 50, shiftD: 0, shiftS: 0, slopeD: -1, slopeS: 1,
          priceCeiling: 40, priceFloor: 65, tax: state.model === 'elasticity' ? 0 : 20, worldPrice: 30, tariff: 0
        }))}
        className="mt-4 w-full py-2 px-4 border border-gray-300 rounded-xl shadow-sm text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all active:scale-[0.98]"
      >
        Reset to Default
      </button>
    </div>
  );
};

export default Controls;
