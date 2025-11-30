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
import { verRelacionadas } from './consultas.ts';
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
 * Muestra los detalles de una tarea y permite editarla (versión completa con edición).
 * @param {Task} tarea - La tarea a mostrar/editar.
 * @returns {void}
 */
export function detalles(tarea: Task): void {
    const detalles = formatearTarea(tarea);
clearMensaje(`${detalles}\nPara editar, pulsa E\nPara ver tareas relacionadas, pulsa R\nPara salir, pulsa 0.`);
    const opcion: string = prompt("Elige una opcion: ", { maxLength: 1, puedeVacio: false });
    switch (opcion.toLowerCase()) {
        case 'e':
            // editarTarea(tarea);
            break;
        case 'r':
            verRelacionadas(tarea, [tarea]);
            break;
        case '0':
            mensaje("Saliendo...");
            break;
        default:
            mensaje("Opción inválida.");
    }
}