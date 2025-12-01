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
 * Muestra el menú de opciones de visualización y obtiene la selección del usuario.
 * Responsabilidad: Presentar opciones y capturar input.
 * @returns Opción seleccionada (0-4)
 */
function mostrarMenuVerYObtenerOpcion(): number {
    clearMensaje('¿Que tareas deseas ver?\n1- Todas\n2- Pendientes\n3- En curso\n4- Terminadas\n0- Volver');
    return menuPrompt("Elige una opcion: ", 0, 4);
}

/**
 * Filtra tareas según la opción y las muestra en formato listado.
 * Responsabilidad: Filtrar y delegar presentación.
 * @param tareas - Lista de tareas
 * @param opcion - Opción de filtrado seleccionada
 */
function filtrarYMostrarListado(tareas: readonly Task[], opcion: number): void {
    const filtradas = filtrarPorOpcion(tareas, opcion);
    listado(filtradas, opcion);
}

/**
 * Orquesta el menú de visualización de tareas (con efectos secundarios de I/O).
 * Responsabilidad: Coordinar flujo de visualización.
 * @param {Task[]} tareas - La lista completa de tareas a filtrar.
 * @returns {void}
 */
export function ver(tareas: readonly Task[]): void {
    const opcion = mostrarMenuVerYObtenerOpcion();
    
    if (opcion === 0) { 
        return; 
    }
    
    filtrarYMostrarListado(tareas, opcion);
}