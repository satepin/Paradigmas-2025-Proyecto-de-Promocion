/**
 * @module interfaz/menuActions
 * @description Orquestadores de acciones del menú (con efectos secundarios controlados).
 */

import { menuPrompt, prompt } from "../../core/tools/modulos/promptSync.ts";
import { TaskRepository } from "../../core/tools/modulos/guardado.ts";
import { filtrarPorOpcion, filtrarPorTitulo } from "../../core/tools/ver/busqueda/filtro.ts";
import { listado, formatearListaTareas, obtenerTareaPorIndice } from "../../core/tools/ver/listado.ts";
import { agregar} from "../../core/tools/alta/agregar.ts";
import { taskFlags } from "../../core/task.ts";
import type { Task } from '../../core/type.ts';
import { modificarTareaEnLista } from "../../core/tools/modificar/modificar.ts";
import { ejecutarConsultasAdicionales } from "../adicionales.ts";
import { mensaje, clearMensaje } from "../mensajes.ts";
import {
    crearResultadoSinCambios,
    crearResultadoConCambios,
    generarLineasMenu,
    mostrarLineasMenu
} from "./menuHelpers.ts";

/**
 * Tipo para el resultado de una acción del menú.
 */
export type MenuActionResult = {
    readonly continuarEjecucion: boolean;
    readonly listaTareasActualizada: readonly Task[];
};

/**
 * Muestra el menú de opciones para ver tareas.
 * Responsabilidad: Presentar menú y capturar selección.
 * @returns {number} Número de opción seleccionada (0-4)
 */
function mostrarMenuVerTareas(): number {
    const lineasMenu = generarLineasMenu(
        "¿Que tareas deseas ver?",
        ["1- Todas", "2- Pendientes", "3- En curso", "4- Terminadas"]
    );
    mostrarLineasMenu(lineasMenu);
    return menuPrompt("Elige una opcion: ", 0, 4);
}

/**
 * Ejecuta la acción de ver tareas (no modifica la lista).
 * Responsabilidad: Orquestar el flujo de visualización de tareas.
 * @param {readonly Task[]} listaTareas - La lista de tareas.
 * @returns {MenuActionResult} Resultado indicando continuar sin cambios.
 */
export function ejecutarVerTareas(listaTareas: readonly Task[]): MenuActionResult {
    const tareasVisibles = listaTareas.filter(t => !t.eliminada);
    const opcion = mostrarMenuVerTareas();
    
    if (opcion === 0) {
        return crearResultadoSinCambios(listaTareas);
    }

    const filtradas = filtrarPorOpcion(tareasVisibles, opcion);
    listado(filtradas, opcion);
    return crearResultadoSinCambios(listaTareas);
}

/**
 * Solicita el término de búsqueda al usuario.
 * Responsabilidad: Capturar entrada de búsqueda.
 * @returns {string} Término de búsqueda ingresado
 */
function solicitarTerminoBusqueda(): string {
    clearMensaje("Buscar Tarea");
    return prompt("Introduce el titulo de una tarea para buscarla: ", taskFlags.titulo);
}

/**
 * Muestra resultados de búsqueda o mensaje de no encontrados.
 * Responsabilidad: Presentar resultados de búsqueda.
 * @param {readonly Task[]} resultados - Tareas encontradas
 * @param {string} busqueda - Término buscado
 * @returns {void}
 */
function mostrarResultadosBusqueda(resultados: readonly Task[], busqueda: string): void {
    if (resultados.length > 0) {
        listado(resultados, busqueda);
    } else {
        mensaje("\nNo hay tareas relacionadas con la busqueda");
    }
}

/**
 * Ejecuta la acción de buscar tareas (no modifica la lista).
 * Responsabilidad: Orquestar el flujo de búsqueda.
 * @param {readonly Task[]} listaTareas - La lista de tareas.
 * @returns {MenuActionResult} Resultado indicando continuar sin cambios.
 */
export function ejecutarBuscarTareas(listaTareas: readonly Task[]): MenuActionResult {
    const busqueda = solicitarTerminoBusqueda();
    const tareasVisibles = listaTareas.filter(t => !t.eliminada);
    const resultados = filtrarPorTitulo(tareasVisibles, busqueda);
    mostrarResultadosBusqueda(resultados, busqueda);
    return crearResultadoSinCambios(listaTareas);
}

/**
 * Ejecuta la acción de agregar una tarea (modifica la lista).
 * Responsabilidad: Orquestar flujo de adición de tarea.
 * @param {readonly Task[]} listaTareas - La lista de tareas.
 * @returns {MenuActionResult} Resultado con la lista actualizada.
 */
