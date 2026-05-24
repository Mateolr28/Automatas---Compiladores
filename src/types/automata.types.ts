// src/types/automata.types.ts

export interface AutomataInput {
  states: string[];
  alphabet: string[];
  startState: string;
  acceptStates: string[];
  transitions: Record<string, string[]>;
  // clave: "estado,símbolo", valor: lista de estados destino
}

export interface DFAState {
  name: string;        // ej: "S0", "S1"
  subset: string[];    // subconjunto de estados del AFND
  isStart: boolean;
  isAccept: boolean;
}

export interface DFAResult {
  states: DFAState[];
  transitions: Record<string, string>;
  // clave: "nombre,símbolo", valor: nombre estado destino
  alphabet: string[];
  startState: string;
  acceptStates: string[];
}

export interface ValidationResult {
  isNFA: boolean;
  reason: string;
}

export type TabType = 'diagrams' | 'table' | 'analysis';

export type StatusType = 'idle' | 'ok' | 'warn' | 'error' | 'info';

export interface StatusMessage {
  type: StatusType;
  text: string;
}
