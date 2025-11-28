/**
 * @module interfaz/menuRenderer
 * @description Funciones puras para formatear y renderizar menús (sin I/O).
 */

/**
 * Función pura que genera las líneas del menú principal.
 * @param {string} username - El nombre del usuario.
 * @returns {readonly string[]} Array de líneas del menú.
 */
export function formatearMenuPrincipal(username: string): readonly string[] {
    return [
        `Hola ${username}`,
        "¿Que deseas hacer?",
        "1- Ver mis Tareas",
        "2- Buscar una Tarea",
        "3- Agregar una nueva Tarea",
        "0- salir"
    ];
}

/**
 * Función pura que genera el texto completo del menú principal.
 * @param {string} username - El nombre del usuario.
 * @returns {string} El menú formateado como string único.
 */
export function generarTextoMenu(username: string): string {
    return formatearMenuPrincipal(username).join('\n');
}

// Función mostrarMenuPrincipal() eliminada - usar formatearMenuPrincipal().forEach() directamente