export function ejecutarAgregarTarea(listaTareas: readonly Task[]): MenuActionResult {
    clearMensaje("Agregar Tarea");
    // Usamos la función que hace la creación + guardado para persistir
    const listaActualizada = agregar(listaTareas);
    mensaje(`\n¡Tarea Agregada a la Lista!\nTotal de Tareas: ${listaActualizada.length}`);
    return crearResultadoConCambios(listaActualizada);
}

/**
 * Verifica si hay tareas disponibles para eliminar.
 * @param tareasVisibles - Tareas no eliminadas
 * @returns true si no hay tareas
 */
function validarTareasDisponibles(tareasVisibles: readonly Task[]): boolean {
    if (tareasVisibles.length === 0) {
        mensaje("No hay tareas para eliminar.");
        prompt("\nPresiona cualquier tecla para continuar...", { puedeVacio: true, maxLength: 100 });
        return true;
    }
    return false;
}

/**
 * Muestra la lista de tareas y solicita selección.
 * @param tareasVisibles - Tareas a mostrar
 * @returns Índice seleccionado
 */
function seleccionarTareaParaEliminar(tareasVisibles: readonly Task[]): number {
    clearMensaje("Eliminar Tarea");
    mensaje("Selecciona la tarea que deseas eliminar:");
    const lineasFormateadas = formatearListaTareas(tareasVisibles);
    lineasFormateadas.forEach(linea => mensaje(linea));
    return menuPrompt("\nIntroduce el número de la tarea a eliminar o 0 para volver: ", 0, tareasVisibles.length);
}

/**
 * Elimina una tarea y muestra confirmación.
 * @param tarea - Tarea a eliminar
 * @returns Lista actualizada
 */
function eliminarYConfirmar(tarea: Task): readonly Task[] {
    const repository = new TaskRepository();
    const listaActualizada = repository.eliminar(tarea.id);
    mensaje(`\n¡Tarea "${tarea.titulo}" eliminada!`);
    prompt("Presiona cualquier tecla para continuar...", { puedeVacio: true, maxLength: 100 });
    return listaActualizada;
}

/**
 * Ejecuta la acción de eliminar una tarea (modifica la lista).
 * Responsabilidad: Orquestar el flujo de eliminación.
 * @param {readonly Task[]} listaTareas - La lista de tareas.
 * @returns {MenuActionResult} Resultado con la lista actualizada.
 */
export function ejecutarEliminarTarea(listaTareas: readonly Task[]): MenuActionResult {
    const tareasVisibles = listaTareas.filter(t => !t.eliminada);

    if (validarTareasDisponibles(tareasVisibles)) {
        return crearResultadoSinCambios(listaTareas);
    }

    const indice = seleccionarTareaParaEliminar(tareasVisibles);

    if (indice === 0) {
        return crearResultadoSinCambios(listaTareas);
    }

    const tareaAEliminar = obtenerTareaPorIndice(tareasVisibles, indice);

    if (tareaAEliminar) {
        const listaActualizada = eliminarYConfirmar(tareaAEliminar);
        return crearResultadoConCambios(listaActualizada);
    }

    mensaje("Índice no válido.");
    prompt("\nPresiona cualquier tecla para continuar...", { puedeVacio: true, maxLength: 100 });
    return crearResultadoSinCambios(listaTareas);
}
/**
 * Ejecuta la acción de mostrar información del almacenamiento (no modifica la lista).
 * Responsabilidad: Orquestar visualización de información del almacenamiento.
 * @param {readonly Task[]} listaTareas - La lista de tareas.
 * @returns {MenuActionResult} Resultado indicando continuar sin cambios.
 */
export function ejecutarInfoAlmacenamiento(listaTareas: readonly Task[]): MenuActionResult {
    const repository = new TaskRepository();
    clearMensaje("Información del Almacenamiento");
    const info = repository.obtenerInfo();
    mensaje(info);
    prompt("\nPresiona cualquier tecla para continuar...", { puedeVacio: true, maxLength: 100 });
    return crearResultadoSinCambios(listaTareas);
}

/**
 * Ejecuta la acción de mostrar estadísticas detalladas de las tareas (no modifica la lista).
 * Responsabilidad: Orquestar visualización de estadísticas.
 * @param {readonly Task[]} listaTareas - La lista de tareas.
 * @returns {MenuActionResult} Resultado indicando continuar sin cambios.
 */
