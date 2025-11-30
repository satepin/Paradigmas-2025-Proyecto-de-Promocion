/**
 * @module tools/ver/buscar
 * @description Permite al usuario buscar tareas por título.
 */

import { prompt } from '../../modulos/promptSync.ts'; 
import { taskFlags } from '../../../task.ts'; 
import { listado } from '../listado.ts';
import type { Task } from '../../../type.ts';
import { mensaje, clearMensaje } from '../../../../interfaz/mensajes.ts';
import { filtrarPorTitulo } from './filtro.ts';

/**
 * Función pura que filtra tareas por término de búsqueda en el título.
 * @param {readonly Task[]} listaTareas - La lista de tareas en la que buscar.
 * @param {string} terminoBusqueda - El término a buscar en los títulos.
 * @returns {readonly Task[]} Las tareas que coinciden con la búsqueda.
 */

/**
 * Orquesta la búsqueda de tareas (con efectos secundarios de I/O).
 * @param {Task[]} listaTareas - La lista de tareas en la que buscar.
 * @returns {void}
 */
export function buscar(listaTareas: readonly Task[]): void {
    clearMensaje("Buscar Tarea");
    const busqueda: string = prompt("Introduce el titulo de una tarea para buscarla: ", taskFlags.titulo);
    
    const resultados = filtrarPorTitulo(listaTareas, busqueda);
    
    if (resultados.length > 0) {
        listado(resultados, busqueda);
    } else {
        mensaje("\nNo hay tareas relacionadas con la busqueda");
    }
    //presione cualquier tecla para continuar...
}