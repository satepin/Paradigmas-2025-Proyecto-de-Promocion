/**
 * @module tools/ver/ver
 * @description Proporciona un menú para filtrar y ver tareas.
 */

import { menuPrompt } from '../input/promptSync.js';
import { listado } from './listado.js';
import type { Task, TaskStatus } from '../../type.js';

/**
 * Función pura que filtra tareas por estado.
 * @param {readonly Task[]} tareas - La lista de tareas a filtrar.
 * @param {TaskStatus} estado - El estado por el cual filtrar.
 * @returns {readonly Task[]} Las tareas filtradas.
 */
export function filtrarPorEstado(
    tareas: readonly Task[],
    estado: TaskStatus
): readonly Task[] {
    return tareas.filter(t => t.estado === estado);
}

/**
 * Función pura que filtra tareas según la opción del menú.
 * @param {readonly Task[]} tareas - La lista de tareas a filtrar.
 * @param {number} opcion - La opción del menú (1=Todas, 2=Pendientes, 3=En curso, 4=Terminadas).
 * @returns {readonly Task[]} Las tareas filtradas.
 */
export function filtrarPorOpcion(
    tareas: readonly Task[],
    opcion: number
): readonly Task[] {
    switch(opcion) {
        case 1: return tareas;
        case 2: return filtrarPorEstado(tareas, 'pendiente');
        case 3: return filtrarPorEstado(tareas, 'en curso');
        case 4: return filtrarPorEstado(tareas, 'completada');
        default: return [];
    }
}

/**
 * Orquesta el menú de visualización de tareas (con efectos secundarios de I/O).
 * @param {Task[]} tareas - La lista completa de tareas a filtrar.
 * @returns {void}
 */
export function ver(tareas: readonly Task[]): void {
    console.clear();
    console.log("¿Que tareas deseas ver?");
    console.log("1- Todas");
    console.log("2- Pendientes");
    console.log("3- En curso");
    console.log("4- Terminadas");
    console.log("0- Volver");
    
    const opcion: number = menuPrompt("Elige una opcion: ", 0, 4);
    if (opcion === 0) { return; }
    
    const filtradas = filtrarPorOpcion(tareas, opcion);
    listado(filtradas, opcion);
}