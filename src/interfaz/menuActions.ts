/**
 * @module interfaz/menuActions
 * @description Orquestadores de acciones del menú (con efectos secundarios controlados).
 */

import { menuPrompt, prompt } from "../core/tools/input/promptSync.js";
import { filtrarPorOpcion } from "../core/tools/ver/ver.js";
import { filtrarPorTitulo } from "../core/tools/ver/buscar.js";
import { listado } from "../core/tools/ver/listado.js";
import { crear } from "../core/tools/alta/crear.js";
import { agregarTarea } from "../core/tools/alta/agregar.js";
import { taskFlags } from "../core/task.js";
import type { Task } from '../core/type.js';
import { 
    crearResultadoSinCambios, 
    crearResultadoConCambios,
    generarLineasMenu,
    mostrarLineasMenu
} from './menuHelpers.js';

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
    const lineasMenu = generarLineasMenu(
        "¿Que tareas deseas ver?",
        ["1- Todas", "2- Pendientes", "3- En curso", "4- Terminadas"]
    );
    mostrarLineasMenu(lineasMenu);
    
    const opcion: number = menuPrompt("Elige una opcion: ", 0, 4);
    if (opcion === 0) { 
        return crearResultadoSinCambios(listaTareas);
    }
    
    const filtradas = filtrarPorOpcion(listaTareas, opcion);
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
    
    const resultados = filtrarPorTitulo(listaTareas, busqueda);
    
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
    const nuevaTarea = crear();
    const listaActualizada = agregarTarea(listaTareas, nuevaTarea);
    console.log("\n¡Tarea Agregada a la Lista!");
    console.log(`Total de Tareas: ${listaActualizada.length}`);
    return crearResultadoConCambios(listaActualizada);
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
        case 0: return ejecutarSalir;
        default: 
            return (lista) => {
                console.log("Opción no válida");
                return crearResultadoSinCambios(lista);
            };
    }
}
