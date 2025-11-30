import { taskFlags } from "../../task.ts";
import { datePrompt } from "../modulos/fechas.ts";
import { prompt } from "../modulos/promptSync.ts";

/**
 * Función auxiliar para seleccionar una opción de un Map.
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
    const entries = Array.from(map.entries());
    console.log(`\n${label}:`);
    entries.forEach(([key, value]) => console.log(`   ${value}. ${key}`));
    const input = prompt("   Opción: ");
    return entries.find(([_, value]) => value.toString() === input)?.[0] || defaultValue;
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
    console.clear();
    console.log("\nCreación de nueva tarea:");
}

function nuevaTareaMensajeGuardado(): void {
    console.log("\n¡Datos Guardados!");
    prompt("presiona cualquier tecla para continuar...");
}

export { setTitulo, setDescripcion, setEstado, setDificultad, setCategoria, setVencimiento, nuevaTareaMensajeInicio, nuevaTareaMensajeGuardado };