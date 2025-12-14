/**
 * @module interfaz/menuActions
 * @description Orquestadores de acciones del menú principal.
 * 
 * Este módulo contiene todas las acciones ejecutables desde el menú principal.
 * Cada acción orquesta el flujo completo de una operación, incluyendo:
 * - Validaciones
 * - Interacción con el usuario
 * - Modificaciones de estado
 * - Presentación de resultados
 * 
 * Organización:
 * 1. Tipos
 * 2. Ver tareas (opción 1)
 * 3. Buscar tareas (opción 2)
 * 4. Agregar tarea (opción 3)
 * 5. Eliminar tarea (opción 4)
 * 6. Info almacenamiento (opción 5)
 * 7. Estadísticas (opción 6)
 * 8. Consultas adicionales (opción 7)
 * 9. Modificar tarea (opción 8)
 * 10. Salir (opción 0)
 * 11. Mapeo de opciones
 */

import type { Task } from '../../../core/type.ts';
import { menuPrompt, prompt } from "../../../core/tools/modulos/promptSync.ts";
import { TaskRepository } from "../../../core/tools/modulos/guardado.ts";
import { filtrarPorOpcion, filtrarPorTitulo } from "../../../core/tools/ver/busqueda/filtro.ts";
import { listado, formatearListaTareas, obtenerTareaPorIndice } from "../../../core/tools/ver/listado.ts";
import { agregar } from "../../../core/tools/alta/agregar.ts";
import { modificarTareaEnLista } from "../../../core/tools/modificar/modificar.ts";
import { taskFlags } from "../../../core/tools/validaciones.ts";
import { mensaje, clearMensaje } from "../../mensajes.ts";
import { ejecutarConsultasAdicionales } from "./adicionales.ts";
import {
    crearResultadoSinCambios,
    crearResultadoConCambios,
    generarLineasMenu,
    mostrarLineasMenu
} from "./helpers.ts";

// ============================================================================
// TIPOS
// ============================================================================

/**
 * Resultado de una acción del menú.
 * Contiene el nuevo estado de la aplicación después de ejecutar la acción.
 */
export type MenuActionResult = {
    readonly continuarEjecucion: boolean;
    readonly listaTareasActualizada: readonly Task[];
};

const repository = new TaskRepository();

// ============================================================================
// OPCIÓN 1: VER TAREAS
// ============================================================================

/**
 * Muestra el menú de opciones para ver tareas y captura la selección.
 * @returns Número de opción seleccionada (0-4)
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
 * Ejecuta la acción de ver tareas filtradas.
 * No modifica la lista de tareas.
 * 
 * Flujo:
 * 1. Filtra tareas no eliminadas
 * 2. Muestra menú de opciones
 * 3. Aplica filtro según selección
 * 4. Muestra el listado
 * 
 * @param listaTareas - La lista actual de tareas
 * @returns Resultado indicando continuar sin cambios
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

// ============================================================================
// OPCIÓN 2: BUSCAR TAREAS
// ============================================================================

/**
 * Solicita al usuario el término de búsqueda.
 * @returns Término de búsqueda ingresado
 */
function solicitarTerminoBusqueda(): string {
    clearMensaje("Buscar Tarea");
    return prompt("Introduce el titulo de una tarea para buscarla: ", taskFlags.titulo);
}

/**
 * Muestra los resultados de búsqueda o un mensaje si no hay coincidencias.
 * @param resultados - Tareas encontradas
 * @param busqueda - Término buscado
 */
function mostrarResultadosBusqueda(resultados: readonly Task[], busqueda: string): void {
    if (resultados.length > 0) {
        listado(resultados, busqueda);
    } else {
        mensaje("\nNo hay tareas relacionadas con la busqueda");
    }
}

/**
 * Ejecuta la acción de buscar tareas por título.
 * No modifica la lista de tareas.
 * 
 * Flujo:
 * 1. Solicita término de búsqueda
 * 2. Filtra tareas no eliminadas
 * 3. Busca coincidencias por título
 * 4. Muestra resultados
 * 
 * @param listaTareas - La lista actual de tareas
 * @returns Resultado indicando continuar sin cambios
 */
export function ejecutarBuscarTareas(listaTareas: readonly Task[]): MenuActionResult {
    const busqueda = solicitarTerminoBusqueda();
    const tareasVisibles = listaTareas.filter(t => !t.eliminada);
    const resultados = filtrarPorTitulo(tareasVisibles, busqueda);
    mostrarResultadosBusqueda(resultados, busqueda);
    return crearResultadoSinCambios(listaTareas);
}

