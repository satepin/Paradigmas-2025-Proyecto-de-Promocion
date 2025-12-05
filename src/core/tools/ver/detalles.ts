/* Esta es la tarea que elegiste:
 <nombre>
 <descripcion>

 <estado>
 <dificultad>
 <vencimiento>
 <creacion>

 si deseas editarla, pulsa E, o presiona 0 para salir.

 si un dato es vacio, indicarlo con una leyenda
 brindar la opcion de elegir tarea para ir al menu ver detalles (elegir otra directamente)
 al salir, volver al menu principal o anterior
 usar emojis para representar estados y dificultades
 validar entradas

 detalles.ts recibe una tarea y muestra sus detalles, ademas de brindar la opcion de editarla
 
 dividir en dos secciones: ver detalles y editar
 */

import { prompt } from '../modulos/promptSync.ts';
import type { Task } from '../../type.ts';
import { mensaje,clearMensaje } from '../../../interfaz/mensajes.ts';
import { verRelacionadas } from './busqueda/consultas.ts';
import { editarTareaInteractiva } from '../modificar/modificar.ts';
/**
 * Función pura que formatea una tarea como string para mostrar.
 * @param {Task} tarea - La tarea a formatear.
 * @returns {string} La representación en texto de la tarea.
 */
export function formatearTarea(tarea: Task): string {
    const lineas = [
        "Esta es la tarea que elegiste:",
        `ID: ${tarea.id}`,
        `Titulo: ${tarea.titulo}`,
        `Descripcion: ${tarea.descripcion || 'Sin descripción'}`,
        `Estado: ${tarea.estado}`,
        `Dificultad: ${tarea.dificultad}`,
        `Vencimiento: ${tarea.vencimiento?.toLocaleDateString() || 'Sin fecha de vencimiento'}`,
        `Creacion: ${tarea.creacion?.toLocaleDateString() || 'Sin fecha de creación'}`,
        `Categoria: ${tarea.categoria}`
    ];
    return lineas.join('\n');
}

/**
 * Muestra los detalles formateados de la tarea y las opciones disponibles.
 * Responsabilidad: Presentar detalles y menú de opciones.
 * @param detalles - Detalles formateados de la tarea
 */
function mostrarDetallesYOpciones(detalles: string): void {
    clearMensaje(`${detalles}\nPara editar, pulsa E\nPara ver tareas relacionadas, pulsa R\nPara salir, pulsa 0.`);
}

/**
 * Solicita al usuario una opción del menú de detalles.
 * Responsabilidad: Capturar entrada del usuario.
 * @returns Opción seleccionada (normalizada a minúsculas)
 */
function solicitarOpcionDetalles(): string {
    const opcion = prompt("Elige una opcion: ", { maxLength: 1, puedeVacio: false });
    return opcion.toLowerCase();
}

/**
 * Ejecuta la acción correspondiente a la opción seleccionada.
 * Responsabilidad: Delegar acciones según opción.
 * @param opcion - Opción seleccionada
 * @param tarea - Tarea sobre la cual ejecutar la acción
 * @param listaTareas - Lista completa de tareas
 * @returns true si se realizaron cambios que requieren recargar la lista
 */
function ejecutarOpcionDetalles(opcion: string, tarea: Task, listaTareas: readonly Task[]): boolean {
    switch (opcion) {
        case 'e':
            const tareaEditada = editarTareaInteractiva(tarea);
            return tareaEditada !== null; // Retorna true si hubo cambios
        case 'r':
            verRelacionadas(tarea, listaTareas);
            return false;
        case '0':
            mensaje("Saliendo...");
            return false;
        default:
            mensaje("Opción inválida.");
            return false;
    }
}

/**
 * Muestra los detalles de una tarea y permite editarla (versión completa con edición).
 * Responsabilidad: Orquestar flujo de visualización de detalles.
 * @param {Task} tarea - La tarea a mostrar/editar.
 * @param {readonly Task[]} listaTareas - La lista completa de tareas.
 * @returns {boolean} true si se realizaron cambios que requieren recargar la lista
 */
export function detalles(tarea: Task, listaTareas: readonly Task[]): boolean {
    const detallesFormateados = formatearTarea(tarea);
    mostrarDetallesYOpciones(detallesFormateados);
    
    const opcion = solicitarOpcionDetalles();
    return ejecutarOpcionDetalles(opcion, tarea, listaTareas);
}