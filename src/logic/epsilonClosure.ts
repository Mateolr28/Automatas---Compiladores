// src/logic/epsilonClosure.ts

/**
 * Calcula la ε-clausura de un conjunto de estados.
 * Usa una pila (stack) para explorar todas las transiciones ε
 * alcanzables desde cada estado del conjunto.
 * Retorna el conjunto ordenado alfabéticamente sin duplicados.
 */
export function epsilonClosure(
  states: string[],
  transitions: Record<string, string[]>
): string[] {
  const result = new Set<string>(states);
  const stack = [...states];

  while (stack.length > 0) {
    const currentState = stack.pop()!;
    // Las transiciones epsilon terminan con ,ε
    const key = `${currentState},ε`;
    const nextStates = transitions[key] || [];

    for (const s of nextStates) {
      if (!result.has(s)) {
        result.add(s);
        stack.push(s);
      }
    }
  }

  return Array.from(result).sort();
}

/**
 * Calcula el conjunto de estados alcanzables desde 'states'
 * consumiendo exactamente el símbolo 'symbol'.
 * Clave de transición: "estado,símbolo"
 */
export function move(
  states: string[],
  symbol: string,
  transitions: Record<string, string[]>
): string[] {
  const result = new Set<string>();

  for (const state of states) {
    const key = `${state},${symbol}`;
    const nextStates = transitions[key] || [];
    for (const s of nextStates) {
      result.add(s);
    }
  }

  return Array.from(result).sort();
}
