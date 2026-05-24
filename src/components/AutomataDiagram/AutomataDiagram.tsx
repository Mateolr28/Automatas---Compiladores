// src/components/AutomataDiagram/AutomataDiagram.tsx
import { HelpCircle } from 'lucide-react';

interface Props {
  title: string;
  badge: string;
  badgeColor: 'green' | 'red' | 'blue';
  states: string[];
  alphabet: string[];
  transitions: Record<string, string[] | string>;
  startState: string;
  acceptStates: string[];
}

export default function AutomataDiagram({
  title,
  badge,
  badgeColor,
  states,
  transitions,
  startState,
  acceptStates,
}: Props) {
  // Configuración de visualización SVG
  const width = 500;
  const height = 320;
  const cX = width / 2;
  const cY = height / 2;
  const rLayout = 110; // Radio del círculo principal de distribución
  const rNode = 22;    // Radio del círculo de cada estado

  // Asignar colores según el tipo de badge
  const badgeClasses = {
    green: 'bg-[#183526] border-[#22c55e]/30 text-[#22c55e]',
    red: 'bg-red-950/40 border-red-900/40 text-red-400',
    blue: 'bg-[#1e2d42] border-[#4f8ef7]/40 text-[#4f8ef7]',
  }[badgeColor];

  // 1. Calcular coordenadas para cada estado
  const statePositions: Record<string, { x: number; y: number }> = {};
  if (states.length === 1) {
    statePositions[states[0]] = { x: cX, y: cY };
  } else {
    states.forEach((state, idx) => {
      // Repartidos de forma circular comenzando desde arriba (-90°)
      const angle = (idx * 2 * Math.PI) / states.length - Math.PI / 2;
      statePositions[state] = {
        x: cX + rLayout * Math.cos(angle),
        y: cY + rLayout * Math.sin(angle),
      };
    });
  }

  // 2. Agrupar transiciones por par (From, To)
  // key: "from->to", value: string[] de símbolos
  const edgeGroups: Record<string, string[]> = {};

  Object.entries(transitions).forEach(([key, val]) => {
    const parts = key.split(',');
    if (parts.length !== 2) return;
    const [from, symbol] = parts;

    // El valor puede ser String (DFA) o String[] (NFA)
    const targets = Array.isArray(val) ? val : [val];

    targets.forEach((to) => {
      // Ignorar si el estado de origen o destino no existe en la lista de estados actuales
      if (!states.includes(from) || !states.includes(to)) return;

      const edgeKey = `${from}->${to}`;
      if (!edgeGroups[edgeKey]) {
        edgeGroups[edgeKey] = [];
      }
      edgeGroups[edgeKey].push(symbol);
    });
  });

  return (
    <div className="flex-1 bg-[#13161e] border border-[#2a2f3d] rounded-lg p-5 flex flex-col font-sans" id={`diagram-${title.replace(/\s+/g, '-').toLowerCase()}`}>
      {/* Header del Diagrama */}
      <div className="flex justify-between items-center border-b border-[#2a2f3d] pb-3 mb-4">
        <span className="text-sm font-semibold font-mono text-gray-200">{title}</span>
        <span className={`px-2.5 py-0.5 rounded text-xs font-mono font-medium border ${badgeClasses}`}>
          {badge}
        </span>
      </div>

      {/* Contenedor del Canvas SVG */}
      <div className="relative flex-1 flex items-center justify-center bg-[#0d0f14] border border-[#2a2f3d]/60 rounded-md p-1 min-h-[300px]">
        {states.length === 0 ? (
          <div className="text-xs text-gray-500 italic font-sans py-12">
            No hay estados para representar el diagrama.
          </div>
        ) : (
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-auto select-none overflow-visible"
          >
            {/* DEFINICIONES: Marcador de Flechas */}
            <defs>
              <marker
                id="diagram-arrow"
                viewBox="0 0 10 10"
                refX={rNode + 5} // Detener la punta de la flecha justo antes del círculo del estado
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="#4f8ef7" />
              </marker>
            </defs>

            {/* SEGMENTO 1: Dibujar Aristas/Arcos */}
            {Object.entries(edgeGroups).map(([edgeKey, symbols]) => {
              const [from, to] = edgeKey.split('->');
              const posA = statePositions[from];
              const posB = statePositions[to];
              if (!posA || !posB) return null;

              // Unir y filtrar duplicados de símbolos
              const uniqueSymbols = Array.from(new Set(symbols)).sort();
              const label = uniqueSymbols.join(', ');

              const isSelfLoop = from === to;

              if (isSelfLoop) {
                // Cálculo de bucle exterior basado en la dirección hacia fuera del centro
                const angle = Math.atan2(posA.y - cY, posA.x - cX);
                const a1 = angle - Math.PI / 6;
                const a2 = angle + Math.PI / 6;

                const x1 = posA.x + rNode * Math.cos(a1);
                const y1 = posA.y + rNode * Math.sin(a1);
                const x2 = posA.x + rNode * Math.cos(a2);
                const y2 = posA.y + rNode * Math.sin(a2);

                const loopRadius = 45;
                const cp1x = posA.x + loopRadius * Math.cos(a1);
                const cp1y = posA.y + loopRadius * Math.sin(a1);
                const cp2x = posA.x + loopRadius * Math.cos(a2);
                const cp2y = posA.y + loopRadius * Math.sin(a2);

                const labelX = posA.x + (loopRadius + 12) * Math.cos(angle);
                const labelY = posA.y + (loopRadius + 12) * Math.sin(angle);

                return (
                  <g key={`loop-${from}`} className="cursor-pointer group">
                    <path
                      d={`M ${x1} ${y1} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x2} ${y2}`}
                      fill="none"
                      stroke="#4f8ef7"
                      strokeWidth="1.5"
                      markerEnd="url(#diagram-arrow)"
                      className="group-hover:stroke-blue-400 transition-colors"
                    />
                    <rect
                      x={labelX - 12}
                      y={labelY - 9}
                      width="24"
                      height="16"
                      rx="3"
                      fill="#0d0f14"
                      stroke="#2a2f3d"
                      strokeWidth="0.5"
                    />
                    <text
                      x={labelX}
                      y={labelY}
                      fill="#99a1b3"
                      fontSize="9"
                      fontFamily="JetBrains Mono, monospace"
                      fontWeight="bold"
                      textAnchor="middle"
                      dominantBaseline="central"
                    >
                      {label}
                    </text>
                  </g>
                );
              } else {
                // Conexiones bilaterales (curvadas) o unilaterales
                const hasReverse = !!edgeGroups[`${to}->${from}`];
                const curveOffset = hasReverse ? 20 : 8; // ligereza de curvatura para uniformidad visual académica

                const x1 = posA.x;
                const y1 = posA.y;
                const x2 = posB.x;
                const y2 = posB.y;

                const mx = (x1 + x2) / 2;
                const my = (y1 + y2) / 2;

                const dx = x2 - x1;
                const dy = y2 - y1;
                const dist = Math.sqrt(dx * dx + dy * dy) || 1;

                // Vector normal a la dirección de la arista
                const nx = -dy / dist;
                const ny = dx / dist;

                // Punto de control para curva cuadrática Bézier
                const cpx = mx + nx * curveOffset;
                const cpy = my + ny * curveOffset;

                // Centro matemático real de la curva
                const midCurveX = 0.25 * x1 + 0.5 * cpx + 0.25 * x2;
                const midCurveY = 0.25 * y1 + 0.5 * cpy + 0.25 * y2;

                const labelX = midCurveX + nx * 12;
                const labelY = midCurveY + ny * 12;

                return (
                  <g key={`edge-${from}-${to}`} className="cursor-pointer group">
                    <path
                      d={`M ${x1} ${y1} Q ${cpx} ${cpy} ${x2} ${y2}`}
                      fill="none"
                      stroke="#4f8ef7"
                      strokeWidth="1.5"
                      markerEnd="url(#diagram-arrow)"
                      className="group-hover:stroke-blue-400 transition-colors"
                    />
                    {/* Caja de etiqueta para que no la cruce la arista */}
                    <rect
                      x={labelX - 12 * Math.max(1, Math.floor(label.length / 2))}
                      y={labelY - 8}
                      width={12 * Math.max(1.5, label.length)}
                      height="15"
                      rx="3"
                      fill="#0d0f14"
                      stroke="#2a2f3d"
                      strokeWidth="0.5"
                    />
                    <text
                      x={labelX}
                      y={labelY - 1}
                      fill="#e2e8f0"
                      fontSize="9.5"
                      fontFamily="JetBrains Mono, monospace"
                      fontWeight="bold"
                      textAnchor="middle"
                      dominantBaseline="central"
                    >
                      {label}
                    </text>
                  </g>
                );
              }
            })}

            {/* SEGMENTO 2: Flecha de Inicio */}
            {states.includes(startState) && (() => {
              const startPos = statePositions[startState];
              if (!startPos) return null;

              // El inicio entra horizontalmente desde la izquierda
              const xStart = startPos.x - 45;
              const yStart = startPos.y;

              return (
                <g key="initial-arrow">
                  <path
                    d={`M ${xStart} ${yStart} L ${startPos.x - rNode - 1} ${yStart}`}
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth="2"
                    markerEnd="url(#diagram-arrow)"
                  />
                  <text
                    x={xStart + 10}
                    y={yStart - 10}
                    fill="#22c55e"
                    fontSize="9"
                    fontFamily="JetBrains Mono, monospace"
                    fontWeight="bold"
                  >
                    inicio
                  </text>
                </g>
              );
            })()}

            {/* SEGMENTO 3: Dibujar los Nodos (Burbujas) */}
            {states.map((state) => {
              const pos = statePositions[state];
              if (!pos) return null;

              const isAccept = acceptStates.includes(state);
              const isStart = state === startState;

              return (
                <g key={`node-${state}`} className="group cursor-pointer">
                  {/* Círculo Principal */}
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={rNode}
                    fill={isStart ? '#132135' : '#1a1e28'}
                    stroke={
                      isAccept
                        ? '#22c55e'
                        : isStart
                        ? '#4f8ef7'
                        : '#2a2f3d'
                    }
                    strokeWidth={isStart ? '2.5' : '1.5'}
                    className={`transition-colors group-hover:fill-[#222530]`}
                  />

                  {/* Doble Círculo si es de Aceptación */}
                  {isAccept && (
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={rNode - 5}
                      fill="none"
                      stroke="#22c55e"
                      strokeWidth="1"
                    />
                  )}

                  {/* Etiqueta del Estado */}
                  <text
                    x={pos.x}
                    y={pos.y}
                    fill={isAccept ? '#22c55e' : isStart ? '#4f8ef7' : '#e2e8f0'}
                    fontSize="10"
                    fontFamily="JetBrains Mono, monospace"
                    fontWeight="bold"
                    textAnchor="middle"
                    dominantBaseline="central"
                  >
                    {state}
                  </text>
                </g>
              );
            })}
          </svg>
        )}
      </div>
    </div>
  );
}
