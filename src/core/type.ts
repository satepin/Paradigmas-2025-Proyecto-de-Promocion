/**
 * @module types/taskTypes
 * @description Define los tipos e interfaces utilizados en toda la aplicación.
 */

/**
 * Define los posibles estados de una tarea.
 * @typedef {'pendiente' | 'en curso' | 'completada' | 'cancelada'} TaskStatus
 */
export type TaskStatus = 'pendiente' | 'en curso' | 'completada' | 'cancelada';

/**
 * Define los posibles niveles de dificultad de una tarea.
 * @typedef {'facil' | 'medio' | 'dificil'} TaskDifficulty
 */
export type TaskDifficulty = 'facil ★☆☆' | 'medio ★★☆' | 'dificil ★★★';

/**
 * @interface Task
 * @description Representa la estructura inmutable de una tarea.
 * @property {string} id - El identificador único de la tarea.
 * @property {string} titulo - El título de la tarea.
 * @property {string} descripcion - La descripción de la tarea.
 * @property {TaskStatus} estado - El estado actual de la tarea.
 * @property {Date | null} creacion - La fecha de creación de la tarea.
 * @property {Date | null} uEdicion - La fecha de la última edición de la tarea.
 * @property {Date | null} vencimiento - La fecha de vencimiento de la tarea.
 * @property {TaskDifficulty} dificultad - El nivel de dificultad de la tarea.
 * @property {boolean} eliminada - Indica si la tarea ha sido eliminada.
 * @property {string} categoria - La categoría de la tarea.
 */
export interface Task {
    readonly id: string;
    readonly titulo: string;
    readonly descripcion: string;
    readonly estado: TaskStatus;
    readonly creacion: Date | null;
    readonly uEdicion: Date | null;
    readonly vencimiento: Date | null;
    readonly dificultad: TaskDifficulty;
    readonly categoria: string;
    readonly eliminada: boolean;
}

/**
 * @interface ValidationFlag
 * @description Define las reglas inmutables de validación para una entrada de texto.
 * @property {number} maxLength - La longitud máxima permitida.
 * @property {boolean} puedeVacio - Si la entrada puede estar vacía.
 */
export interface ValidationFlag {
    readonly maxLength: number;
    readonly puedeVacio: boolean;
}

/**
 * @interface TaskFlags
 * @description Agrupa todas las banderas inmutables de validación para los campos de una tarea.
 * @property {ValidationFlag} titulo - Banderas para el título.
 * @property {ValidationFlag} descripcion - Banderas para la descripción.
 * @property {ReadonlyMap<TaskStatus, number>} estado - Mapa inmutable de opciones para el estado.
 * @property {ReadonlyMap<TaskDifficulty, number>} dificultad - Mapa inmutable de opciones para la dificultad.
 * @property {ReadonlyMap<string, number>} categoria - Mapa inmutable de opciones para la categoría.
 */
export interface TaskFlags {
    readonly titulo: ValidationFlag;
    readonly descripcion: ValidationFlag;
    readonly estado: ReadonlyMap<TaskStatus, number>;
    readonly dificultad: ReadonlyMap<TaskDifficulty, number>;
    readonly categoria: ReadonlyMap<string, number>;
}

/**
 * @interface TaskObject
 * @description Define la interfaz pública de un objeto de tarea.
 * @property {() => void} view - Muestra los detalles de la tarea.
 * @property {() => void} edit - Permite editar la tarea.
 * @property {string} titulo - El título de la tarea (solo lectura).
 * @property {TaskStatus} estado - El estado de la tarea (solo lectura).
 */
export interface TaskObject {
    view: () => void;
    edit: () => void;
    readonly titulo: string;
    readonly estado: TaskStatus;
}