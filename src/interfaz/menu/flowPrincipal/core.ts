import type { Task } from "../../../core/type.ts";
import { mensaje } from "../../mensajes.ts";
//import/export simplificable
import { ejecutarAgregarTarea, ejecutarBuscarTareas, ejecutarEliminarTarea, ejecutarEstadisticas, ejecutarInfoAlmacenamiento, ejecutarModificarTarea, ejecutarSalir, ejecutarVerTareas } from "../funciones/actions.ts";
import { ejecutarConsultasAdicionales } from "../funciones/adicionales.ts";
import { crearResultadoSinCambios } from "../funciones/helpers.ts";
import { type MenuActionResult } from "../funciones/actions.ts";
import { menuPrompt } from "../../../core/tools/modulos/promptSync.ts";


// ============================================================================
// MAPEO DE OPCIONES A ACCIONES
// ============================================================================

/**
 * Función que mapea una opción numérica del menú a su acción correspondiente.
 * 
 * Mapeo de opciones:
 * - 1: Ver tareas
 * - 2: Buscar tareas
 * - 3: Agregar tarea
 * - 4: Eliminar tarea
 * - 5: Información del almacenamiento
 * - 6: Estadísticas para nerds
 * - 7: Consultas adicionales
 * - 8: Modificar tarea
 * - 0: Salir
 * 
 * @param opcion - La opción seleccionada por el usuario (0-8)
 * @returns Función que ejecuta la acción correspondiente
 */
export function obtenerAccionPorOpcion(
    opcion: number
): (lista: readonly Task[]) => MenuActionResult {
    switch (opcion) {
        case 1: return ejecutarVerTareas;
        case 2: return ejecutarBuscarTareas;
        case 3: return ejecutarAgregarTarea;
        case 4: return ejecutarEliminarTarea;
        case 5: return ejecutarInfoAlmacenamiento;
        case 6: return ejecutarEstadisticas;
        case 7: return ejecutarConsultasAdicionales;
        case 8: return ejecutarModificarTarea;
        case 0: return ejecutarSalir;
        default:
            return (lista) => {
                mensaje("Opción no válida");
                return crearResultadoSinCambios(lista);
            };
    }
}

/**
 * Solicita al usuario seleccionar una opción del menú.
 * @returns Índice de la opción seleccionada (0-8)
 */
export function solicitarOpcionMenu(): number {
    return menuPrompt("", 0, 8);
}

// ============================================================================
// TIPOS
// ============================================================================

/**
 * Resultado del procesamiento del menú principal.
 * Representa el nuevo estado de la aplicación después de ejecutar una acción.
 */
export type MainMenuResult = {
    readonly continuarEjecucion: boolean;
    readonly listaTareasActualizada: readonly Task[];
};


// ============================================================================
// PROCESAMIENTO DE ACCIONES
// ============================================================================

/**
 * Función que procesa la opción del menú y retorna el nuevo estado.
 * @param listaTareas - La lista actual de tareas
 * @param opcion - La opción seleccionada por el usuario (0-8)
 * @returns El nuevo estado de la aplicación
 */
export function procesarOpcionMenu(
    listaTareas: readonly Task[],
    opcion: number
): MainMenuResult {
    const accion = obtenerAccionPorOpcion(opcion);
    const resultado = accion(listaTareas);
    return {
        continuarEjecucion: resultado.continuarEjecucion,
        listaTareasActualizada: resultado.listaTareasActualizada
    };
}