export function ejecutarEstadisticas(listaTareas: readonly Task[]): MenuActionResult {
    clearMensaje("Estadísticas");
    const totalTareas = listaTareas.length;
    const tareasEliminadas = listaTareas.filter(t => t.eliminada).length;
    const tareasPendientes = listaTareas.filter(t => t.estado === 'pendiente' && !t.eliminada).length;
    const tareasEnCurso = listaTareas.filter(t => t.estado === 'en curso' && !t.eliminada).length;
    const tareasCompletadas = listaTareas.filter(t => t.estado === 'completada' && !t.eliminada).length;

    mensaje(`Total de Tareas: ${totalTareas}`);
    mensaje(`-------------------------`);
    mensaje(`Tareas Eliminadas: ${tareasEliminadas}`);
    mensaje(`Tareas Pendientes: ${tareasPendientes}`);
    mensaje(`Tareas En Curso: ${tareasEnCurso}`);
    mensaje(`Tareas Completadas: ${tareasCompletadas}`);
    mensaje(`-------------------------`);
    mensaje(`Tareas Faciles: ${listaTareas.filter(t => t.dificultad === 'facil ★☆☆' && !t.eliminada).length}`);
    mensaje(`Tareas Medias: ${listaTareas.filter(t => t.dificultad === 'medio ★★☆' && !t.eliminada).length}`);
    mensaje(`Tareas Dificiles: ${listaTareas.filter(t => t.dificultad === 'dificil ★★★' && !t.eliminada).length}`);
    prompt("\nPresiona cualquier tecla para continuar...", { puedeVacio: true, maxLength: 100 });
    return crearResultadoSinCambios(listaTareas);
}

/**
 * Valida que existan tareas disponibles para modificar.
 * @param tareasVisibles - Tareas no eliminadas
 * @returns true si no hay tareas (debe abortar), false si hay tareas
 */
function validarTareasParaModificar(tareasVisibles: readonly Task[]): boolean {
    if (tareasVisibles.length === 0) {
        clearMensaje("Modificar Tarea");
        mensaje("No hay tareas para modificar.");
        prompt("\nPresiona cualquier tecla para continuar...", { puedeVacio: true, maxLength: 100 });
        return true;
    }
    return false;
}

/**
 * Muestra la lista de tareas y solicita al usuario seleccionar una para modificar.
 * @param tareasVisibles - Tareas a mostrar
 * @returns Índice seleccionado
 */
function seleccionarTareaParaModificar(tareasVisibles: readonly Task[]): number {
    clearMensaje("Modificar Tarea");
    const lineasFormateadas = formatearListaTareas(tareasVisibles);
    lineasFormateadas.forEach(linea => mensaje(linea));
    return menuPrompt("\nIntroduce el número de la tarea a modificar o 0 para volver: ", 0, tareasVisibles.length);
}

/**
 * Modifica una tarea y muestra confirmación.
 * @param listaTareas - Lista completa de tareas
 * @param indice - Índice de la tarea a modificar (relativo a tareas visibles)
 * @returns Lista actualizada
 */
function modificarYConfirmar(listaTareas: readonly Task[], indice: number): readonly Task[] {
    const listaActualizada = modificarTareaEnLista(listaTareas, indice);
    prompt("Presiona cualquier tecla para continuar...", { puedeVacio: true, maxLength: 100 });
    return listaActualizada;
}

/**
 * Ejecuta la acción de modificar una tarea (modifica la lista).
 * Responsabilidad: Orquestar el flujo de modificación.
 * @param {readonly Task[]} listaTareas - La lista de tareas.
 * @returns {MenuActionResult} Resultado con la lista actualizada.
 */
export function ejecutarModificarTarea(listaTareas: readonly Task[]): MenuActionResult {
    const tareasVisibles = listaTareas.filter(t => !t.eliminada);

    if (validarTareasParaModificar(tareasVisibles)) {
        return crearResultadoSinCambios(listaTareas);
    }

    const indice = seleccionarTareaParaModificar(tareasVisibles);

    if (indice === 0) {
        return crearResultadoSinCambios(listaTareas);
    }

    const listaActualizada = modificarYConfirmar(listaTareas, indice);
    return crearResultadoConCambios(listaActualizada);
}

/**
 * Ejecuta la acción de salir.
 * @param {readonly Task[]} listaTareas - La lista de tareas.
 * @returns {MenuActionResult} Resultado indicando no continuar.
 */
export function ejecutarSalir(listaTareas: readonly Task[]): MenuActionResult {
    mensaje("Saliendo...");
    return crearResultadoSinCambios(listaTareas, false);
}

/**
 * Función pura que mapea una opción del menú a su acción correspondiente.
 * @param {number} opcion - La opción seleccionada.
 * @returns {(lista: readonly Task[]) => MenuActionResult} La función de acción.
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
