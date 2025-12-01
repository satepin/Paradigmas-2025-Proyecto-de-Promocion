/**
 * @module tools/ver/listado
 * @description Muestra una lista de tareas y permite al usuario seleccionar una para ver sus detalles.
 */

import { menuPrompt, prompt } from "../modulos/promptSync.ts";
import type { Task } from '../../type.ts';
import { formatearTarea } from './detalles.ts';
import { clearMensaje, mensaje, pausaMensaje } from "../../../interfaz/mensajes.ts";

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
 * Función pura que ordena tareas alfabéticamente por título.
 * @param tareas - Tareas a ordenar
 * @returns Tareas ordenadas
 */
function ordenarTareasPorTitulo(tareas: readonly Task[]): readonly Task[] {
    return [...tareas].sort((a, b) => a.titulo.localeCompare(b.titulo));
}

/**
 * Muestra la etiqueta de resultados si existe.
 * Responsabilidad: Presentar encabezado de resultados.
 * @param etiqueta - Etiqueta opcional
 */
function mostrarEtiquetaResultados(etiqueta: string | number): void {
    if (etiqueta) {
        mensaje(`\nResultados para: ${etiqueta}`);
    }
}

/**
 * Muestra la lista de tareas formateadas en consola.
 * Responsabilidad: Presentar lista de tareas.
 * @param tareas - Tareas a mostrar (ya ordenadas)
 */
function mostrarListaTareas(tareas: readonly Task[]): void {
    const lineasFormateadas = formatearListaTareas(tareas);
    lineasFormateadas.forEach(linea => mensaje(linea));
    mensaje("\n¿Deseas ver los detalles de alguna?");
}

/**
 * Solicita al usuario elegir una tarea y devuelve el índice.
 * Responsabilidad: Capturar selección del usuario.
 * @param cantidadTareas - Cantidad de tareas disponibles
 * @returns Índice seleccionado (0 para cancelar)
 */
function solicitarSeleccionTarea(cantidadTareas: number): number {
    return menuPrompt("Introduce el número de la tarea a ver o 0 para volver: ", 0, cantidadTareas);
}

/**
 * Muestra los detalles de una tarea seleccionada.
 * Responsabilidad: Presentar detalles de tarea.
 * @param tarea - Tarea a mostrar
 */
function mostrarDetallesTarea(tarea: Task): void {
    clearMensaje();
    const detalles = formatearTarea(tarea);
    mensaje(detalles);
    pausaMensaje();
}

/**
 * Permite al usuario elegir una tarea de la lista para ver sus detalles.
 * Responsabilidad: Orquestar flujo de selección y visualización.
 * @param {Task[]} tareas - La lista de tareas de la que elegir.
 * @private
 */
function elegir(tareas: readonly Task[]): void {
    const index = solicitarSeleccionTarea(tareas.length);
    
    if (index === 0) {
        return;
    }
    
    const tareaSeleccionada = obtenerTareaPorIndice(tareas, index);
    if (tareaSeleccionada) {
        mostrarDetallesTarea(tareaSeleccionada);
    }
}

/**
 * Muestra una lista de tareas en la consola y permite seleccionar una.
 * Responsabilidad: Orquestar flujo de listado.
 * @param {Task[]} tareas - La lista de tareas a mostrar.
 * @param {string | number} [etiqueta=''] - Una etiqueta opcional para mostrar sobre la lista.
 * @returns {void}
 */
export function listado(tareas: readonly Task[], etiqueta: string | number = ''): void {
    mostrarEtiquetaResultados(etiqueta);
    
    if (!Array.isArray(tareas) || tareas.length === 0) {
        mensaje('No hay tareas para mostrar.');
        return;
    }

    const tareasOrdenadas = ordenarTareasPorTitulo(tareas);
    mostrarListaTareas(tareasOrdenadas);
    elegir(tareasOrdenadas);
}