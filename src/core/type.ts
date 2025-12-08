/**
 * Interfaz para tareas persistidas (fechas como strings).
 * @property {string} id - Identificador único de la tarea
 * @property {string} titulo - Título de la tarea
 * @property {string} descripcion - Descripción de la tarea
 * @property {string} estado - Estado de la tarea
 * @property {string | null} creacion - Fecha de creación en formato ISO o null
 * @property {string | null} uEdicion - Fecha de última edición en formato ISO o null
 * @property {string | null} vencimiento - Fecha de vencimiento en formato ISO o null
 * @property {string} dificultad - Nivel de dificultad
 * @property {string} categoria - Categoría de la tarea
 * @property {boolean} eliminada - Indica si la tarea está eliminada
 */
export interface StoredTask {
    id: string;
    titulo: string;
    descripcion: string;
    estado: string;
    creacion: string | null;
    uEdicion: string | null;
    vencimiento: string | null;
    dificultad: string;
    categoria: string;
    eliminada: boolean;
}

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

export class Task {
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

    constructor(
        id: string,
        titulo: string,
        descripcion: string,
        estado: TaskStatus,
        creacion: Date | null,
        uEdicion: Date | null,
        vencimiento: Date | null,
        dificultad: TaskDifficulty,
        categoria: string,
        eliminada: boolean = false
    ) {
        this.id = id;
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.estado = estado;
        this.creacion = creacion;
        this.uEdicion = uEdicion;
        this.vencimiento = vencimiento;
        this.dificultad = dificultad;
        this.categoria = categoria;
        this.eliminada = eliminada;
    }
    
    public estaVencida(ahora: Date = new Date()): boolean {
        return this.vencimiento !== null && this.vencimiento < ahora;
    }

    public esPrioritaria(ahora: Date = new Date()): boolean {
        if (this.vencimiento === null) return false;
        const tresDias = new Date(ahora);
        tresDias.setDate(ahora.getDate() + 3);
        return (this.estado === 'pendiente' || this.estado === 'en curso') && this.vencimiento <= tresDias;
    }

    public marcarEliminada(uEdicion: Date = new Date()): Task {
        return new Task(
            this.id,
            this.titulo,
            this.descripcion,
            this.estado,
            this.creacion,
            uEdicion,
            this.vencimiento,
            this.dificultad,
            this.categoria,
            true
        );
    }

    public actualizar(cambios: Partial<Omit<Task, 'id' | 'creacion'>>): Task {
        return new Task(
            this.id,
            cambios.titulo ?? this.titulo,
            cambios.descripcion ?? this.descripcion,
            cambios.estado ?? this.estado,
            this.creacion,
            cambios.uEdicion ?? new Date(),
            cambios.vencimiento ?? this.vencimiento,
            cambios.dificultad ?? this.dificultad,
            cambios.categoria ?? this.categoria,
            cambios.eliminada ?? this.eliminada
        );
    }

    public toJSON(): StoredTask {
        return {
            id: this.id,
            titulo: this.titulo,
            descripcion: this.descripcion,
            estado: this.estado,
            creacion: this.creacion?.toISOString() ?? null,
            uEdicion: this.uEdicion?.toISOString() ?? null,
            vencimiento: this.vencimiento?.toISOString() ?? null,
            dificultad: this.dificultad,
            categoria: this.categoria,
            eliminada: this.eliminada
        };
    }

    static fromJSON(data: StoredTask): Task {
        return new Task(
            data.id,
            data.titulo,
            data.descripcion,
            data.estado as TaskStatus,
            data.creacion ? new Date(data.creacion) : null,
            data.uEdicion ? new Date(data.uEdicion) : null,
            data.vencimiento ? new Date(data.vencimiento) : null,
            data.dificultad as TaskDifficulty,
            data.categoria,
            data.eliminada
        );
    }
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