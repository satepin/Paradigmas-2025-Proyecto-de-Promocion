/**
 * @module tools/ver/ver
 * @description Proporciona un menú para filtrar y ver tareas.
 */

import { menuPrompt } from '../modulos/promptSync.ts';
import { listado } from './listado.ts';
import type { Task } from '../../type.ts';
import { filtrarPorOpcion } from './busqueda/filtro.ts';
import { clearMensaje } from '../../../interfaz/mensajes.ts';

/**
 * Función pura que filtra tareas por estado.
 * @param {readonly Task[]} tareas - La lista de tareas a filtrar.
 * @param {TaskStatus} estado - El estado por el cual filtrar.
 * @returns {readonly Task[]} Las tareas filtradas.
 */

/**
 * Orquesta el menú de visualización de tareas (con efectos secundarios de I/O).
 * @param {Task[]} tareas - La lista completa de tareas a filtrar.
 * @returns {void}
 */
export function ver(tareas: readonly Task[]): void {
    clearMensaje('¿Que tareas deseas ver?\n1- Todas\n2- Pendientes\n3- En curso\n4- Terminadas\n0- Volver');
    
    const opcion: number = menuPrompt("Elige una opcion: ", 0, 4);
    if (opcion === 0) { return; }
    
    const filtradas = filtrarPorOpcion(tareas, opcion);
    listado(filtradas, opcion);
}