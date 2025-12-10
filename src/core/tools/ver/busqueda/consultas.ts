// Mane: Este archivo es el mejor para meterle paradigma logico, imo

import { listado } from '../listado.ts';
import type { Task, TaskStatus } from '../../../type.ts';
import { mensaje, pausaMensaje } from "../../../../interfaz/mensajes.ts";

/**
 * Función pura que filtra tareas prioritarias.
 * Se consideran prioritarias las tareas pendientes y en curso que expiran en 3 días o menos.
 * @param tareas - Lista de tareas
 * @param fechaReferencia - Fecha de referencia (default: ahora)
 * @returns Tareas prioritarias filtradas
 */

function esVencidoEnProximo(tarea: Task, dias: number, fechaReferencia: Date): boolean {
    if (tarea.vencimiento === null) {
        return false;
    }
    const limite = new Date(fechaReferencia);
    limite.setDate(fechaReferencia.getDate() + dias);
    return tarea.vencimiento <= limite;
}

// Estados válidos para prioritario
const ESTADOS_ACTIVOS: readonly TaskStatus[] = ['pendiente', 'en curso'];

function tieneEstadoActivo(tarea: Task): boolean {
    return ESTADOS_ACTIVOS.includes(tarea.estado);
}

export function filtrarTareasPrioritarias(
    tareas: readonly Task[],
    diasLimite: number = 3,
    fechaReferencia: Date = new Date()
): readonly Task[] {
    return tareas.filter(tarea => 
        tieneEstadoActivo(tarea) &&
        esVencidoEnProximo(tarea, diasLimite, fechaReferencia)
    );
}

/**
 * Orquestador que filtra y muestra tareas prioritarias.
 * @param tareas - Lista de tareas
 */
export function verPrioridad(tareas: readonly Task[]): void {
    const tareasPrioritarias = filtrarTareasPrioritarias(tareas);
    mostrarFiltradas(tareasPrioritarias, 'Tareas Prioritarias');
}

/**
 * Función pura que verifica si una tarea está relacionada por categoría.
 * @param tarea - Tarea a verificar
 * @param categoria - Categoría de referencia
 * @returns true si la tarea pertenece a la categoría
 */
function estaRelacionada(tarea: Task, categoria: string): boolean {
    return tarea.categoria === categoria;
}

/**
 * Función pura que filtra tareas relacionadas por categoría.
 * @param tareaBase - Tarea de referencia
 * @param tareas - Lista de tareas a filtrar
 * @returns Tareas relacionadas (misma categoría, diferente ID)
 */
export function filtrarTareasRelacionadas(
    tareaBase: Task,
    tareas: readonly Task[]
): readonly Task[] {
    return tareas.filter(t => 
        t.id !== tareaBase.id && estaRelacionada(t, tareaBase.categoria)
    );
}

/**
 * Orquestador que filtra y muestra tareas relacionadas.
 * @param tareaBase - Tarea de referencia
 * @param tareas - Lista de tareas
 */
export function verRelacionadas(tareaBase: Task, tareas: readonly Task[]): void {
    mensaje(`\nTarea seleccionada: ${tareaBase.titulo} (Categoria: ${tareaBase.categoria})`);
    const tareasRelacionadas = filtrarTareasRelacionadas(tareaBase, tareas);
    mostrarFiltradas(tareasRelacionadas, `Tareas relacionadas con "${tareaBase.titulo}"`);
}
/**
 * Función pura que filtra tareas vencidas.
 * Tareas vencidas son aquellas con fecha de vencimiento anterior a la fecha de referencia y no completadas.
 * @param tareas - Lista de tareas
 * @param fechaReferencia - Fecha de referencia (default: ahora)
 * @returns Tareas vencidas filtradas
 */
export function filtrarTareasVencidas(
    tareas: readonly Task[],
    fechaReferencia: Date = new Date()
): readonly Task[] {
    return tareas.filter(tarea => 
        tarea.vencimiento !== null && 
        tarea.vencimiento < fechaReferencia && 
        tarea.estado !== 'completada'
    );
}

/**
 * Orquestador que filtra y muestra tareas vencidas.
 * @param tareas - Lista de tareas
 */
export function verVencidas(tareas: readonly Task[]): void {
    const tareasVencidas = filtrarTareasVencidas(tareas);
    mostrarFiltradas(tareasVencidas, 'Tareas Vencidas');
}

/**
 * Muestra una lista de tareas filtradas con un mensaje de condición.
 * Responsabilidad: Presentar resultados filtrados o mensaje vacío.
 * @param {readonly Task[]} tareasFiltradas - Las tareas filtradas a mostrar
 * @param {string} condicion - La descripción de la condición de filtrado
 * @returns {void}
 */
function mostrarFiltradas(tareasFiltradas: readonly Task[], condicion: string): void {
    if (tareasFiltradas.length === 0) {
        mensaje(`No hay ${condicion.toLowerCase()}.`);
        pausaMensaje();
    }
    else {
        mensaje(`\n===${condicion} (${tareasFiltradas.length}) ===\n`);
        listado(tareasFiltradas);
    }
}