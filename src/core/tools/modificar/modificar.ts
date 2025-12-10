/**
 * @module tools/ver/modificar
 * @description Módulo para la edición interactiva de tareas.
 * Proporciona funciones puras y la envoltura I/O que usa promptSync.
 */

import { prompt, set } from '../modulos/promptSync.ts';
import { datePrompt } from '../modulos/fechas.ts';
import { TaskRepository } from '../modulos/guardado.ts'
import type { Task, TaskStatus, TaskDifficulty } from '../../type.ts';
import { taskFlags } from '../../task.ts';
import { mensaje } from '../../../interfaz/mensajes.ts';

/**
 * Aplica cambios a una tarea.
 */
export function aplicarCambiosA(tarea: Task, cambios: Partial<Task>): Task {
    return { ...tarea, ...cambios } as Task;
}

/**
 * Interfaz interactiva (I/O) para editar una tarea.
 * Devuelve la tarea actualizada si se guardaron cambios; null si se canceló.
 */
export function editarTareaInteractiva(tarea: Task): Task | null {
    mensaje("Editar tarea:");
    let editable: Task = { ...tarea } as Task;
    let continuar = true;
    while (continuar) {
        mensaje('\nCampos editables:');
        mensaje('1 - Descripción');
        mensaje('2 - Estado');
        mensaje('3 - Dificultad');
        mensaje('4 - Vencimiento');
        mensaje('0 - Finalizar edición');
        const campo = prompt('Selecciona el número del campo a editar: ', { maxLength: 1, puedeVacio: false });
        switch (campo) {
            case '1': {
                const desc = prompt(`Descripción [${editable.descripcion || 'Sin descripción'}]: `, taskFlags.descripcion);
                editable = { ...editable, descripcion: desc.trim() === '' ? editable.descripcion : desc } as Task;
                break;
            }
            case '2': {
                mensaje('\nEstado actual: ' + editable.estado);
                const nuevoEstado = set<TaskStatus>(taskFlags.estado as Map<TaskStatus, number>);
                editable = { ...editable, estado: nuevoEstado } as Task;
                break;
            }
            case '3': {
                mensaje('\nDificultad actual: ' + editable.dificultad);
                const nuevaDificultad = set<TaskDifficulty>(taskFlags.dificultad as Map<TaskDifficulty, number>);
                editable = { ...editable, dificultad: nuevaDificultad } as Task;
                break;
            }
            case '4': {
                const fv = datePrompt('Vencimiento (yyyy/mm/dd) - dejar vacío para conservar: ', true);
                const nuevaVenc = fv === null ? editable.vencimiento : fv;
                editable = { ...editable, vencimiento: nuevaVenc } as Task;
                break;
            }
            case '0': {
                continuar = false;
                break;
            }
            default: {
                mensaje('Opción inválida. Intenta nuevamente.');
            }
        }
        if (continuar) {
            const seguir = prompt('¿Desea continuar con la iteración? (s/n): ', { maxLength: 1, puedeVacio: true });
            if (seguir.toLowerCase() === 'n') continuar = false;
        }
    }

    const confirmar = prompt('Guardar cambios? (s/n): ', { maxLength: 1, puedeVacio: true });
    if (confirmar.toLowerCase() === 'n') {
        mensaje('\nCambios descartados.');
        return null;
    }

    const tareaActualizada = aplicarCambiosA(editable, { uEdicion: new Date() as unknown as Date });
    // Persistir cambios
    const repository = new TaskRepository();
    repository.actualizar(tareaActualizada);
    mensaje('\n¡Tarea actualizada!');
    return tareaActualizada;
}

/**
 * Ejecuta la edición de tarea seleccionada de una lista (I/O).
 * Devuelve la lista actualizada si hubo cambios.
 */
export function modificarTareaEnLista(tareas: readonly Task[], indice: number): readonly Task[] {
    if (indice < 1 || indice > tareas.length) return tareas;
    const tarea = tareas[indice - 1];
    if (!tarea) return tareas;
    const actualizada = editarTareaInteractiva(tarea as Task);
    if (!actualizada) return tareas;
    // Cargar tareas desde almacenamiento para mantener consistencia
    const repository = new TaskRepository();
    return repository.cargar();
}
