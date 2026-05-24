// src/logic/nfaValidator.ts
import { AutomataInput, ValidationResult } from '../types/automata.types';

/**
 * Verifica que el autómata sea NO determinístico.
 * Es NFA si se cumple AL MENOS UNA condición:
 *   a) Existe alguna transición ε (clave termina en ",ε") con al menos un estado destino.
 *   b) Alguna transición δ(estado, símbolo) tiene más de un estado destino.
 */
export function validateNFA(input: AutomataInput): ValidationResult {
  // a) Transiciones épsilon (ε)
  for (const [key, targets] of Object.entries(input.transitions)) {
    if (key.endsWith(',ε') && targets && targets.length > 0) {
      return {
        isNFA: true,
        reason: `Contiene una transición épsilon (ε) desde el estado "${key.split(',')[0]}" hacia {${targets.join(', ')}}.`
      };
    }
  }

  // b) Múltiples destinos en transiciones convencionales
  for (const [key, targets] of Object.entries(input.transitions)) {
    if (targets && targets.length > 1) {
      const [state, symbol] = key.split(',');
      return {
        isNFA: true,
        reason: `La transición δ(${state}, ${symbol}) tiene múltiples estados destino: {${targets.join(', ')}}.`
      };
    }
  }

  return {
    isNFA: false,
    reason: 'Cada transición se dirige a como máximo un estado destino y no hay transiciones épsilon (ε).'
  };
}

/**
 * Valida que el input esté completo antes de intentar la conversión.
 * Retorna null si es válido, o una cadena con el error encontrado.
 */
export function validateInput(input: Partial<AutomataInput>): string | null {
  if (!input.states || input.states.length === 0) {
    return 'La lista de estados no puede estar vacía.';
  }

  if (!input.alphabet || input.alphabet.length === 0) {
    return 'El alfabeto no puede estar vacío.';
  }

  if (!input.startState || input.startState.trim() === '') {
    return 'Debe definirse un estado inicial.';
  }

  if (!input.states.includes(input.startState)) {
    return `El estado inicial "${input.startState}" no pertenece al conjunto de estados.`;
  }

  if (input.acceptStates) {
    for (const acc of input.acceptStates) {
      if (!input.states.includes(acc)) {
        return `El estado de aceptación "${acc}" no pertenece al conjunto de estados definido.`;
      }
    }
  }

  if (input.transitions) {
    for (const [key, targets] of Object.entries(input.transitions)) {
      const parts = key.split(',');
      if (parts.length !== 2) continue;
      const [state, symbol] = parts;

      if (!input.states.includes(state)) {
        return `Transición inválida para el estado principal "${state}" ya que no se encuentra definido.`;
      }

      if (symbol !== 'ε' && !input.alphabet.includes(symbol)) {
        return `El símbolo "${symbol}" no pertenece al alfabeto ni es ε (épsilon).`;
      }

      if (targets) {
        for (const t of targets) {
          if (!input.states.includes(t)) {
            return `El estado destino "${t}" en δ(${state}, ${symbol}) no pertenece al conjunto de estados.`;
          }
        }
      }
    }
  }

  return null;
}
