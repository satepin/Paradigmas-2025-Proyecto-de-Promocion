import type { TaskFlags, TaskDifficulty, TaskStatus, TaskCategory, ValidationFlag } from '../type.ts';

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
 * @type {<ReadonlyMap<TaskCategory, number>>}
 */
const flagCategoria: ReadonlyMap<TaskCategory, number> = new Map<TaskCategory, number>([
    ["programacion", 1],
    ["estudio", 2],
    ["trabajo", 3],
    ["ocio", 4],
    ["otro", 5]
]);

interface ValidationResult {
    valid: boolean;
    error?: string;
}

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

// Recibimos el valor Y las reglas (flags)
export function validarTitulo(valor: string, reglas: Readonly<ValidationFlag>): ValidationResult {
    const limpio = valor.trim();

    // 1. Validar si puede ser vacío
    if (!reglas.puedeVacio && limpio.length === 0) {
        return { valid: false, error: "El título no puede estar vacío." };
    }

    // 2. Validar longitud máxima
    if (limpio.length > reglas.maxLength) {
        return { valid: false, error: `El título no puede exceder ${reglas.maxLength} caracteres.` };
    }

    return { valid: true };
}

export function validarDescripcion(valor: string, reglas: Readonly<ValidationFlag>): ValidationResult {
    const limpio = valor.trim();

    // 1. Validar si puede ser vacío
    if (reglas.puedeVacio && limpio.length === 0) {
        return { valid: true };
    }

    // 2. Validar longitud máxima
    if (limpio.length > reglas.maxLength) {
        return { valid: false, error: `La descripcion no puede exceder ${reglas.maxLength} caracteres.` };
    }

    return { valid: true };
}

export function validarEstado(
    opcion: number,
    mapaEstados: ReadonlyMap<TaskStatus, number>
): ValidationResult {
    // Extrae valores válidos del mapa (ej: [1, 2, 3, 4])
    const valoresValidos = Array.from(mapaEstados.values());

    if (!valoresValidos.includes(opcion)) {
        return {
            valid: false,
            error: `Valor incorrecto. Ingrese una opción entre ${Math.min(...valoresValidos)} y ${Math.max(...valoresValidos)}.`
        };
    }
    return { valid: true };
}

export function validarDificultad(
    opcion: number,
    mapaDificultades: ReadonlyMap<TaskDifficulty, number>
): ValidationResult {
    // Extrae valores válidos del mapa (ej: [1, 2, 3])
    const valoresValidos = Array.from(mapaDificultades.values());

    if (!valoresValidos.includes(opcion)) {
        return {
            valid: false,
            error: `Valor incorrecto. Ingrese una opción entre ${Math.min(...valoresValidos)} y ${Math.max(...valoresValidos)}.`
        };
    }
    return { valid: true };
}

export function validarCategoria(
    opcion: number,
    mapaCategoria: ReadonlyMap<TaskCategory, number>
): ValidationResult {
    // Extrae valores válidos del mapa (ej: [1, 2, 3, 4, 5])
    const valoresValidos = Array.from(mapaCategoria.values());

    if (!valoresValidos.includes(opcion)) {
        return {
            valid: false,
            error: `Valor incorrecto. Ingrese una opción entre ${Math.min(...valoresValidos)} y ${Math.max(...valoresValidos)}.`
        };
    }
    return { valid: true };
}

export { taskFlags };