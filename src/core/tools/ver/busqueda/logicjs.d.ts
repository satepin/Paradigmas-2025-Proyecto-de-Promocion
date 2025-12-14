/**
 * Declaraciones de tipo para logicjs-es6
 * Basado en la API de logicjs (miniKanren en JavaScript)
 */

declare module 'logicjs-es6' {
  /**
   * Representa un objetivo lógico en logicjs
   */
  export interface Goal {
    (s: Substitution): Stream;
  }

  /**
   * Sustituciones (variable bindings)
   */
  export type Substitution = any;

  /**
   * Stream de sustituciones (lazy sequence)
   */
  export type Stream = any;

  /**
   * Variable lógica
   */
  export class Var {
    constructor(name: string);
    name: string;
  }

  /**
   * Crea una nueva variable lógica
   * @param name - Nombre de la variable
   * @returns Variable lógica
   */
  export function variable(name: string): Var;

  /**
   * Unificación: establece que dos valores son iguales
   * @param a - Primer valor
   * @param b - Segundo valor
   * @returns Goal que unifica a con b
   */
  export function eq(a: any, b: any): Goal;

  /**
   * Pertenencia: verifica si un valor está en una lista (lista concreta)
   * @param x - Valor a buscar
   * @param list - Lista donde buscar
   * @returns Goal que verifica pertenencia
   */
  export function member(x: any, list: any[]): Goal;

  /**
   * Pertenencia relacional: verifica pertenencia en listas lógicas
   * @param x - Valor o variable a buscar
   * @param list - Lista (puede contener variables)
   * @returns Goal que verifica pertenencia relacional
   */
  export function membero(x: any, list: any): Goal;

  /**
   * Conjunción: combina múltiples objetivos (AND lógico)
   * @param goals - Objetivos a combinar
   * @returns Goal combinado
   */
  export function conj(...goals: Goal[]): Goal;

  /**
   * Disyunción: alternativas de objetivos (OR lógico)
   * @param goals - Objetivos alternativos
   * @returns Goal con alternativas
   */
  export function disj(...goals: Goal[]): Goal;

  /**
   * Condicional lógico: if-then-else
   * @param testGoal - Objetivo de prueba
   * @param thenGoal - Objetivo si se cumple
   * @param elseGoal - Objetivo si no se cumple
   * @returns Goal condicional
   */
  export function conde(...clauses: Goal[][]): Goal;

  /**
   * Define un objetivo fresh (con variables frescas)
   * @param varNames - Nombres de variables frescas
   * @param goalFn - Función que retorna un Goal con las variables
   * @returns Goal con variables frescas
   */
  export function fresh(varNames: string[], goalFn: (...vars: Var[]) => Goal): Goal;

  /**
   * Ejecuta una consulta lógica
   * @param vars - Variables a consultar (Var o array de Var)
   * @param goal - Objetivo lógico a ejecutar
   * @returns Array de sustituciones (resultados)
   */
  export function run(vars: Var | Var[], goal: Goal): any[];

  /**
   * Ejecuta una consulta con límite de resultados
   * @param limit - Número máximo de resultados
   * @param vars - Variables a consultar
   * @param goal - Objetivo lógico
   * @returns Array de sustituciones limitados
   */
  export function runN(limit: number, vars: Var | Var[], goal: Goal): any[];

  /**
   * Appendo: concatena dos listas
   * @param l1 - Primera lista
   * @param l2 - Segunda lista
   * @param l3 - Lista resultado
   * @returns Goal que relaciona las tres listas
   */
  export function appendo(l1: any, l2: any, l3: any): Goal;

  /**
   * Lengtho: relaciona una lista con su longitud
   * @param list - Lista
   * @param length - Longitud
   * @returns Goal que relaciona lista y longitud
   */
  export function lengtho(list: any, length: any): Goal;

  /**
   * Everyo: verifica que todos los elementos cumplan un predicado
   * @param pred - Predicado (Goal)
   * @param list - Lista a verificar
   * @returns Goal que verifica el predicado para todos
   */
  export function everyo(pred: (x: any) => Goal, list: any): Goal;

  /**
   * Succeeds: un objetivo que siempre se cumple
   * @returns Goal que siempre unifica
   */
  export function succeed(): Goal;

  /**
   * Fails: un objetivo que nunca se cumple
   * @returns Goal que siempre falla
   */
  export function fail(): Goal;

  /**
   * Delay: aplaza la evaluación de un objetivo
   * @param goal - Objetivo a aplazar
   * @returns Goal aplazado
   */
  export function delay(goal: Goal): Goal;

  /**
   * Proyecto: extrae valores de variables en sustituciones
   * @param vars - Variables a proyectar
   * @param subs - Sustituciones
   * @returns Valores proyectados
   */
  export function project(vars: Var[], subs: Substitution): any[];

  /**
   * Walk: camina/resuelve una estructura con sustituciones
   * @param x - Valor a resolver
   * @param subs - Sustituciones
   * @returns Valor resuelto
   */
  export function walk(x: any, subs: Substitution): any;

  /**
   * Unify: unifica dos valores manualmente
   * @param x - Primer valor
   * @param y - Segundo valor
   * @param subs - Sustituciones existentes
   * @returns Nuevas sustituciones si unifica, false si no
   */
  export function unify(x: any, y: any, subs: Substitution): Substitution | false;

  /**
   * Occurso: verifica que una variable ocurra en una estructura
   * @param needle - Valor a buscar
   * @param haystack - Estructura donde buscar
   * @returns Goal que verifica ocurrencia
   */
  export function occurso(needle: any, haystack: any): Goal;

  /**
   * Objeto con todas las funciones exportadas
   */
  const logicjs: {
    variable: typeof variable;
    eq: typeof eq;
    member: typeof member;
    membero: typeof membero;
    conj: typeof conj;
    disj: typeof disj;
    conde: typeof conde;
    fresh: typeof fresh;
    run: typeof run;
    runN: typeof runN;
    appendo: typeof appendo;
    lengtho: typeof lengtho;
    everyo: typeof everyo;
    succeed: typeof succeed;
    fail: typeof fail;
    delay: typeof delay;
    project: typeof project;
    walk: typeof walk;
    unify: typeof unify;
    occurso: typeof occurso;
    Var: typeof Var;
  };

  export default logicjs;
}