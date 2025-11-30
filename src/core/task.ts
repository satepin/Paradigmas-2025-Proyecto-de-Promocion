/**
 * @module core/task
 * @description Define la estructura inmutable de datos y las banderas de validación para las tareas.
 */

import type { Task, TaskFlags, TaskStatus, TaskDifficulty, ValidationFlag } from './type.ts';

/**
 * Plantilla por defecto para un objeto de tarea (inmutable).
 * @type {Readonly<Task>}
 */
const task: Readonly<Task> = {
    id: '',
    titulo: '',
    descripcion: '',
    estado: 'pendiente',
    creacion: null,
    uEdicion: null,
    vencimiento: null,
    dificultad: 'facil ★☆☆',
    categoria: 'otro',
    eliminada: false
} as const;

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

export { task, taskFlags, listaTareas };