// ============================================================================
// OPCIÓN 3: AGREGAR TAREA
// ============================================================================

/**
 * Ejecuta la acción de agregar una nueva tarea.
 * Modifica la lista de tareas.
 * 
 * Flujo:
 * 1. Limpia pantalla
 * 2. Llama al módulo de agregado (creación + guardado)
 * 3. Muestra confirmación con total de tareas
 * 
 * @param listaTareas - La lista actual de tareas
 * @returns Resultado con la lista actualizada
 */
export function ejecutarAgregarTarea(listaTareas: readonly Task[]): MenuActionResult {
    clearMensaje("Agregar Tarea");
    const listaActualizada = agregar(listaTareas);
    mensaje(`\n¡Tarea Agregada a la Lista!\nTotal de Tareas: ${listaActualizada.length}`);
    return crearResultadoConCambios(listaActualizada);
}

// ============================================================================
// OPCIÓN 4: ELIMINAR TAREA
// ============================================================================

/**
 * Verifica si hay tareas disponibles para eliminar.
 * @param tareasVisibles - Tareas no eliminadas
 * @returns true si no hay tareas (debe abortar)
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
 * Muestra la lista de tareas y solicita al usuario seleccionar una para eliminar.
 * @param tareasVisibles - Tareas a mostrar
 * @returns Índice seleccionado (0 para volver)
 */
function seleccionarTareaParaEliminar(tareasVisibles: readonly Task[]): number {
    clearMensaje("Eliminar Tarea");
    mensaje("Selecciona la tarea que deseas eliminar:");
    const lineasFormateadas = formatearListaTareas(tareasVisibles);
    lineasFormateadas.forEach(linea => mensaje(linea));
    return menuPrompt("\nIntroduce el número de la tarea a eliminar o 0 para volver: ", 0, tareasVisibles.length);
}

/**
 * Elimina una tarea del almacenamiento y muestra confirmación.
 * @param tarea - Tarea a eliminar
 * @returns Lista actualizada después de la eliminación
 */
function eliminarYConfirmar(tarea: Task): readonly Task[] {
    const listaActualizada = repository.eliminar(tarea.id);
    mensaje(`\n¡Tarea "${tarea.titulo}" eliminada!`);
    prompt("Presiona cualquier tecla para continuar...", { puedeVacio: true, maxLength: 100 });
    return listaActualizada;
}

/**
 * Ejecuta la acción de eliminar una tarea.
 * Modifica la lista de tareas.
 * 
 * Flujo:
 * 1. Valida que haya tareas disponibles
 * 2. Muestra lista y solicita selección
 * 3. Elimina la tarea seleccionada
 * 4. Muestra confirmación
 * 
 * @param listaTareas - La lista actual de tareas
 * @returns Resultado con la lista actualizada o sin cambios
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
// ============================================================================
// OPCIÓN 5: INFORMACIÓN DEL ALMACENAMIENTO
// ============================================================================

/**
 * Ejecuta la acción de mostrar información del almacenamiento.
 * No modifica la lista de tareas.
 * 
 * Flujo:
 * 1. Limpia pantalla
 * 2. Obtiene información del sistema de almacenamiento
 * 3. Muestra la información
 * 4. Espera confirmación del usuario
 * 
 * @param listaTareas - La lista actual de tareas
 * @returns Resultado indicando continuar sin cambios
 */
export function ejecutarInfoAlmacenamiento(listaTareas: readonly Task[]): MenuActionResult {
    clearMensaje("Información del Almacenamiento");
    const info = repository.obtenerInfo();
    mensaje(info);
    prompt("\nPresiona cualquier tecla para continuar...", { puedeVacio: true, maxLength: 100 });
    return crearResultadoSinCambios(listaTareas);
}

// ============================================================================
// OPCIÓN 6: ESTADÍSTICAS
// ============================================================================

