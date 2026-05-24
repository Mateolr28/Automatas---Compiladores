import { useState, useEffect, ChangeEvent } from 'react';
import { Play, RotateCcw, HelpCircle } from 'lucide-react';

interface Props {
  states: string[];
  alphabet: string[];
  startState: string;
  acceptStates: string[];
  transitions: Record<string, string[]>;
  onUpdate: (state: string, sym: string, value: string) => void;
  onConvert: () => void;
  onReset: () => void;
}

interface TransitionInputProps {
  initialValue: string[];
  onChange: (value: string) => void;
}

function TransitionInput({ initialValue, onChange }: TransitionInputProps) {
  const [localText, setLocalText] = useState((initialValue || []).join(', '));

  // Sync only if there is a functional difference between local draft and parent value
  useEffect(() => {
    const parentNormalized = (initialValue || []).map(t => t.trim()).filter(Boolean).join(',');
    const localNormalized = localText.split(',').map(t => t.trim()).filter(Boolean).join(',');
    if (parentNormalized !== localNormalized) {
      setLocalText((initialValue || []).join(', '));
    }
  }, [initialValue]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocalText(val);
    onChange(val);
  };

  const handleBlur = () => {
    const cleaned = localText
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t !== '')
      .join(', ');
    setLocalText(cleaned);
    onChange(cleaned);
  };

  return (
    <input
      type="text"
      className="w-full max-w-[120px] mx-auto text-center px-2 py-1 bg-[#1a1e28] border border-[#2a2f3d] focus:border-[#4f8ef7] hover:border-gray-500 rounded text-sm text-gray-100 font-mono focus:outline-none placeholder-gray-600 transition-colors"
      placeholder="∅"
      value={localText}
      onChange={handleChange}
      onBlur={handleBlur}
    />
  );
}

export default function TransitionTable({
  states,
  alphabet,
  startState,
  acceptStates,
  transitions,
  onUpdate,
  onConvert,
  onReset,
}: Props) {
  // Los símbolos para las columnas de transiciones son el alfabeto
  const columns = [...alphabet];

  return (
    <div className="space-y-4 bg-[#13161e] border border-[#2a2f3d] rounded-lg p-6 text-gray-100 font-sans" id="transition-table-container">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#2a2f3d] pb-4 gap-2">
        <div>
          <h2 className="text-base font-semibold text-gray-100 font-mono">Tabla de Transiciones (AFND)</h2>
          <p className="text-xs text-gray-400 mt-1">
            Escriba las transiciones separadas por comas. Deje vacío para estado muerto (∅).
          </p>
        </div>
        <div className="group relative">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#1a1e28] border border-[#2a2f3d] text-xs font-mono text-gray-400 rounded cursor-help">
            <HelpCircle className="w-3.5 h-3.5 text-[#4f8ef7]" /> Formato de Entrada
          </span>
          <div className="pointer-events-none absolute bottom-full sm:bottom-auto sm:top-full right-0 mt-2 w-72 p-3 bg-[#1a1e28] border border-[#2a2f3d] text-gray-300 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity z-50 leading-relaxed shadow-lg">
            Si para un estado <span className="text-[#4f8ef7] font-mono">A</span> y un símbolo <span className="text-[#4f8ef7] font-mono">0</span> la máquina puede transicionar tanto a <span className="text-gray-200 font-mono">A</span> como a <span className="text-gray-200 font-mono">B</span>, ingrese <span className="text-green-400 font-mono">A, B</span> en la casilla correspondiente.
          </div>
        </div>
      </div>

      <div className="overflow-x-auto select-none">
        <table className="w-full text-left border-collapse" id="transition-table-el">
          <thead>
            <tr className="border-b border-[#2a2f3d] bg-[#0d0f14]">
              <th className="px-4 py-3 text-xs uppercase tracking-wider font-mono text-gray-400 font-medium w-1/4">
                Estado
              </th>
              {columns.map((sym) => (
                <th
                  key={`th-${sym}`}
                  className="px-4 py-3 text-xs uppercase tracking-wider font-mono text-[#4f8ef7] font-semibold text-center"
                >
                  ({sym})
                </th>
              ))}
              <th className="px-4 py-3 text-xs uppercase tracking-wider font-mono text-gray-400 font-medium text-center w-1/5">
                Acepta SÍ/NO
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2a2f3d]/50 bg-[#13161e]">
            {states.map((state) => {
              const isStart = state === startState;
              const isAccept = acceptStates.includes(state);

              return (
                <tr key={`tr-${state}`} className="hover:bg-[#1a1e28]/40 transition-colors">
                  {/* Nombre y marcas del estado */}
                  <td className="px-4 py-3 font-mono text-sm font-semibold">
                    <div className="flex items-center gap-2">
                      {isStart && (
                        <span className="text-[#4f8ef7]" title="Estado Inicial">
                          →
                        </span>
                      )}
                      <span className={isAccept ? 'text-[#22c55e]' : 'text-gray-200'}>
                        {state}
                      </span>
                      {isAccept && (
                        <span className="text-[#22c55e]" title="Estado de Aceptación">
                          ★
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Celdas editables para símbolos del alfabeto mas epsilon */}
                  {columns.map((sym) => {
                    const cellKey = `${state},${sym}`;
                    const val = transitions[cellKey] || [];

                    return (
                      <td key={`td-${state}-${sym}`} className="px-2 py-2 text-center">
                        <TransitionInput
                          initialValue={val}
                          onChange={(newVal) => onUpdate(state, sym, newVal)}
                        />
                      </td>
                    );
                  })}

                  {/* Badge de aceptación */}
                  <td className="px-4 py-3 text-center">
                    {isAccept ? (
                      <span className="inline-flex px-2 py-0.5 rounded text-xs font-mono font-medium bg-[#183526]/85 border border-[#22c55e]/30 text-[#22c55e]">
                        SÍ
                      </span>
                    ) : (
                      <span className="inline-flex px-2 py-0.5 rounded text-xs font-mono font-medium bg-red-950/40 border border-red-900/40 text-red-400">
                        NO
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Botones de Control de la tabla */}
      <div className="flex flex-wrap gap-3 pt-3 justify-end border-t border-[#2a2f3d]/60">
        <button
          id="btn-transition-reset"
          type="button"
          onClick={onReset}
          className="flex items-center gap-1.5 px-4 py-2 border border-[#2a2f3d] bg-[#1a1e28]/30 hover:bg-[#1a1e28] hover:text-white rounded text-sm font-mono text-gray-300 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4 text-red-400" />
          Reiniciar
        </button>
        <button
          id="btn-transition-convert"
          type="button"
          onClick={onConvert}
          className="flex items-center gap-1.5 px-5 py-2 bg-[#4f8ef7] hover:bg-[#3b7ae0] text-black font-semibold rounded text-sm font-mono transition-colors cursor-pointer"
        >
          <Play className="w-4 h-4 inline-block stroke-[3]" />
          Convertir AFND
        </button>
      </div>
    </div>
  );
}