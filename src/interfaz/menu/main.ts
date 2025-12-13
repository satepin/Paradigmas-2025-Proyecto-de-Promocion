/**
 * @module interfaz/mainMenu
 * @description Punto de entrada del menú principal de la aplicación.
 * 
 * Este módulo orquesta el flujo completo del menú:
 * 1. Muestra el menú formateado
 * 2. Captura la selección del usuario
 * 3. Procesa la acción correspondiente
 * 4. Retorna el nuevo estado de la aplicación
 */

import type { Task } from "../../core/type.ts";
import { menuPrompt } from "../../core/tools/modulos/promptSync.ts";
import { mensaje } from "../mensajes.ts";
import { formatearMenuPrincipal } from "./renderer.ts";
import { obtenerAccionPorOpcion } from "./actions.ts";

// ============================================================================
// TIPOS
// ============================================================================

/**
 * Resultado del procesamiento del menú principal.
 * Representa el nuevo estado de la aplicación después de ejecutar una acción.
 */
export type MainMenuResult = {
    readonly continuarEjecucion: boolean;
    readonly listaTareasActualizada: readonly Task[];
};

// ============================================================================
// FUNCIONES DE PRESENTACIÓN (I/O)
// ============================================================================

/**
 * Muestra el menú principal formateado en la consola.
 * @param username - Nombre del usuario
 */
function mostrarMenuPrincipal(username: string): void {
    const lineasMenu = formatearMenuPrincipal(username);
    lineasMenu.forEach(linea => mensaje(linea));
}

/**
 * Solicita al usuario seleccionar una opción del menú.
 * @returns Índice de la opción seleccionada (0-8)
 */
function solicitarOpcionMenu(): number {
    return menuPrompt("", 0, 8);
}

// ============================================================================
// PROCESAMIENTO DE ACCIONES
// ============================================================================

/**
 * Función que procesa la opción del menú y retorna el nuevo estado.
 * @param listaTareas - La lista actual de tareas
 * @param opcion - La opción seleccionada por el usuario (0-8)
 * @returns El nuevo estado de la aplicación
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

// ============================================================================
// FUNCIÓN PRINCIPAL DEL MENÚ
// ============================================================================

/**
 * Orquesta el flujo completo del menú principal.
 * 
 * Flujo de ejecución:
 * 1. Muestra el menú al usuario
 * 2. Captura la opción seleccionada
 * 3. Procesa la acción correspondiente
 * 4. Retorna el resultado con el estado actualizado
 * 
 * @param listaTareas - La lista actual de tareas
 * @param username - El nombre del usuario
 * @returns El resultado con el nuevo estado de la aplicación
 */
export function mainMenu(
    listaTareas: readonly Task[],
    username: string
): MainMenuResult {
    mostrarMenuPrincipal(username);
    const menuIndex = solicitarOpcionMenu();
    return procesarOpcionMenu(listaTareas, menuIndex);
}