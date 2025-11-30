/**
 * @module interfaz/mainMenu
 * @description Entry point del menú principal de la aplicación.
 */

import { menuPrompt } from "../core/tools/modulos/promptSync.ts";
import { formatearMenuPrincipal } from "./menuRenderer.ts";
import { obtenerAccionPorOpcion, type MenuActionResult } from "./menuActions.ts";
import type { Task } from '../core/type.ts';

/**
 * Tipo para el resultado del menú principal.
 */
export type MainMenuResult = {
    readonly continuarEjecucion: boolean;
    readonly listaTareasActualizada: readonly Task[];
};

/**
 * Función pura que procesa la opción del menú y retorna el nuevo estado.
 * @param {readonly Task[]} listaTareas - La lista actual de tareas.
 * @param {number} opcion - La opción seleccionada por el usuario.
 * @returns {MainMenuResult} El nuevo estado de la aplicación.
 */
export function procesarOpcionMenu(
    listaTareas: readonly Task[],
    opcion: number
): MainMenuResult {
    const accion = obtenerAccionPorOpcion(opcion);
    const resultado = accion(listaTareas);
    return {
        continuarEjecucion: resultado.continuarEjecucion,
        listaTareasActualizada: resultado.listaTareasActualizada
    };
}

/**
 * Orquesta el menú principal (con efectos secundarios de I/O).
 * @param {readonly Task[]} listaTareas - La lista de tareas.
 * @param {string} username - El nombre del usuario.
 * @returns {MainMenuResult} El resultado con el estado actualizado.
 */
export function mainMenu(
    listaTareas: readonly Task[],
    username: string
): MainMenuResult {
    formatearMenuPrincipal(username).forEach(linea => console.log(linea));
    const menuIndex: number = menuPrompt("", 0, 7);
    return procesarOpcionMenu(listaTareas, menuIndex);
}