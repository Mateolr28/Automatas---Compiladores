// src/components/StateInput/StateInput.tsx
import { useState, KeyboardEvent } from 'react';
import { X, Plus, HelpCircle } from 'lucide-react';

interface Props {
  states: string[];
  startState: string;
  acceptStates: string[];
  onAddState: (s: string) => void;
  onRemoveState: (s: string) => void;
  onStartChange: (s: string) => void;
  onAcceptStatesChange: (states: string[]) => void;
}

export default function StateInput({
  states,
  startState,
  acceptStates,
  onAddState,
  onRemoveState,
  onStartChange,
  onAcceptStatesChange,
}: Props) {
  const [inputValue, setInputValue] = useState('');

  const handleAdd = () => {
    const trimmed = inputValue.trim();
    if (trimmed) {
      onAddState(trimmed);
      setInputValue('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  const toggleAcceptState = (state: string) => {
    if (acceptStates.includes(state)) {
      onAcceptStatesChange(acceptStates.filter((s) => s !== state));
    } else {
      onAcceptStatesChange([...acceptStates, state]);
    }
  };

  // Convert the text input for accept states to update directly
  const handleAcceptsInputChange = (val: string) => {
    const items = val
      .split(',')
      .map((item) => item.trim())
      .filter((item) => states.includes(item));
    onAcceptStatesChange(items);
  };

  return (
    <div className="space-y-5 bg-[#13161e] border border-[#2a2f3d] rounded-lg p-5 text-gray-100 font-sans" id="state-input-container">
      {/* 1. Agregar Estados */}
      <div className="space-y-2">
        <label className="block text-xs uppercase tracking-wider text-gray-400 font-mono font-medium">
          Control de Estados
        </label>
        <div className="flex gap-2">
          <input
            id="state-add-input"
            type="text"
            className="flex-1 min-w-0 px-3 py-2 bg-[#1a1e28] border border-[#2a2f3d] rounded-md text-sm text-gray-100 focus:outline-none focus:border-[#4f8ef7] font-mono"
            placeholder="Ej: q0, q1, A, B..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            id="state-add-btn"
            type="button"
            className="px-3 py-2 bg-[#1a1e28] hover:bg-[#2a2f3d] border border-[#2a2f3d] text-[#4f8ef7] rounded-md text-sm font-medium transition-colors"
            onClick={handleAdd}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Chips de Estados */}
        <div className="flex flex-wrap gap-1.5 pt-1" id="state-chips">
          {states.length === 0 ? (
            <span className="text-xs text-gray-500 italic">No hay estados creados aún.</span>
          ) : (
            states.map((state) => (
              <span
                key={state}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono border transition-colors ${
                  startState === state
                    ? 'bg-[#1e2d42] text-[#4f8ef7] border-[#4f8ef7]/40'
                    : acceptStates.includes(state)
                    ? 'bg-[#183526] text-[#22c55e] border-[#22c55e]/40'
                    : 'bg-[#1a1e28] text-gray-300 border-[#2a2f3d]'
                }`}
              >
                {startState === state && <span className="w-1.5 h-1.5 rounded-full bg-[#4f8ef7]" />}
                {acceptStates.includes(state) && <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />}
                {state}
                <button
                  type="button"
                  className="hover:text-red-400 transition-colors focus:outline-none"
                  onClick={() => onRemoveState(state)}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))
          )}
        </div>
      </div>

      {/* 2. Seleccionar Estado Inicial */}
      <div className="space-y-2">
        <label className="block text-xs uppercase tracking-wider text-gray-400 font-mono font-medium">
          Estado Inicial (q₀)
        </label>
        <select
          id="start-state-select"
          className="w-full px-3 py-2 bg-[#1a1e28] border border-[#2a2f3d] rounded-md text-sm text-gray-200 focus:outline-none focus:border-[#4f8ef7] font-mono cursor-pointer"
          value={startState}
          onChange={(e) => onStartChange(e.target.value)}
        >
          <option value="">-- Seleccionar --</option>
          {states.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>
      </div>

      {/* 3. Estados de Aceptación */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="block text-xs uppercase tracking-wider text-gray-400 font-mono font-medium">
            Estados de Aceptación (F)
          </label>
          <div className="group relative">
            <HelpCircle className="w-3.5 h-3.5 text-gray-500 hover:text-gray-300 cursor-help" />
            <div className="pointer-events-none absolute bottom-full right-0 mb-2 w-64 p-3 bg-[#1a1e28] border border-[#2a2f3d] text-gray-300 text-xs rounded select-none opacity-0 group-hover:opacity-100 transition-opacity z-50 leading-relaxed">
              Seleccione los estados de aceptación haciendo clic sobre ellos o separándolos con comas.
            </div>
          </div>
        </div>

        {/* Clicks directos para configurar estados de aceptación */}
        <div className="flex flex-wrap gap-1.5 p-2 bg-[#0d0f14] border border-[#2a2f3d] rounded-md">
          {states.length === 0 ? (
            <span className="text-xs text-gray-500 italic">Crea estados para poder seleccionarlos</span>
          ) : (
            states.map((state) => {
              const active = acceptStates.includes(state);
              return (
                <button
                  key={`acc-toggle-${state}`}
                  type="button"
                  onClick={() => toggleAcceptState(state)}
                  className={`px-2 py-1 rounded text-xs font-mono border transition-colors cursor-pointer ${
                    active
                      ? 'bg-[#183526] text-[#22c55e] border-[#22c55e] font-semibold'
                      : 'bg-[#13161e] text-gray-400 border-[#2a2f3d] hover:border-[#4f8ef7]'
                  }`}
                >
                  {state}
                </button>
              );
            })
          )}
        </div>

        {/* Input de texto sincrónico */}
        <input
          id="accept-states-input"
          type="text"
          className="w-full px-3 py-2 bg-[#1a1e28] border border-[#2a2f3d] rounded-md text-sm text-gray-300 focus:outline-none focus:border-[#4f8ef7] font-mono"
          placeholder="Separados por comas... (ej: q2, q3)"
          value={acceptStates.join(', ')}
          onChange={(e) => handleAcceptsInputChange(e.target.value)}
        />
      </div>
    </div>
  );
}
