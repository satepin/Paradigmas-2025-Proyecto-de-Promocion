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

import type { Task } from "../../../core/type.ts";
import type { MainMenuResult } from "./core.ts";
import { mostrarMenuPrincipal } from "../funciones/renderer.ts";
import { procesarOpcionMenu, solicitarOpcionMenu } from "./core.ts";
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