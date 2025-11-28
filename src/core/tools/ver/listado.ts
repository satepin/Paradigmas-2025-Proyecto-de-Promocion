/**
 * @module tools/ver/listado
 * @description Muestra una lista de tareas y permite al usuario seleccionar una para ver sus detalles.
 */

import { menuPrompt, prompt } from "../modulos/promptSync.ts";
import type { Task } from '../../type.ts';
import { formatearTarea } from './detalles.ts';

/**
 * Función pura que formatea una lista de tareas como strings para mostrar.
 * @param {readonly Task[]} tareas - La lista de tareas a formatear.
 * @returns {readonly string[]} Array de strings con el formato "[n] - titulo".
 */
export function formatearListaTareas(tareas: readonly Task[]): readonly string[] {
    return tareas.map((t, i) => `[${i + 1}] - ${t.titulo}`);
}

/**
 * Función pura que obtiene una tarea por índice (base 1).
 * @param {readonly Task[]} tareas - La lista de tareas.
 * @param {number} indice - El índice (empezando en 1).
 * @returns {Task | undefined} La tarea seleccionada o undefined.
 */
export function obtenerTareaPorIndice(
    tareas: readonly Task[],
    indice: number
): Task | undefined {
    if (indice < 1 || indice > tareas.length) return undefined;
    return tareas[indice - 1];
}

/**
 * Muestra una lista de tareas en la consola y permite seleccionar una.
 * @param {Task[]} tareas - La lista de tareas a mostrar.
 * @param {string | number} [etiqueta=''] - Una etiqueta opcional para mostrar sobre la lista.
 * @returns {void}
 */
export function listado(tareas: readonly Task[], etiqueta: string | number = ''): void {
    if (etiqueta) console.log(`\nResultados para: ${etiqueta}`);
    if (!Array.isArray(tareas) || tareas.length === 0) {
        console.log('No hay tareas para mostrar.');
        return;
    }
    
    const lineasFormateadas = formatearListaTareas(tareas);
    lineasFormateadas.forEach(linea => console.log(linea));
    
    console.log("\n¿Deseas ver los detalles de alguna?");
    elegir(tareas);
}

/**
 * Permite al usuario elegir una tarea de la lista para ver sus detalles.
 * @param {Task[]} tareas - La lista de tareas de la que elegir.
 * @private
 */
function elegir(tareas: readonly Task[]): void {
    const index: number = menuPrompt("Introduce el número de la tarea a ver o 0 para volver: ", 0, tareas.length);
    if (index === 0) return;
    
    const tareaSeleccionada = obtenerTareaPorIndice(tareas, index);
    if (tareaSeleccionada) {
        console.clear();
        const detalles = formatearTarea(tareaSeleccionada);
        console.log(detalles);
        console.log("\nPresiona cualquier tecla para continuar...");
        prompt("", { maxLength: 100, puedeVacio: true });
    }
}