import { verPrioridad, verRelacionadas, verVencidas } from "../core/tools/ver/consultas.ts";
import { crearResultadoSinCambios } from "./exports.ts";
import type { Task } from '../core/type.ts';
import { menuPrompt } from "../core/tools/modulos/promptSync.ts";
import { clearMensaje } from "./mensajes.ts";
//menu para acceder a las consultas adicionales
export function ejecutarConsultasAdicionales(listaTareas: readonly Task[]): { continuarEjecucion: boolean; listaTareasActualizada: readonly Task[]; } {
    clearMensaje("Consultas Adicionales\n1- Ver Tareas Prioritarias\n2- Ver Tareas Relacionadas\n3- Ver Tareas Vencidas\n0- Volver");
    const opcion: number = menuPrompt("Elige una opcion: ", 0, 3);
    switch(opcion) {
        case 1: verPrioridad(listaTareas); break;
        case 2: verRelacionadas(listaTareas); break;
        case 3: verVencidas(listaTareas); break;
        case 0: return crearResultadoSinCambios(listaTareas);
    }
    return crearResultadoSinCambios(listaTareas);
}