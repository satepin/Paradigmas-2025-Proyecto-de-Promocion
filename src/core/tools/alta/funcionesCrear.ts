import { taskFlags } from "../../task.ts";
import { datePrompt } from "../modulos/fechas.ts";
import { prompt } from "../modulos/promptSync.ts";
import { mensaje,clearMensaje} from "../../../interfaz/mensajes.ts";
/**
 * Función pura que genera las líneas del menú de opciones.
 * @param label - Etiqueta descriptiva
 * @param map - Map con las opciones disponibles
 * @returns Array de líneas formateadas
 */
function generarLineasOpcionesMap<K extends string>(
    label: string,
    map: ReadonlyMap<K, number>
): readonly string[] {
    const entries = Array.from(map.entries());
    return [
        `\n${label}:`,
        ...entries.map(([key, value]) => `   ${value}. ${key}`)
    ];
}

/**
 * Función pura que busca la opción seleccionada en el Map.
 * @param map - Map con las opciones disponibles
 * @param input - Entrada del usuario
 * @param defaultValue - Valor por defecto
 * @returns La clave seleccionada o el valor por defecto
 */
function obtenerOpcionDeMap<K extends string>(
    map: ReadonlyMap<K, number>,
    input: string,
    defaultValue: K
): K {
    const entries = Array.from(map.entries());
    return entries.find(([_, value]) => value.toString() === input)?.[0] || defaultValue;
}

/**
 * Función que orquesta la selección de una opción de un Map.
 * @param label - Etiqueta descriptiva para mostrar al usuario
 * @param map - Map con las opciones disponibles
 * @param defaultValue - Valor por defecto si no se selecciona ninguno
 * @returns La clave seleccionada del Map
 */
function seleccionarOpcionDeMap<K extends string>(
    label: string,
    map: ReadonlyMap<K, number>,
    defaultValue: K
): K {
    const lineas = generarLineasOpcionesMap(label, map);
    lineas.forEach(linea => mensaje(linea));
    const input = prompt("   Opción: ");
    return obtenerOpcionDeMap(map, input, defaultValue);
}

function setTitulo(): string {
    return prompt("1. Ingresa el titulo: ", taskFlags.titulo);
}

function setDescripcion(): string {
    return prompt("2. Ingresa la descripcion: ", taskFlags.descripcion);
}  

function setEstado(): string {
    return seleccionarOpcionDeMap("3. Selecciona un estado", taskFlags.estado, 'pendiente');
}

function setVencimiento(): Date | null {
    return datePrompt("5. Ingresa la fecha de vencimiento (aaaa/mm/dd) o deja en blanco: ");
}

function setDificultad(): string {
    return seleccionarOpcionDeMap("4. Selecciona una dificultad", taskFlags.dificultad, 'facil ★☆☆');
}

function setCategoria(): string {
    return seleccionarOpcionDeMap("6. Selecciona una categoria", taskFlags.categoria, 'otro');
}

function nuevaTareaMensajeInicio(): void {
    clearMensaje("\nCreación de nueva tarea:");
}

function nuevaTareaMensajeGuardado(): void {
    mensaje("\n¡Datos Guardados!");
    prompt("presiona cualquier tecla para continuar...");
}

export { setTitulo, setDescripcion, setEstado, setDificultad, setCategoria, setVencimiento, nuevaTareaMensajeInicio, nuevaTareaMensajeGuardado };