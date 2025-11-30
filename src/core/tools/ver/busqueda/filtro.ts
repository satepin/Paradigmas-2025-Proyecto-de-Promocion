import type { Task, TaskStatus } from "../../../type.ts";


export function filtrarPorEstado(
    tareas: readonly Task[],
    estado: TaskStatus
): readonly Task[] {
    return tareas.filter(t => t.estado === estado);
}

/**
 * Función pura que filtra tareas según la opción del menú.
 * @param {readonly Task[]} tareas - La lista de tareas a filtrar.
 * @param {number} opcion - La opción del menú (1=Todas, 2=Pendientes, 3=En curso, 4=Terminadas).
 * @returns {readonly Task[]} Las tareas filtradas.
 */
export function filtrarPorOpcion(
    tareas: readonly Task[],
    opcion: number
): readonly Task[] {
    switch(opcion) {
        case 1: return tareas;
        case 2: return filtrarPorEstado(tareas, 'pendiente');
        case 3: return filtrarPorEstado(tareas, 'en curso');
        case 4: return filtrarPorEstado(tareas, 'completada');
        default: return [];
    }
}
export function filtrarPorTitulo(
    listaTareas: readonly Task[],
    terminoBusqueda: string
): readonly Task[] {
    const busquedaLower = terminoBusqueda.toLowerCase();
    return listaTareas.filter(tarea => 
        tarea.titulo.toLowerCase().includes(busquedaLower)
    );
}