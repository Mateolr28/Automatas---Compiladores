// src/hooks/useAutomata.ts
import { useState } from 'react';
import { AutomataInput, DFAResult, StatusMessage, TabType } from '../types/automata.types';
import { validateInput, validateNFA, subsetConstruction } from '../logic';

export function useAutomata() {
  // Estado del formulario
  const [states, setStates] = useState<string[]>([]);
  const [alphabet, setAlphabet] = useState<string[]>([]);
  const [startState, setStartState] = useState<string>('');
  const [acceptStates, setAcceptStates] = useState<string[]>([]);
  const [transitions, setTransitions] = useState<Record<string, string[]>>({});

  // Estado de UI
  const [tableVisible, setTableVisible] = useState(false);
  const [status, setStatus] = useState<StatusMessage>({ type: 'idle', text: '' });
  const [activeTab, setActiveTab] = useState<TabType>('diagrams');

  // Resultado
  const [nfaInput, setNfaInput] = useState<AutomataInput | null>(null);
  const [dfaResult, setDfaResult] = useState<DFAResult | null>(null);

  // Acciones
  function addState(name: string): void {
    const trimmed = name.trim();
    if (!trimmed) return;
    if (states.includes(trimmed)) {
      setStatus({ type: 'warn', text: `El estado "${trimmed}" ya existe.` });
      return;
    }
    setStates((prev) => [...prev, trimmed]);
    setStatus({ type: 'ok', text: `Estado "${trimmed}" añadido.` });
  }

  function removeState(name: string): void {
    setStates((prev) => prev.filter((s) => s !== name));
    if (startState === name) {
      setStartState('');
    }
    setAcceptStates((prev) => prev.filter((s) => s !== name));
    setTransitions((prev) => {
      const updated = { ...prev };
      for (const key of Object.keys(updated)) {
        if (key.startsWith(`${name},`)) {
          delete updated[key];
        } else {
          updated[key] = updated[key].filter((target) => target !== name);
        }
      }
      return updated;
    });
    setNfaInput(null);
    setDfaResult(null);
    setStatus({ type: 'info', text: `Estado "${name}" eliminado.` });
  }

  function addSymbol(sym: string): void {
    const trimmed = sym.trim();
    if (!trimmed) return;
    if (trimmed === 'ε') {
      setStatus({ type: 'warn', text: 'ε no necesita agregarse al alfabeto (se puede usar en transiciones directamente).' });
      return;
    }
    if (alphabet.includes(trimmed)) {
      setStatus({ type: 'warn', text: `El símbolo "${trimmed}" ya existe.` });
      return;
    }
    setAlphabet((prev) => [...prev, trimmed]);
    setStatus({ type: 'ok', text: `Símbolo "${trimmed}" añadido.` });
  }

  function removeSymbol(sym: string): void {
    setAlphabet((prev) => prev.filter((s) => s !== sym));
    setTransitions((prev) => {
      const updated = { ...prev };
      for (const key of Object.keys(updated)) {
        if (key.endsWith(`,${sym}`)) {
          delete updated[key];
        }
      }
      return updated;
    });
    setNfaInput(null);
    setDfaResult(null);
    setStatus({ type: 'info', text: `Símbolo "${sym}" eliminado.` });
  }

  function buildTransitionTable(): void {
    if (states.length === 0) {
      setStatus({ type: 'error', text: 'Debe agregar al menos un estado.' });
      return;
    }
    if (alphabet.length === 0) {
      setStatus({ type: 'error', text: 'Debe agregar al menos un símbolo al alfabeto.' });
      return;
    }
    if (!startState) {
      setStatus({ type: 'error', text: 'Debe seleccionar un estado inicial.' });
      return;
    }
    setTableVisible(true);
    setStatus({ type: 'info', text: 'Tabla de transiciones lista para editar.' });
  }

  function updateTransition(state: string, sym: string, value: string): void {
    // Los estados destino vienen separados por comas
    const targets = value
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t !== '');

    setTransitions((prev) => ({
      ...prev,
      [`${state},${sym}`]: targets,
    }));
  }

  function convert(): void {
    const input: AutomataInput = {
      states,
      alphabet: [...alphabet, 'ε'], // Incluimos ε en el alfabeto interno por si se usa en transiciones
      startState,
      acceptStates,
      transitions,
    };

    const error = validateInput(input);
    if (error) {
      setStatus({ type: 'error', text: error });
      setDfaResult(null);
      return;
    }

    const checkNfa = validateNFA(input);

    try {
      const dfa = subsetConstruction(input);
      setNfaInput(input);
      setDfaResult(dfa);
      
      if (checkNfa.isNFA) {
        setStatus({
          type: 'ok',
          text: `¡Conversión exitosa! Es un AFND válido: ${checkNfa.reason}`,
        });
      } else {
        setStatus({
          type: 'warn',
          text: `El autómata ya era determinista: ${checkNfa.reason}. Se ha simplificado/procesado correctamente.`,
        });
      }
      setActiveTab('diagrams');
    } catch (err: any) {
      setStatus({
        type: 'error',
        text: `Error durante la construcción de subconjuntos: ${err.message || err}`,
      });
    }
  }

  function reset(): void {
    setStates([]);
    setAlphabet([]);
    setStartState('');
    setAcceptStates([]);
    setTransitions({});
    setTableVisible(false);
    setStatus({ type: 'idle', text: '' });
    setActiveTab('diagrams');
    setNfaInput(null);
    setDfaResult(null);
  }

  function loadExample(): void {
    setStates(['A', 'B', 'C']);
    setAlphabet(['0', '1']);
    setStartState('A');
    setAcceptStates(['C']);
    setTransitions({
      'A,0': ['A', 'B'],
      'A,1': ['B', 'C'],
      'B,0': ['B', 'C'],
      'B,1': [],
      'C,0': [],
      'C,1': ['C'],
    });
    setTableVisible(true);
    setNfaInput(null);
    setDfaResult(null);
    setStatus({ type: 'info', text: 'Ejemplo de prueba cargado. Presione "Convertir" para ver el resultado.' });
    setActiveTab('diagrams');
  }

  return {
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
    setTableVisible,
    setStatus,
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
  };
}
