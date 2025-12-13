/**
 * @module tools/ver/buscar
 * @description Permite al usuario buscar tareas por título.
 */

import { prompt } from '../../modulos/promptSync.ts'; 
import { taskFlags } from '../../validaciones.ts'; 
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
 * Solicita al usuario un término de búsqueda.
 * Responsabilidad: Capturar entrada del usuario.
 * @returns Término de búsqueda introducido
 */
function solicitarTerminoBusqueda(): string {
    clearMensaje("Buscar Tarea");
    return prompt("Introduce el titulo de una tarea para buscarla: ", taskFlags.titulo);
}

/**
 * Muestra los resultados de la búsqueda o un mensaje si no hay coincidencias.
 * Responsabilidad: Presentar resultados.
 * @param resultados - Tareas encontradas
 * @param busqueda - Término de búsqueda usado
 */
function mostrarResultadosBusqueda(resultados: readonly Task[], busqueda: string): void {
    if (resultados.length > 0) {
        listado(resultados, busqueda);
    } else {
        mensaje("\nNo hay tareas relacionadas con la busqueda");
    }
}

/**
 * Orquesta la búsqueda de tareas (con efectos secundarios de I/O).
 * Responsabilidad: Coordinar flujo de búsqueda.
 * @param {Task[]} listaTareas - La lista de tareas en la que buscar.
 * @returns {void}
 */
export function buscar(listaTareas: readonly Task[]): void {
    const busqueda = solicitarTerminoBusqueda();
    const resultados = filtrarPorTitulo(listaTareas, busqueda);
    mostrarResultadosBusqueda(resultados, busqueda);
    //presione cualquier tecla para continuar...
}