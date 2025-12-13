import { datePrompt } from "../modulos/fechas.ts";
import { prompt } from "../modulos/promptSync.ts";
import { mensaje, clearMensaje} from "../../../interfaz/mensajes.ts";
import { validarTitulo, validarDescripcion, validarEstado, validarDificultad, validarCategoria} from "../validaciones.ts";

// ===== Mapeos Puros (Constantes) =====
const ESTADO_MAP: Record<number, string> = {
    1: "pendiente",
    2: "en curso",
    3: "completada",
    4: "cancelada"
};

const DIFICULTAD_MAP: Record<number, string> = {
    1: "facil ★☆☆",
    2: "medio ★★☆",
    3: "dificil ★★★",
};

const CATEGORIA_MAP: Record<number, string> = {
    1: "programacion",
    2: "estudio",
    3: "trabajo",
    4: "ocio",
    5: "otro"
};

// ===== Funciones Puras =====

/**
 * Mapea un número a su valor de estado correspondiente.
 * @param estado - Número del estado
 * @returns El estado mapeado o valor por defecto
 */
function asignarEstado(estado: number): string {
    return ESTADO_MAP[estado] ?? "en curso";
}

/**
 * Mapea un número a su valor de dificultad correspondiente.
 * @param dificultad - Número de dificultad
 * @returns La dificultad mapeada o valor por defecto
 */
function asignarDificultad(dificultad: number): string {
    return DIFICULTAD_MAP[dificultad] ?? "medio ★★☆";
}

/**
 * Mapea un número a su valor de categoría correspondiente.
 * @param categoria - Número de categoría
 * @returns La categoría mapeada o valor por defecto
 */
function asignarCategoria(categoria: number): string {
    return CATEGORIA_MAP[categoria] ?? "otro";
}

// ===== Funciones con Efectos Secundarios =====

/**
 * Solicita al usuario ingresar el título de la tarea.
 * @returns El título ingresado
 */
function setTitulo(): string {
    while (true) {
        const titulo = prompt("1. Ingresa el titulo: ");
        const validation = validarTitulo(titulo);
        
        if (validation.valid) return titulo;
        mensaje(`${validation.error}`);
    }
}

/**
 * Solicita al usuario ingresar la descripción de la tarea.
 * @returns La descripción ingresada
 */
function setDescripcion(): string {
    while (true) {
        const descripcion = prompt("2. Ingresa la descripcion: ");
        const validation = validarDescripcion(descripcion);
        
        if (validation.valid) return descripcion;
        mensaje(`${validation.error}`);
    }
}

/**
 * Solicita al usuario seleccionar el estado de la tarea.
 * @returns El estado seleccionado
 */
function setEstado(): string {
    while (true) {
        mensaje(`3. Ingresa el estado:
            1. pendiente
            2. en curso
            3. completada
            4. cancelada`);
        const estado = Number(prompt("Opción: "));
        const validation = validarEstado(estado);
        
        if (validation.valid) return asignarEstado(estado);
        mensaje(`${validation.error}`);
    }
}

/**
 * Solicita al usuario seleccionar la dificultad de la tarea.
 * @returns La dificultad seleccionada
 */
function setDificultad(): string {
    while (true) {
        mensaje(`4. Ingresa la dificultad:
            1. facil ★☆☆
            2. medio ★★☆
            3. dificil ★★★`);
        const dificultad = Number(prompt("Opción: "));
        const validation = validarDificultad(dificultad);
        
        if (validation.valid) return asignarDificultad(dificultad);
        mensaje(`${validation.error}`);
    }
}

/**
 * Solicita al usuario ingresar la fecha de vencimiento de la tarea.
 * @returns La fecha ingresada o null si se deja vacío
 */
function setVencimiento(): Date | null {
    return datePrompt("5. Ingresa la fecha de vencimiento (aaaa/mm/dd) o deja en blanco: ");
}

/**
 * Solicita al usuario seleccionar la categoría de la tarea.
 * @returns La categoría seleccionada
 */
function setCategoria(): string {
    while (true) {
        mensaje(`6. Ingresa la categoria: 
            1. programacion
            2. estudio
            3. trabajo
            4. ocio
            5. otro`);
        const categoria = Number(prompt("Opcion: "));
        const validation = validarCategoria(categoria);
        
        if (validation.valid) return asignarCategoria(categoria);
        mensaje(`${validation.error}`);
    }
}

/**
 * Muestra el mensaje inicial al comenzar la creación de una tarea.
 * @returns {void}
 */
function nuevaTareaMensajeInicio(): void {
    clearMensaje("\nCreación de nueva tarea:");
}

/**
 * Muestra el mensaje de confirmación al guardar una tarea.
 * @returns {void}
 */
function nuevaTareaMensajeGuardado(): void {
    mensaje("\n¡Datos Guardados!");
    prompt("Presiona cualquier tecla para continuar...");
}

export { setTitulo, setDescripcion, setEstado, setDificultad, setCategoria, setVencimiento, nuevaTareaMensajeInicio, nuevaTareaMensajeGuardado };