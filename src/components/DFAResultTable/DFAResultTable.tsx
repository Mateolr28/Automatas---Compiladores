// src/components/DFAResultTable/DFAResultTable.tsx
import { DFAResult } from '../../types/automata.types';

interface Props {
  result: DFAResult;
}

export default function DFAResultTable({ result }: Props) {
  const { states, transitions, alphabet, startState } = result;

  return (
    <div className="space-y-8 bg-[#13161e] border border-[#2a2f3d] rounded-lg p-6 text-gray-100 font-sans" id="dfa-result-tables-container">
      {/* Tabla 1 — Matriz de Transiciones del AFD */}
      <div className="space-y-3">
        <div>
          <h3 className="text-sm font-semibold tracking-wider font-mono text-gray-200">
            Tabla 1 — Matriz de Transiciones del AFD
          </h3>
          <p className="text-xs text-gray-400 mt-1">
            Muestra el destino de cada estado determinista construido tras procesar los símbolos de entrada.
          </p>
        </div>

        <div className="overflow-x-auto border border-[#2a2f3d]/60 rounded-md">
          <table className="w-full text-left border-collapse" id="dfa-transition-table">
            <thead>
              <tr className="border-b border-[#2a2f3d] bg-[#0d0f14]">
                <th className="px-4 py-3 text-xs uppercase tracking-wider font-mono text-gray-400 font-medium">
                  Estado AFD (q)
                </th>
                {alphabet.map((sym) => (
                  <th
                    key={`dfa-th-${sym}`}
                    className="px-4 py-3 text-xs uppercase tracking-wider font-mono text-[#4f8ef7] font-semibold text-center"
                  >
                    δ(q, {sym})
                  </th>
                ))}
                <th className="px-4 py-3 text-xs uppercase tracking-wider font-mono text-gray-400 font-medium text-center">
                  ¿Acepta?
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2f3d]/50 bg-[#13161e]">
              {states.map((state) => {
                const isStart = state.name === startState;
                const isAccept = state.isAccept;

                return (
                  <tr key={`dfa-tr-${state.name}`} className="hover:bg-[#1a1e28]/40 transition-colors">
                    {/* Nombre del estado */}
                    <td className="px-4 py-3 font-mono text-sm font-semibold">
                      <div className="flex items-center gap-2">
                        {isStart && (
                          <span className="text-[#4f8ef7]" title="Estado Inicial">
                            →
                          </span>
                        )}
                        <span className={isAccept ? 'text-[#22c55e]' : 'text-gray-200'}>
                          {state.name}
                        </span>
                        {isAccept && (
                          <span className="text-[#22c55e]" title="Estado de Aceptación">
                            ★
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Transiciones para cada símbolo */}
                    {alphabet.map((sym) => {
                      const dest = transitions[`${state.name},${sym}`] || '∅';
                      return (
                        <td key={`dfa-td-${state.name}-${sym}`} className="px-4 py-3 text-center">
                          <span
                            className={`font-mono px-2.5 py-1 rounded text-xs ${
                              dest === '∅'
                                ? 'text-gray-600 bg-transparent'
                                : dest === startState
                                ? 'bg-[#1e2d42]/60 text-[#4f8ef7]'
                                : result.acceptStates.includes(dest)
                                ? 'bg-[#183526]/50 text-[#22c55e]'
                                : 'bg-[#1a1e28] text-gray-300'
                            }`}
                          >
                            {dest}
                          </span>
                        </td>
                      );
                    })}

                    {/* ¿Acepta? badge */}
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
      </div>

      {/* Tabla 2 — Mapa de Subconjuntos (Estados Compuestos) */}
      <div className="space-y-3 pt-4 border-t border-[#2a2f3d]/60">
        <div>
          <h3 className="text-sm font-semibold tracking-wider font-mono text-gray-200">
            Tabla 2 — Equivalencias de Estados (Asociación de Subconjuntos)
          </h3>
          <p className="text-xs text-gray-400 mt-1">
            Muestra detalladamente a qué conjunto de estados del AFND equivale cada estado del AFD construido.
          </p>
        </div>

        <div className="overflow-x-auto border border-[#2a2f3d]/60 rounded-md">
          <table className="w-full text-left border-collapse" id="dfa-mapping-table">
            <thead>
              <tr className="border-b border-[#2a2f3d] bg-[#0d0f14]">
                <th className="px-4 py-3 text-xs uppercase tracking-wider font-mono text-gray-400 font-medium w-1/3">
                  Nombre AFD
                </th>
                <th className="px-4 py-3 text-xs uppercase tracking-wider font-mono text-gray-400 font-medium">
                  Subconjunto AFND (ε-clausura)
                </th>
                <th className="px-4 py-3 text-xs uppercase tracking-wider font-mono text-gray-400 font-medium text-center w-1/4">
                  ¿Es de Aceptación?
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2f3d]/50 bg-[#13161e]">
              {states.map((state) => {
                const subStr =
                  state.subset.length === 0
                    ? '∅ (Estado Trampa / Muerto)'
                    : `{ ${state.subset.join(', ')} }`;

                return (
                  <tr key={`map-tr-${state.name}`} className="hover:bg-[#1a1e28]/40 transition-colors">
                    <td className="px-4 py-3 font-mono text-sm font-bold">
                      <div className="flex items-center gap-2">
                        {state.name === startState && <span className="text-[#4f8ef7]">→</span>}
                        <span className={state.isAccept ? 'text-[#22c55e]' : 'text-gray-300'}>
                          {state.name}
                        </span>
                        {state.isAccept && <span className="text-[#22c55e]">★</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-sm text-gray-300">
                      {subStr}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {state.isAccept ? (
                        <span className="text-xs font-mono font-medium text-[#22c55e] bg-[#183526]/40 px-2 py-0.5 rounded border border-[#22c55e]/20">
                          SÍ (Contiene {state.subset.filter((s) => state.isAccept).join(', ') || 'estado final'})
                        </span>
                      ) : (
                        <span className="text-xs font-mono text-gray-500">NO</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
