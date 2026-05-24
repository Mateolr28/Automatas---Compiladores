// src/App.tsx
import { useAutomata } from './hooks/useAutomata';
import StateInput from './components/StateInput/StateInput';
import AlphabetInput from './components/AlphabetInput/AlphabetInput';
import TransitionTable from './components/TransitionTable/TransitionTable';
import AutomataDiagram from './components/AutomataDiagram/AutomataDiagram';
import DFAResultTable from './components/DFAResultTable/DFAResultTable';
import AnalysisPanel from './components/AnalysisPanel/AnalysisPanel';
import StatusBar from './components/StatusBar/StatusBar';
import { validateNFA } from './logic/nfaValidator';
import { TabType } from './types/automata.types';
import { Cpu, Settings, Layers, Table, Sparkles, BookOpen } from 'lucide-react';

export default function App() {
  const {
    states,
    alphabet,
    startState,
    acceptStates,
    transitions,
    tableVisible,
    status,
    activeTab,
    nfaInput,
    dfaResult,
    setStartState,
    setAcceptStates,
    setActiveTab,
    addState,
    removeState,
    addSymbol,
    removeSymbol,
    buildTransitionTable,
    updateTransition,
    convert,
    reset,
    loadExample,
  } = useAutomata();

  return (
    <div className="min-h-screen bg-[#0d0f14] text-gray-100 flex flex-col font-sans selection:bg-[#4f8ef7]/30 selection:text-white" id="main-layout">
      {/* Barra de Navegación de Cabecera (Sutil, plana) */}
      <header className="border-b border-[#2a2f3d] bg-[#13161e] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-[#1a1e28] border border-[#2a2f3d] rounded text-[#4f8ef7]">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight font-mono text-white">
              ⟨ AFND → AFD ⟩
            </h1>
            <p className="text-[10px] text-gray-400 font-mono">
              Conversor de Autómatas por Construcción de Subconjuntos
            </p>
          </div>
        </div>

        <button
          id="load-example-btn"
          type="button"
          onClick={loadExample}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1a1e28] hover:bg-[#2a2f3d] border border-[#2a2f3d] rounded text-xs text-[#4f8ef7] font-semibold font-mono transition-colors cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Cargar Ejemplo
        </button>
      </header>

      {/* Grid Principal Adaptativo */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 max-w-[1700px] w-full mx-auto">
        {/* COLUMNA 1: CONFIGURACIÓN (Sidebar izquierdo, 4 de 12 cols de peso) */}
        <aside className="lg:col-span-4 space-y-5 flex flex-col">
          <div className="flex items-center gap-2 px-1">
            <Settings className="w-4 h-4 text-gray-400" />
            <h2 className="text-xs uppercase tracking-wider text-gray-400 font-mono font-bold">
              Diseño de la Máquina
            </h2>
          </div>

          <StateInput
            states={states}
            startState={startState}
            acceptStates={acceptStates}
            onAddState={addState}
            onRemoveState={removeState}
            onStartChange={setStartState}
            onAcceptStatesChange={setAcceptStates}
          />

          <AlphabetInput
            symbols={alphabet}
            onAddSymbol={addSymbol}
            onRemoveSymbol={removeSymbol}
          />

          {!tableVisible && (
            <button
              id="generate-table-btn"
              type="button"
              onClick={buildTransitionTable}
              className="w-full py-2.5 bg-[#1a1e28] hover:bg-[#2a2f3d] border border-[#4f8ef7]/40 text-[#4f8ef7] hover:text-white rounded-md text-xs font-bold uppercase tracking-wider font-mono transition-all duration-200 cursor-pointer"
            >
              Generar Tabla de Transiciones →
            </button>
          )}

          {/* Barra de alertas sobre el sidebar */}
          <StatusBar status={status} />
        </aside>

        {/* COLUMNA 2: VISUALIZADOR Y TRABAJO (Main derecha, 8 de 12 cols de peso) */}
        <main className="lg:col-span-8 flex flex-col space-y-6">
          {/* Matriz de Transiciones editable */}
          {tableVisible && (
            <TransitionTable
              states={states}
              alphabet={alphabet}
              startState={startState}
              acceptStates={acceptStates}
              transitions={transitions}
              onUpdate={updateTransition}
              onConvert={convert}
              onReset={reset}
            />
          )}

          {/* Resultado de la Equivalencia (Pestañas e Interfaces de Salida) */}
          {dfaResult && nfaInput ? (
            <div className="flex-1 flex flex-col space-y-4">
              {/* Barra de Selección de Vistas (Tabs) */}
              <div className="flex items-center justify-between border-b border-[#2a2f3d] pb-2">
                <div className="flex gap-1.5 bg-[#13161e] p-1 border border-[#2a2f3d]/60 rounded-md">
                  {(['diagrams', 'table', 'analysis'] as TabType[]).map((tab) => {
                    const active = activeTab === tab;
                    const label = {
                      diagrams: 'Diagramas SVG',
                      table: 'Tabla AFD',
                      analysis: 'Análisis Teórico',
                    }[tab];

                    const icon = {
                      diagrams: <Layers className="w-3.5 h-3.5" />,
                      table: <Table className="w-3.5 h-3.5" />,
                      analysis: <BookOpen className="w-3.5 h-3.5" />,
                    }[tab];

                    return (
                      <button
                        key={`tab-btn-${tab}`}
                        type="button"
                        onClick={() => setActiveTab(tab)}
                        className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded text-xs font-mono font-semibold transition-colors cursor-pointer ${
                          active
                            ? 'bg-[#1a1e28] border border-[#2a2f3d] text-white'
                            : 'text-gray-400 hover:text-gray-200'
                        }`}
                      >
                        {icon}
                        {label}
                      </button>
                    );
                  })}
                </div>

                <span className="text-[10px] text-gray-500 font-mono hidden sm:inline">
                  Salidas Equivalentes del Autómata
                </span>
              </div>

              {/* Renders dinámicos según selección de pestaña */}
              <div className="flex-1 flex flex-col" id="rendered-output-view">
                {activeTab === 'diagrams' && (
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-stretch">
                    <AutomataDiagram
                      title="Diagrama del AFND (Original)"
                      badge="AFND"
                      badgeColor="blue"
                      states={states}
                      alphabet={alphabet}
                      transitions={transitions}
                      startState={startState}
                      acceptStates={acceptStates}
                    />
                    <AutomataDiagram
                      title="Diagrama del AFD (Equivalente)"
                      badge="AFD"
                      badgeColor="green"
                      states={dfaResult.states.map((s) => s.name)}
                      alphabet={dfaResult.alphabet}
                      transitions={dfaResult.transitions}
                      startState={dfaResult.startState}
                      acceptStates={dfaResult.acceptStates}
                    />
                  </div>
                )}

                {activeTab === 'table' && <DFAResultTable result={dfaResult} />}

                {activeTab === 'analysis' && (
                  <AnalysisPanel
                    nfaInput={nfaInput}
                    dfaResult={dfaResult}
                    validationReason={validateNFA(nfaInput).reason}
                  />
                )}
              </div>
            </div>
          ) : (
            // Pantalla de Bienvenida con Guía de Entrada
            <div className="flex-1 bg-[#13161e] border border-[#2a2f3d]/60 rounded-lg p-8 flex flex-col items-center justify-center text-center space-y-6" id="welcome-container">
              <div className="max-w-md space-y-4">
                <div className="inline-flex p-3 bg-[#1e2330] border border-[#2a2f3d] rounded text-[#4f8ef7]">
                  <Cpu className="w-8 h-8" />
                </div>
                <h2 className="text-lg font-bold font-mono tracking-tight text-white">
                  Diseñe su Autómata de Entrada
                </h2>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Para comenzar con la transformación de AFND a AFD, configure su autómata paso a paso usando los controles de la izquierda:
                </p>

                <div className="text-left bg-[#0d0f14] border border-[#2a2f3d]/40 rounded p-4 text-[11px] font-mono text-gray-300 space-y-2.5 leading-relaxed">
                  <div>
                    <span className="text-[#4f8ef7] font-bold">1. Estados:</span> Añada un conjunto de estados y determine cuál ejerce como <span className="text-green-400">inicial (q₀)</span>.
                  </div>
                  <div>
                    <span className="text-[#4f8ef7] font-bold">2. Alfabeto:</span> Registre los símbolos de transición permitidos.
                  </div>
                  <div>
                    <span className="text-[#4f8ef7] font-bold">3. Tabla de Transiciones:</span> Presione para crear la matriz de caminos, donde podrá rellenar sus combinaciones (incluyendo ε de forma nativa) y transformarlo deterministamente.
                  </div>
                </div>

                <p className="text-[11px] text-gray-500 font-sans italic">
                  O si lo prefiere, cargue nuestro ejemplo de demostración de 3 estados pulsando <span className="text-[#4f8ef7] font-mono not-italic font-bold">"Cargar Ejemplo"</span>.
                </p>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Summary Bar - Sleek Theme Footer */}
      <footer className="h-14 border-t border-[#2a2f3d] bg-[#13161e] flex items-center px-6 justify-between shrink-0 font-mono">
        <div className="flex gap-6">
          <div className="flex flex-col">
            <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">Estados del Proceso</span>
            <span className="text-xs text-slate-300">
              {dfaResult ? `${states.length} AFND → ${dfaResult.states.length} AFD` : `${states.length || 0} Estados Creados`}
            </span>
          </div>
          <div className="flex flex-col select-none">
            <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">Algoritmo</span>
            <span 
              className="text-xs text-[#4f8ef7] hover:underline cursor-pointer"
              onClick={() => dfaResult && setActiveTab('analysis')}
            >
              {dfaResult ? 'Ver Análisis de Subconjuntos ↗' : 'Construcción de Subconjuntos'}
            </span>
          </div>
        </div>
        <div className="text-[10px] text-slate-500 italic hidden sm:block">
          {dfaResult ? 'Algoritmo de Rabin-Scott ejecutado en < 1ms' : 'Listo para Modelado de Autómatas'}
        </div>
      </footer>
    </div>
  );
}
