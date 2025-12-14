/**
 * @module interfaz/menuHelpers
 * @description Funciones helper reutilizables para el sistema de menús.
 * 
 * Este módulo proporciona utilidades para:
 * - Crear resultados de menú de forma consistente
 * - Generar líneas de menús secundarios
 * - Mostrar menús formateados
 * 
 * Separación de responsabilidades:
 * - Funciones puras: crearResultado*, generarLineasMenu
 * - Funciones con I/O: mostrarLineasMenu
 */

import type { Task } from "../../../core/type.ts";
import type { MenuActionResult } from "./actions.ts";
import { mensaje, clearMensaje } from "../../mensajes.ts";

// ============================================================================
// CONSTRUCTORES DE RESULTADOS (FUNCIONES PURAS)
// ============================================================================

/**
 * Crea un resultado de menú sin modificar la lista de tareas.
 * 
 * @param listaTareas - La lista de tareas actual (sin cambios)
 * @param continuarEjecucion - Si debe continuar el ciclo del menú (default: true)
 * @returns Resultado indicando continuar sin cambios
 * 
 * @example
 * ```typescript
 * return crearResultadoSinCambios(listaTareas); // Continuar
 * return crearResultadoSinCambios(listaTareas, false); // Salir
 * ```
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
 * Crea un resultado de menú con una lista de tareas actualizada.
 * 
 * @param listaActualizada - La nueva lista de tareas (con cambios)
 * @param continuarEjecucion - Si debe continuar el ciclo del menú (default: true)
 * @returns Resultado con la lista actualizada
 * 
 * @example
 * ```typescript
 * const nueva = [...tareas, nuevaTarea];
 * return crearResultadoConCambios(nueva);
 * ```
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

// ============================================================================
// GENERACIÓN DE MENÚS SECUNDARIOS (FUNCIONES PURAS)
// ============================================================================

/**
 * Función pura que genera las líneas de un menú secundario.
 * 
 * @param titulo - El título del menú
 * @param opciones - Las opciones del menú (sin incluir "volver")
 * @param opcionVolver - Texto de la opción para volver (default: "0- Volver")
 * @returns Array inmutable de líneas del menú
 * 
 * @example
 * ```typescript
 * const lineas = generarLineasMenu(
 *   "¿Qué deseas ver?",
 *   ["1- Todas", "2- Pendientes", "3- En curso"]
 * );
 * // ["¿Qué deseas ver?", "1- Todas", "2- Pendientes", "3- En curso", "0- Volver"]
 * ```
 */
export function generarLineasMenu(
    titulo: string,
    opciones: readonly string[],
    opcionVolver: string = "0- Volver"
): readonly string[] {
    return [titulo, ...opciones, opcionVolver];
}

// ============================================================================
// PRESENTACIÓN DE MENÚS (I/O)
// ============================================================================

/**
 * Muestra un menú en consola (con efectos secundarios).
 * Limpia la pantalla antes de mostrar las líneas.
 * 
 * @param lineas - Las líneas del menú a mostrar
 * 
 * @example
 * ```typescript
 * const lineas = generarLineasMenu("Título", ["1- Opción A"]);
 * mostrarLineasMenu(lineas);
 * ```
 */
export function mostrarLineasMenu(lineas: readonly string[]): void {
    clearMensaje();
    lineas.forEach(linea => mensaje(linea));
}