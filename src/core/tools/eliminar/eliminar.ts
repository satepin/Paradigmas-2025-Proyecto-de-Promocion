/**
 * @module tools/eliminar/eliminar
 * @description Proporciona funciones para la eliminación lógica de tareas.
 */

import type { Task } from '../../type.ts';

/**
 * Marca una tarea como eliminada (Eliminación lógica).
 * Función pura que no modifica la lista original.
 * @param {readonly Task[]} listaTareas - La lista de tareas.
 * @param {string} idTarea - El ID de la tarea a eliminar.
 * @param {Date} [uEdicion] - Fecha de última edición (opcional, se crea nueva si no se provee).
 * @returns {readonly Task[]} Nueva lista con la tarea marcada como eliminada.
 */
export function eliminarTareaLogicamente(
    listaTareas: readonly Task[],
    idTarea: string,
    uEdicion?: Date
): readonly Task[] {
    const fechaEdicion = uEdicion ?? new Date();
    return listaTareas.map(tarea =>
        tarea.id === idTarea ? { ...tarea, eliminada: true, uEdicion: fechaEdicion } : tarea
    );
}
