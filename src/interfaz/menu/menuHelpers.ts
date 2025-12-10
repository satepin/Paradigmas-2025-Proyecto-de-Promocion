/**
 * @module interfaz/menuHelpers
 * @description Funciones helper puras y reutilizables para construcción de resultados de menú.
 */

import type { Task } from "../../core/type.ts";
import type { MenuActionResult } from "./menuActions.ts";
import { mensaje, clearMensaje } from "../mensajes.ts";

/**
 * Función pura que crea un resultado de menú sin cambios.
 * @param {readonly Task[]} listaTareas - La lista de tareas actual.
 * @param {boolean} continuarEjecucion - Si debe continuar la ejecución (default: true).
 * @returns {MenuActionResult} Resultado sin modificar la lista.
 */
export function crearResultadoSinCambios(
    listaTareas: readonly Task[],
    continuarEjecucion: boolean = true
): MenuActionResult {
    return {
        continuarEjecucion,
        listaTareasActualizada: listaTareas
    };
}

/**
 * Función pura que crea un resultado de menú con lista actualizada.
 * @param {readonly Task[]} listaActualizada - La lista de tareas actualizada.
 * @param {boolean} continuarEjecucion - Si debe continuar la ejecución (default: true).
 * @returns {MenuActionResult} Resultado con la lista actualizada.
 */
export function crearResultadoConCambios(
    listaActualizada: readonly Task[],
    continuarEjecucion: boolean = true
): MenuActionResult {
    return {
        continuarEjecucion,
        listaTareasActualizada: listaActualizada
    };
}

/**
 * Función pura que genera las líneas de un menú de opciones.
 * @param {string} titulo - El título del menú.
 * @param {readonly string[]} opciones - Las opciones del menú.
 * @param {string} opcionVolver - Texto de la opción para volver (default: "0- Volver").
 * @returns {readonly string[]} Array de líneas del menú.
 */
export function generarLineasMenu(
    titulo: string,
    opciones: readonly string[],
    opcionVolver: string = "0- Volver"
): readonly string[] {
    return [titulo, ...opciones, opcionVolver];
}

/**
 * Función helper que muestra un menú en consola (I/O).
 * @param {readonly string[]} lineas - Las líneas del menú a mostrar.
 * @returns {void}
 */
export function prepararLineasMenuParaMostrar(
    lineas: readonly string[]
): string {
    return lineas.join('\n');
}

export function mostrarLineasMenu(lineas: readonly string[]): void {
    clearMensaje();
    const contenido = prepararLineasMenuParaMostrar(lineas);
    mensaje(contenido);
}
