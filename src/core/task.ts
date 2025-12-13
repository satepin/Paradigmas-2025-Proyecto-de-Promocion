/**
 * @module core/task
 * @description Define la estructura inmutable de datos y las banderas de validación para las tareas.
 */

import type { TaskStatus, TaskDifficulty } from './type.ts';
import { Task } from './type.ts';

/**
 * Plantilla por defecto para un objeto de tarea (inmutable).
 * @type {Readonly<Task>}
 */
function crearTarea(overrides: Partial<{
    id: string;
    titulo: string;
    descripcion: string;
    estado: TaskStatus;
    creacion: Date | null;
    uEdicion: Date | null;
    vencimiento: Date | null;
    dificultad: TaskDifficulty;
    categoria: string;
    eliminada: boolean;
}> = {}): Task {
    const defaults = {
        id: '',
        titulo: '',
        descripcion: '',
        estado: 'pendiente' as const,
        creacion: null,
        uEdicion: null,
        vencimiento: null,
        dificultad: 'facil ★☆☆' as const,
        categoria: 'otro',
        eliminada: false
    };

    const config = { ...defaults, ...overrides };

    return new Task(
        config.id,
        config.titulo,
        config.descripcion,
        config.estado,
        config.creacion,
        config.uEdicion,
        config.vencimiento,
        config.dificultad,
        config.categoria,
        config.eliminada
    );
}

/**
 * Lista de tareas en memoria (actualmente no utilizada, se gestiona en index.ts).
 * @type {readonly Task[]}
 * @deprecated
 */
const listaTareas: readonly Task[] = [];

export { crearTarea, listaTareas };