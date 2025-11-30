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
        "4- Eliminar una Tarea",
        "5- Información del Almacenamiento",
        "6- Estadisticas para Nerds",
        "7- Consultas adicionales",
        "8. Modificar una Tarea",
        "0- Salir"
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
