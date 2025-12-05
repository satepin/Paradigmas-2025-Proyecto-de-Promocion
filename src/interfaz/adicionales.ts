import { verPrioridad, verVencidas } from "../core/tools/ver/busqueda/consultas.ts";
import { crearResultadoSinCambios } from "./exports.ts";
import type { Task } from '../core/type.ts';
import { menuPrompt } from "../core/tools/modulos/promptSync.ts";
import { clearMensaje } from "./mensajes.ts";

/**
 * Ejecuta el menú de consultas adicionales (tareas prioritarias, vencidas).
 * Responsabilidad: Orquestar flujo de consultas especiales.
 * @param {readonly Task[]} listaTareas - La lista de tareas
 * @returns {{ continuarEjecucion: boolean; listaTareasActualizada: readonly Task[]; }} Resultado sin cambios en la lista
 */
export function ejecutarConsultasAdicionales(listaTareas: readonly Task[]): { continuarEjecucion: boolean; listaTareasActualizada: readonly Task[]; } {
    clearMensaje("Consultas Adicionales\n1- Ver Tareas Prioritarias\n2 Ver Tareas Vencidas\n0- Volver");
    const opcion: number = menuPrompt("Elige una opcion: ", 0, 2);
    switch(opcion) {
        case 1: verPrioridad(listaTareas); break;
        case 2: verVencidas(listaTareas); break;
        case 0: return crearResultadoSinCambios(listaTareas);
    }
    return crearResultadoSinCambios(listaTareas);
}