// src/components/AlphabetInput/AlphabetInput.tsx
import { useState, KeyboardEvent } from 'react';
import { X, Plus, Info } from 'lucide-react';

interface Props {
  symbols: string[];
  onAddSymbol: (s: string) => void;
  onRemoveSymbol: (s: string) => void;
}

export default function AlphabetInput({
  symbols,
  onAddSymbol,
  onRemoveSymbol,
}: Props) {
  const [inputValue, setInputValue] = useState('');

  const handleAdd = () => {
    const trimmed = inputValue.trim();
    if (trimmed) {
      onAddSymbol(trimmed);
      setInputValue('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className="space-y-4 bg-[#13161e] border border-[#2a2f3d] rounded-lg p-5 text-gray-100 font-sans" id="alphabet-input-container">
      <div className="space-y-2">
        <label className="block text-xs uppercase tracking-wider text-gray-400 font-mono font-medium">
          Alfabeto
        </label>
        <div className="flex gap-2">
          <input
            id="alphabet-input-text"
            type="text"
            className="flex-1 min-w-0 px-3 py-2 bg-[#1a1e28] border border-[#2a2f3d] rounded-md text-sm text-gray-100 focus:outline-none focus:border-[#4f8ef7] font-mono"
            placeholder="Ej: a, b, 0, 1..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            id="alphabet-add-btn"
            type="button"
            className="px-3 py-2 bg-[#1a1e28] hover:bg-[#2a2f3d] border border-[#2a2f3d] text-[#4f8ef7] rounded-md text-sm font-medium transition-colors"
            onClick={handleAdd}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Chips del Alfabeto */}
        <div className="flex flex-wrap gap-1.5 pt-1" id="alphabet-chips">
          {symbols.length === 0 ? (
            <span className="text-xs text-gray-500 italic">No hay símbolos en el alfabeto.</span>
          ) : (
            symbols.map((symbol) => (
              <span
                key={symbol}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#1a1e28] border border-[#2a2f3d] text-gray-300 rounded text-xs font-mono"
              >
                {symbol}
                <button
                  type="button"
                  className="hover:text-red-400 transition-colors focus:outline-none"
                  onClick={() => onRemoveSymbol(symbol)}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))
          )}
        </div>
      </div>

      {/* No epsilon banner to keep UI clean and corresponding to the removed epsilon column */}
    </div>
  );
}
