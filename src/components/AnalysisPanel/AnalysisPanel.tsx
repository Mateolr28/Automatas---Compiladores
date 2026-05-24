// src/components/AnalysisPanel/AnalysisPanel.tsx
import { Info, BarChart2, BookOpen, AlertCircle } from 'lucide-react';
import { AutomataInput, DFAResult } from '../../types/automata.types';

interface Props {
  nfaInput: AutomataInput;
  dfaResult: DFAResult;
  validationReason: string;
}

export default function AnalysisPanel({
  nfaInput,
  dfaResult,
  validationReason,
}: Props) {
  // Calcular número de transiciones definidas en el AFND (donde el array no esté vacío)
  const nfaTransitionCount = Object.values(nfaInput.transitions).reduce(
    (acc, targetList) => acc + (targetList ? targetList.length : 0),
    0
  );

  // Calcular número de transiciones del AFD (excluyendo transiciones del estado muerto a sí mismo si se prefiere,
  // pero contar todas las entradas en dfaResult.transitions es lo más honesto)
  const dfaTransitionCount = Object.keys(dfaResult.transitions).length;

  return (
    <div className="space-y-6 bg-[#13161e] border border-[#2a2f3d] rounded-lg p-6 text-gray-100 font-sans" id="analysis-panel-container">
      {/* 1. Razón del Análisis de Validación */}
      <div className="flex items-start gap-3 bg-[#1e2330] border border-[#2a2f3d] p-4 rounded-lg">
        <AlertCircle className="w-5 h-5 text-[#4f8ef7] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h3 className="text-sm font-semibold tracking-wide font-mono text-gray-100">
            Diagnóstico del Autómata de Entrada
          </h3>
          <p className="text-xs text-gray-300 leading-relaxed">
            {validationReason}
          </p>
        </div>
      </div>

      {/* 2. Cuadrícula Comparativa NFND vs AFD */}
      <div className="space-y-3">
        <h3 className="text-xs uppercase tracking-wider text-gray-400 font-mono font-medium flex items-center gap-1.5">
          <BarChart2 className="w-3.5 h-3.5 text-[#4f8ef7]" /> Métricas Comparativas del Autómata
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4" id="metric-grid">
          {/* Tarjeta de Estados */}
          <div className="bg-[#1a1e28] border border-[#2a2f3d]/60 rounded-md p-4 space-y-2">
            <span className="text-xs text-gray-400 font-mono">Estados Totales</span>
            <div className="flex items-baseline justify-between pt-1">
              <div className="text-center">
                <span className="text-xl font-bold font-mono text-gray-300">{nfaInput.states.length}</span>
                <p className="text-[10px] text-gray-500 font-mono">En AFND</p>
              </div>
              <span className="text-gray-600 font-mono">→</span>
              <div className="text-center">
                <span className="text-xl font-bold font-mono text-[#4f8ef7]">
                  {dfaResult.states.length}
                </span>
                <p className="text-[10px] text-gray-500 font-mono">En AFD</p>
              </div>
            </div>
          </div>

          {/* Tarjeta de Transiciones */}
          <div className="bg-[#1a1e28] border border-[#2a2f3d]/60 rounded-md p-4 space-y-2">
            <span className="text-xs text-gray-400 font-mono">Aristas / Caminos</span>
            <div className="flex items-baseline justify-between pt-1">
              <div className="text-center">
                <span className="text-xl font-bold font-mono text-gray-300">{nfaTransitionCount}</span>
                <p className="text-[10px] text-gray-500 font-mono">Caminos AFND</p>
              </div>
              <span className="text-gray-600 font-mono">→</span>
              <div className="text-center">
                <span className="text-xl font-bold font-mono text-[#4f8ef7]">
                  {dfaTransitionCount}
                </span>
                <p className="text-[10px] text-gray-500 font-mono">Caminos AFD</p>
              </div>
            </div>
          </div>

          {/* Tarjeta de Estados de Aceptación */}
          <div className="bg-[#1a1e28] border border-[#2a2f3d]/60 rounded-md p-4 space-y-2">
            <span className="text-xs text-gray-400 font-mono">Aceptación (F)</span>
            <div className="flex items-baseline justify-between pt-1">
              <div className="text-center">
                <span className="text-sm font-bold font-mono text-[#22c55e]">
                  {nfaInput.acceptStates.length > 0 ? nfaInput.acceptStates.join(', ') : 'Ninguno'}
                </span>
                <p className="text-[10px] text-gray-500 font-mono">AFND</p>
              </div>
              <span className="text-gray-600 font-mono">→</span>
              <div className="text-center">
                <span className="text-sm font-bold font-mono text-[#22c55e]">
                  {dfaResult.acceptStates.length > 0 ? dfaResult.acceptStates.join(', ') : 'Ninguno'}
                </span>
                <p className="text-[10px] text-gray-500 font-mono">AFD</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Explicación Teórica del Algoritmo */}
      <div className="space-y-3 pt-4 border-t border-[#2a2f3d]/60">
        <h3 className="text-xs uppercase tracking-wider text-gray-400 font-mono font-medium flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5 text-[#4f8ef7]" /> Algoritmo de Construcción de Subconjuntos
        </h3>

        <div className="bg-[#0d0f14] border border-[#2a2f3d]/40 rounded p-4 text-xs space-y-3.5 leading-relaxed text-gray-300">
          <p>
            El método empleado es la <strong>Construcción de Subconjuntos (Algoritmo de Rabin-Scott)</strong>, el cual genera un autómata determinista equivalente donde cada estado representa un conjunto de estados posibles del autómata original.
          </p>

          <ol className="list-decimal pl-4 space-y-2.5">
            <li>
              <strong>Comienzo con Clausura épsilon (ε-closure):</strong> Se analiza el conjunto de estados iniciales calculando todos los destinos posibles mediante caminos silenciosos épsilon (ε). Este conjunto consolidado se designó con el nombre de <span className="text-[#4f8ef7] font-mono font-bold">S0</span>.
            </li>
            <li>
              <strong>Procesamiento de Símbolos Reales:</strong> Para cada juego de subconjuntos creados y para cada símbolo del alfabeto (excluyendo ε), se evalúan cuáles son los estados del AFND alcanzables (<span className="font-mono text-gray-400">Move</span>) y se determina su clausura épsilon unificada.
            </li>
            <li>
              <strong>Descubrimiento de nuevos estados:</strong> Si el subconjunto resultante no ha sido observado antes, se le da de alta como un nuevo estado identificable (<span className="text-gray-200 font-mono font-semibold">S1, S2, etc.</span>) y se encola para su posterior procesamiento de salidas.
            </li>
            <li>
              <strong>Estado Muerto (∅):</strong> Cuando para un subconjunto no existen transiciones definidas ante un determinado símbolo, el algoritmo converge en un estado de absorción (estado muerto, rotulado visualmente como <span className="font-semibold text-gray-400">∅</span>).
            </li>
            <li>
              <strong>Regla de Aceptación:</strong> Un estado compuesto del AFD es considerado de aceptación si posee al menos un estado miembro que ya era de aceptación en el autómata original.
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}
