/**
 * @module interfaz/menuRenderer
 * @description Funciones puras para formatear y renderizar menús.
 * 
 * Este módulo contiene SOLO funciones puras de transformación de datos,
 * sin efectos secundarios ni operaciones de I/O.
 * 
 * Responsabilidades:
 * - Formatear el menú principal
 * - Generar texto de menús
 * - Transformar datos en representaciones visuales
 */

import { mensaje } from "../../mensajes.ts";

// ============================================================================
// FORMATEO DEL MENÚ PRINCIPAL
// ============================================================================

/**
 * Función que genera las líneas del menú principal.
 * 
 * @param username - El nombre del usuario
 * @returns Array inmutable de líneas del menú listas para mostrar
 * 
 * @example
 * ```typescript
 * const lineas = formatearMenuPrincipal("Juan");
 * // ["Hola Juan", "¿Que deseas hacer?", ...]
 * ```
 */
function formatearMenuPrincipal(username: string): readonly string[] {
    return [
        `Hola ${username}`,
        "¿Que deseas hacer?",
        "1- Ver mis Tareas",
        "2- Buscar una Tarea",
        "3- Agregar una nueva Tarea",
        "4- Eliminar una Tarea",
        "5- Información del Almacenamiento",
        "6- Estadisticas para Nerds",
        "7- Consultas adicionales",
        "8- Modificar una Tarea",
        "0- Salir"
    ];
}

/**
 * Función que genera el texto completo del menú principal como string.
 * Útil para logging o testing.
 * 
 * @param username - El nombre del usuario
 * @returns El menú formateado como string único con saltos de línea
 * 
 * @example
 * ```typescript
 * const texto = generarTextoMenu("María");
 * console.log(texto);
 * ```
 */
function generarTextoMenu(username: string): string {
    return formatearMenuPrincipal(username).join('\n');
}

// ============================================================================
// FUNCION DE PRESENTACIÓN (I/O)
// ============================================================================

/**
 * Muestra el menú principal formateado en la consola.
 * @param username - Nombre del usuario
 */
export function mostrarMenuPrincipal(username: string): void {
    const lineasMenu = formatearMenuPrincipal(username);
    lineasMenu.forEach(linea => mensaje(linea));
}