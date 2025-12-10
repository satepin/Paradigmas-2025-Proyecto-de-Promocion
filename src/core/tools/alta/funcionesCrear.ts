import { datePrompt } from "../modulos/fechas.ts";
import { prompt } from "../modulos/promptSync.ts";
import { mensaje, clearMensaje} from "../../../interfaz/mensajes.ts";
import { validarTitulo, validarDescripcion, validarEstado, validarDificultad, validarCategoria} from "../validaciones.ts";

/**
 * Solicita al usuario ingresar el título de la tarea.
 * @returns {string} El título ingresado
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
 * @returns {string} La descripción ingresada
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
 * @returns {string} El estado seleccionado
 */
function asignarEstado(estado: number): string {
    const estadoMap: Record<number, string> = {
        1: "pendiente",
        2: "en curso",
        3: "completada",
        4: "cancelada"
    };
    return estadoMap[estado] ?? "en curso";
}
function setEstado(): string {
    while (true) {
        mensaje(`3. Ingresa el estado:
            1. pendiente
            2. en curso
            3. completada
            4. cancelada`)
        const estado = Number(prompt("Opción: "));
        const validation = validarEstado(estado);
        const estadoAsignado = asignarEstado(estado);
        
        if (validation.valid) return estadoAsignado;
        mensaje(`${validation.error}`);
    }
}

/**
 * Solicita al usuario ingresar la fecha de vencimiento de la tarea.
 * @returns {Date | null} La fecha ingresada o null si se deja vacío
 */
function setVencimiento(): Date | null {
    return datePrompt("5. Ingresa la fecha de vencimiento (aaaa/mm/dd) o deja en blanco: ");
}

/**
 * Solicita al usuario seleccionar la dificultad de la tarea.
 * @returns {string} La dificultad seleccionada
 */
function asignarDificultad(estado: number): string {
    const dificultadMap: Record<number, string> = {
        1: "facil ★☆☆",
        2: "medio ★★☆",
        3: "dificil ★★★",
    };
    return dificultadMap[estado] ?? "medio ★★☆";
}
function setDificultad(): string {
    while (true) {
        mensaje(`4. Ingresa la dificultad:
            1. facil ★☆☆
            2. medio ★★☆
            3. dificil ★★★`);
        const dificultad = Number(prompt("Opción: "));
        const validation = validarDificultad(dificultad);
        const dificultadAsignada = asignarDificultad(dificultad);
        
        if (validation.valid) return dificultadAsignada;
        mensaje(`${validation.error}`);
    }
}

/**
 * Solicita al usuario seleccionar la categoría de la tarea.
 * @returns {string} La categoría seleccionada
 */
function asignarCategoria(estado: number): string {
    const dificultadMap: Record<number, string> = {
        1: "programacion",
        2: "estudio",
        3: "trabajo",
        4: "ocio",
        5: "otro"
    };
    return dificultadMap[estado] ?? "otro";
}
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
        const categoriaAsignada = asignarCategoria(categoria);
        
        if (validation.valid) return categoriaAsignada;
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
    prompt("presiona cualquier tecla para continuar...");
}

export { setTitulo, setDescripcion, setEstado, setDificultad, setCategoria, setVencimiento, nuevaTareaMensajeInicio, nuevaTareaMensajeGuardado };