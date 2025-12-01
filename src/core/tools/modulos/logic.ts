/**
 * @module tools/modulos/logic
 * @description Re-exporta funciones de la biblioteca logicjs para programación lógica.
 */
import * as logic from 'logicjs';

const lvar = logic.lvar,
  eq = logic.eq,
  and = logic.and,
  or = logic.or,
  run = logic.run;

export { lvar, eq, and, or, run };