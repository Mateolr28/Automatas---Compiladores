// src/logic/subsetConstruction.ts
import { AutomataInput, DFAResult, DFAState } from '../types/automata.types';
import { epsilonClosure, move } from './epsilonClosure';

/**
 * Algoritmo de construcción de subconjuntos para convertir un AFND en AFD:
 * 1. Filtrar símbolos reales (excluir ε del alfabeto de trabajo).
 * 2. Estado inicial del AFD = ε-clausura({startState}).
 * 3. Cola de procesamiento: empezar con el estado inicial.
 * 4. Para cada estado en cola y cada símbolo:
 *    a. Calcular move(subset, símbolo)
 *    b. Aplicar ε-clausura al resultado
 *    c. Si el conjunto no existe, agregarlo como nuevo estado
 * 5. Estado muerto (∅) si el resultado es vacío.
 * 6. Un estado del AFD es de aceptación si su subconjunto contiene al menos un estado de aceptación del AFND.
 * 7. Nombrar estados como S0, S1, S2... (S0 = estado inicial).
 */
export function subsetConstruction(input: AutomataInput): DFAResult {
  // 1. Filtrar símbolos de alfabeto de trabajo (excluyendo 'ε')
  const dfaAlphabet = input.alphabet.filter((sym) => sym !== 'ε');

  // 2. Estado inicial de AFD = ε-clausura de startState
  const initialSubset = epsilonClosure([input.startState], input.transitions);
  const initialKey = initialSubset.join(',');

  const subsetMap = new Map<string, string>(); // subsetKey -> DFA state name
  const statesList: DFAState[] = [];
  const processedKeys = new Set<string>();

  // S0 es el estado inicial
  subsetMap.set(initialKey, 'S0');
  statesList.push({
    name: 'S0',
    subset: initialSubset,
    isStart: true,
    isAccept: initialSubset.some((state) => input.acceptStates.includes(state)),
  });

  let stateCounter = 1;
  const queue: string[][] = [initialSubset];
  const transitions: Record<string, string> = {};

  while (queue.length > 0) {
    const currentSubset = queue.shift()!;
    const currentKey = currentSubset.join(',');
    const currentName = subsetMap.get(currentKey)!;

    if (processedKeys.has(currentKey)) {
      continue;
    }
    processedKeys.add(currentKey);

    for (const symbol of dfaAlphabet) {
      const moved = move(currentSubset, symbol, input.transitions);
      const closure = epsilonClosure(moved, input.transitions);
      const closureKey = closure.join(',');

      let destName = '';

      if (closure.length === 0) {
        // 5. Estado muerto (∅) si el resultado es vacío.
        destName = '∅';
        if (!subsetMap.has('')) {
          subsetMap.set('', '∅');
          statesList.push({
            name: '∅',
            subset: [],
            isStart: false,
            isAccept: false,
          });
        }
      } else {
        if (!subsetMap.has(closureKey)) {
          const newName = `S${stateCounter++}`;
          subsetMap.set(closureKey, newName);
          statesList.push({
            name: newName,
            subset: closure,
            isStart: false,
            isAccept: closure.some((state) => input.acceptStates.includes(state)),
          });
          queue.push(closure);
        }
        destName = subsetMap.get(closureKey)!;
      }

      transitions[`${currentName},${symbol}`] = destName;
    }
  }

  // Si existe el estado muerto (∅), añadir transiciones bucle para todos los símbolos
  if (subsetMap.has('')) {
    for (const symbol of dfaAlphabet) {
      transitions[`∅,${symbol}`] = '∅';
    }
  }

  const startState = 'S0';
  const acceptStates = statesList
    .filter((state) => state.isAccept)
    .map((state) => state.name);

  return {
    states: statesList,
    transitions,
    alphabet: dfaAlphabet,
    startState,
    acceptStates,
  };
}
