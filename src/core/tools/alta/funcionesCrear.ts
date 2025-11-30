import { taskFlags } from "../../task.ts";
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

export function setTitulo(): string {
    return prompt("1. Ingresa el titulo: ", taskFlags.titulo);
}

export function setDescripcion(): string {
    return prompt("2. Ingresa la descripcion: ", taskFlags.descripcion);
}  

export function setEstado(): string {
    return seleccionarOpcionDeMap("3. Selecciona un estado", taskFlags.estado, 'pendiente');
}

export function setDificultad(): string {
    return seleccionarOpcionDeMap("4. Selecciona una dificultad", taskFlags.dificultad, 'facil ★☆☆');
}

export function setCategoria(): string {
    return seleccionarOpcionDeMap("6. Selecciona una categoria", taskFlags.categoria, 'otro');
}