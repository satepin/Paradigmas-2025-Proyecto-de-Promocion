/**
 * @module core/task
 * @description Define la estructura inmutable de datos y las banderas de validación para las tareas.
 */

import type { TaskFlags, TaskStatus, TaskDifficulty, ValidationFlag } from './type.ts';
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

/**
 * Banderas de validación para el título de una tarea (inmutable).
 * @type {Readonly<ValidationFlag>}
 */
const flagTitulo: Readonly<ValidationFlag> = {
    maxLength: 100,
    puedeVacio: false
} as const;

/**
 * Banderas de validación para la descripción de una tarea (inmutable).
 * @type {Readonly<ValidationFlag>}
 */
const flagDescripcion: Readonly<ValidationFlag> = {
    maxLength: 500,
    puedeVacio: true
} as const;

/**
 * Mapa inmutable de opciones para el estado de una tarea.
 * @type {ReadonlyMap<TaskStatus, number>}
 */
const flagEstado: ReadonlyMap<TaskStatus, number> = new Map<TaskStatus, number>([
    ["pendiente", 1],
    ["en curso", 2],
    ["completada", 3],
    ["cancelada", 4]
]);

/**
 * Mapa inmutable de opciones para la dificultad de una tarea.
 * @type {ReadonlyMap<TaskDifficulty, number>}
 */
const flagDificultad: ReadonlyMap<TaskDifficulty, number> = new Map<TaskDifficulty, number>([
    ["facil ★☆☆", 1],
    ["medio ★★☆", 2],
    ["dificil ★★★", 3]
]);

/**
 * Mapa inmutable de opciones para la categoría de una tarea.
 * @type {Readonly<ReadonlyMap<string, number>>}
 */
const flagCategoria: Readonly<ReadonlyMap<string, number>> = new Map<string, number>([
    ["programacion", 1],
    ["estudio", 2],
    ["trabajo", 3],
    ["ocio", 4],
    ["otro", 5]
]);

/**
 * Agrupa todas las flags inmutables de validación para una tarea.
 * @type {Readonly<TaskFlags>}
 */
const taskFlags: Readonly<TaskFlags> = {
    titulo: flagTitulo,
    descripcion: flagDescripcion,
    estado: flagEstado,
    dificultad: flagDificultad,
    categoria: flagCategoria
};

export { crearTarea, taskFlags, listaTareas };