export function calcularEstadisticas(tareas: readonly Task[]) {
    return {
        totalTareas: tareas.length,
        tareasEliminadas: tareas.filter(t => t.eliminada).length,
        tareasPendientes: tareas.filter(t => t.estado === 'pendiente' && !t.eliminada).length,
        tareasEnCurso: tareas.filter(t => t.estado === 'en curso' && !t.eliminada).length,
        tareasCompletadas: tareas.filter(t => t.estado === 'completada' && !t.eliminada).length,
        tareasDificiles: tareas.filter(t => t.dificultad === 'dificil ★★★' && !t.eliminada).length,
        tareasMedias: tareas.filter(t => t.dificultad === 'medio ★★☆' && !t.eliminada).length,
        tareasFaciles: tareas.filter(t => t.dificultad === 'facil ★☆☆' && !t.eliminada).length
    };
}

function mostrarEstadisticas(stats: any): void {
    mensaje(`Total de Tareas: ${stats.totalTareas}
    -------------------------
    Tareas Eliminadas: ${stats.tareasEliminadas}
    Tareas Pendientes: ${stats.tareasPendientes}
    Tareas En Curso: ${stats.tareasEnCurso}
    Tareas Completadas: ${stats.tareasCompletadas}
    -------------------------
    Tareas Dificiles: ${stats.tareasDificiles}
    Tareas Medias: ${stats.tareasMedias}
    Tareas Faciles: ${stats.tareasFaciles}`);
    prompt(`Presiona cualquier tecla para continuar...`, { puedeVacio: true, maxLength: 100 });
}

export function ejecutarEstadisticas(tareas: readonly Task[]): MenuActionResult {
    const stats = calcularEstadisticas(tareas);
    mostrarEstadisticas(stats);
    return crearResultadoSinCambios(tareas);
}

// ============================================================================
// OPCIÓN 7: CONSULTAS ADICIONALES
// ============================================================================

// Esta función se importa directamente de adicionales.ts
// export { ejecutarConsultasAdicionales };

// ============================================================================
// OPCIÓN 8: MODIFICAR TAREA
// ============================================================================

/**
 * Valida que existan tareas disponibles para modificar.
 * @param tareasVisibles - Tareas no eliminadas
 * @returns true si no hay tareas (debe abortar)
 */
function validarTareasParaModificar(tareasVisibles: readonly Task[]): boolean {
    if (tareasVisibles.length === 0) {
        clearMensaje("Modificar Tarea");
        mensaje("No hay tareas para modificar.");
        prompt(`Presiona cualquier tecla para continuar...`, { puedeVacio: true, maxLength: 100 });
        return true;
    }
    return false;
}

/**
 * Muestra la lista de tareas y solicita al usuario seleccionar una para modificar.
 * @param tareasVisibles - Tareas a mostrar
 * @returns Índice seleccionado (0 para volver)
 */
function seleccionarTareaParaModificar(tareasVisibles: readonly Task[]): number {
    clearMensaje("Modificar Tarea");
    const lineasFormateadas = formatearListaTareas(tareasVisibles);
    lineasFormateadas.forEach(linea => mensaje(linea));
    return menuPrompt("\nIntroduce el número de la tarea a modificar o 0 para volver: ", 0, tareasVisibles.length);
}

/**
 * Modifica una tarea y espera confirmación del usuario.
 * @param listaTareas - Lista completa de tareas
 * @param indice - Índice de la tarea a modificar (relativo a tareas visibles)
 * @returns Lista actualizada después de la modificación
 */
function modificarYConfirmar(listaTareas: readonly Task[], indice: number): readonly Task[] {
    const listaActualizada = modificarTareaEnLista(listaTareas, indice);
    prompt("Presiona cualquier tecla para continuar...", { puedeVacio: true, maxLength: 100 });
    return listaActualizada;
}

/**
 * Ejecuta la acción de modificar una tarea.
 * Modifica la lista de tareas.
 * 
 * Flujo:
 * 1. Valida que haya tareas disponibles
 * 2. Muestra lista y solicita selección
 * 3. Modifica la tarea seleccionada
 * 4. Espera confirmación
 * 
 * @param listaTareas - La lista actual de tareas
 * @returns Resultado con la lista actualizada o sin cambios
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

// ============================================================================
// OPCIÓN 0: SALIR
// ============================================================================

/**
 * Ejecuta la acción de salir de la aplicación.
 * 
 * @param listaTareas - La lista actual de tareas
 * @returns Resultado indicando no continuar (sale del ciclo del menú)
 */
export function ejecutarSalir(listaTareas: readonly Task[]): MenuActionResult {
    mensaje("Saliendo...");
    return crearResultadoSinCambios(listaTareas, false);
}