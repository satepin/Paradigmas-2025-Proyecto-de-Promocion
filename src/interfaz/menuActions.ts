/**
 * @module interfaz/menuActions
 * @description Orquestadores de acciones del menú (con efectos secundarios controlados).
 */

import { menuPrompt, prompt } from "../core/tools/modulos/promptSync.ts";
import { obtenerInfoAlmacenamiento } from "../core/tools/modulos/guardado.ts";
import { filtrarPorOpcion } from "../core/tools/ver/ver.ts";
import { filtrarPorTitulo } from "../core/tools/ver/buscar.ts";
import { listado, formatearListaTareas, obtenerTareaPorIndice } from "../core/tools/ver/listado.ts";
import { crear } from "../core/tools/alta/crear.ts";
import { agregar, agregarTarea } from "../core/tools/alta/agregar.ts";
import { eliminarTareaDelAlmacenamiento } from "../core/tools/modulos/guardado.ts";
import { taskFlags } from "../core/task.ts";
import type { Task } from '../core/type.ts';
import {
    crearResultadoSinCambios,
    crearResultadoConCambios,
    generarLineasMenu,
    mostrarLineasMenu
} from './menuHelpers.ts';

/**
 * Tipo para el resultado de una acción del menú.
 */
export type MenuActionResult = {
    readonly continuarEjecucion: boolean;
    readonly listaTareasActualizada: readonly Task[];
};

/**
 * Ejecuta la acción de ver tareas (no modifica la lista).
 * @param {readonly Task[]} listaTareas - La lista de tareas.
 * @returns {MenuActionResult} Resultado indicando continuar sin cambios.
 */
export function ejecutarVerTareas(listaTareas: readonly Task[]): MenuActionResult {
    const tareasVisibles = listaTareas.filter(t => !t.eliminada);
    const lineasMenu = generarLineasMenu(
        "¿Que tareas deseas ver?",
        ["1- Todas", "2- Pendientes", "3- En curso", "4- Terminadas"]
    );
    mostrarLineasMenu(lineasMenu);

    const opcion: number = menuPrompt("Elige una opcion: ", 0, 4);
    if (opcion === 0) {
        return crearResultadoSinCambios(listaTareas);
    }

    const filtradas = filtrarPorOpcion(tareasVisibles, opcion);
    listado(filtradas, opcion);
    return crearResultadoSinCambios(listaTareas);
}

/**
 * Ejecuta la acción de buscar tareas (no modifica la lista).
 * @param {readonly Task[]} listaTareas - La lista de tareas.
 * @returns {MenuActionResult} Resultado indicando continuar sin cambios.
 */
export function ejecutarBuscarTareas(listaTareas: readonly Task[]): MenuActionResult {
    console.clear();
    console.log("Buscar Tarea");
    const busqueda: string = prompt("Introduce el titulo de una tarea para buscarla: ", taskFlags.titulo);

    const tareasVisibles = listaTareas.filter(t => !t.eliminada);
    const resultados = filtrarPorTitulo(tareasVisibles, busqueda);

    if (resultados.length > 0) {
        listado(resultados, busqueda);
    } else {
        console.log("\nNo hay tareas relacionadas con la busqueda");
    }

    return crearResultadoSinCambios(listaTareas);
}

/**
 * Ejecuta la acción de agregar una tarea (modifica la lista).
 * @param {readonly Task[]} listaTareas - La lista de tareas.
 * @returns {MenuActionResult} Resultado con la lista actualizada.
 */
export function ejecutarAgregarTarea(listaTareas: readonly Task[]): MenuActionResult {
    console.clear();
    console.log("Agregar Tarea");
    // Usamos la función que hace la creación + guardado para persistir
    const listaActualizada = agregar(listaTareas);
    console.log("\n¡Tarea Agregada a la Lista!");
    console.log(`Total de Tareas: ${listaActualizada.length}`);
    return crearResultadoConCambios(listaActualizada);
}

/**
 * Marca una tarea como elimanada (Eliminacion logica).
 * @param {readonly Task[]} listaTareas - La lista de tareas.
 * @param {string} idTarea - El ID de la tarea a eliminar.
 * @returns {readonly Task[]} Nueva lista con la tarea marcada como eliminada.
 */
export function eliminarTareaLogicamente(
    listaTareas: readonly Task[],
    idTarea: string
): readonly Task[] {
    return listaTareas.map(tarea =>
        tarea.id === idTarea ? { ...tarea, eliminada: true } : tarea
    );
}

/**
 * Ejecuta la acción de eliminar una tarea (modifica la lista).
 * @param {readonly Task[]} listaTareas - La lista de tareas.
 * @returns {MenuActionResult} Resultado con la lista actualizada.
 */
export function ejecutarEliminarTarea(listaTareas: readonly Task[]): MenuActionResult {
    console.clear();
    console.log("Eliminar Tarea");

    const tareasVisibles = listaTareas.filter(t => !t.eliminada);

    if (tareasVisibles.length === 0) {
        console.log("No hay tareas para eliminar.");
        prompt("\nPresiona cualquier tecla para continuar...", { puedeVacio: true, maxLength: 100 });
        return crearResultadoSinCambios(listaTareas);
    }

    console.log("Selecciona la tarea que deseas eliminar:");
    const lineasFormateadas = formatearListaTareas(tareasVisibles);
    lineasFormateadas.forEach(linea => console.log(linea));

    const indice = menuPrompt("\nIntroduce el número de la tarea a eliminar o 0 para volver: ", 0, tareasVisibles.length);

    if (indice === 0) {
        return crearResultadoSinCambios(listaTareas);
    }

    const tareaAEliminar = obtenerTareaPorIndice(tareasVisibles, indice);

    if (tareaAEliminar) {
        // Actualizar también en el almacenamiento persistente
        const listaActualizada = eliminarTareaDelAlmacenamiento(tareaAEliminar.id);
        console.log(`\n¡Tarea "${tareaAEliminar.titulo}" eliminada!`);
        prompt("Presiona cualquier tecla para continuar...", { puedeVacio: true, maxLength: 100 });
        return crearResultadoConCambios(listaActualizada);
    }

    console.log("Índice no válido.");
    prompt("\nPresiona cualquier tecla para continuar...", { puedeVacio: true, maxLength: 100 });
    return crearResultadoSinCambios(listaTareas);
}
/**
 * Ejecuta la acción de mostrar información del almacenamiento (no modifica la lista).
 * @param {readonly Task[]} listaTareas - La lista de tareas.
 * @returns {MenuActionResult} Resultado indicando continuar sin cambios.
 */
export function ejecutarInfoAlmacenamiento(listaTareas: readonly Task[]): MenuActionResult {
    console.clear();
    console.log("Información del Almacenamiento");
    const info = obtenerInfoAlmacenamiento();
    console.log(info);
    prompt("\nPresiona cualquier tecla para continuar...", { puedeVacio: true, maxLength: 100 });
    return crearResultadoSinCambios(listaTareas);
}

/**
 * Ejecuta la acción de salir.
 * @param {readonly Task[]} listaTareas - La lista de tareas.
 * @returns {MenuActionResult} Resultado indicando no continuar.
 */
export function ejecutarSalir(listaTareas: readonly Task[]): MenuActionResult {
    console.log("Saliendo...");
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
        case 0: return ejecutarSalir;
        default:
            return (lista) => {
                console.log("Opción no válida");
                return crearResultadoSinCambios(lista);
            };
    }
}
