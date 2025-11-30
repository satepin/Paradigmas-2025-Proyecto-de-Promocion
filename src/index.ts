/**
 * @module index
 * @description Entry point principal de la aplicación de gestión de tareas.
 */

import { mainMenu } from './interfaz/mainMenu.ts';
import { cargarTareas, inicializarAlmacenamiento, obtenerInfoAlmacenamiento } from './core/tools/modulos/guardado.ts';
import type { Task } from './core/type.ts';
import { mensaje, clearMensaje } from './interfaz/mensajes.ts';
/**
 * Función principal que ejecuta el loop del programa.
 * @returns {void}
 */
function main(): void {
    clearMensaje("=== Sistema de Gestión de Tareas ===\n");
    
    // Estado inicial: lista vacía de tareas
    inicializarAlmacenamiento();
    let listaTareas: readonly Task[] = cargarTareas();
    let continuarEjecucion = true;
    const username = "Usuario"; // Puedes solicitar el nombre si lo deseas

    // Loop principal del programa
    while (continuarEjecucion) {
        const resultado = mainMenu(listaTareas, username);
        listaTareas = resultado.listaTareasActualizada;
        continuarEjecucion = resultado.continuarEjecucion;
    }

    mensaje("\n¡Hasta luego!");
}

// Ejecutar el programa
main();