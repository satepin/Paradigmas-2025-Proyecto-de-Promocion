/**
 * @module tools/alta/agregar
 * @description Orquesta la adición de una nueva tarea a la lista.
 * Requisitos Funcionales:
* Estas creando una nueva tarea
*1. Ingresa el titulo: -
*2. Ingresa la descripcion: -
*3. estado (pendiente, en curso, terminada): -
*4. dificultad (facil, medio, dificil): -
*5. vencimiento (dd/mm/aaaa): -
*
*¡Datos Guardados!
*presiona cualquier tecla para continuar...
*
*- Nuestra persona usuaria debe poder ingresar un cada atributo por separado.
*- Para el atributo Estado, deben darse opciones de ingreso, ya que los valores son acotados.
*- Para el atributo Dificultad, deben darse opciones de ingreso, ya que los valores son acotados.
*- Debe informarse que se han guardado los datos.
*- La persona debe poder volver al Menu principal o al Menu anterior (a criterio del equipo de desarrollo)
*- Fecha de Vencimiento (BONUS)
*
*agregar.ts recibe una tarea creada y verificada en crear.ts y la agrega a una lista de tareas
**/

import { crear } from './crear.ts';
import { TaskRepository } from '../modulos/guardado.ts'; // Función para guardar tarea en JSON
import type { Task } from '../../type.ts';
import { mensaje,clearMensaje } from '../../../interfaz/mensajes.ts';
/**
 * Agrega una nueva tarea a la lista (función pura).
 * @param {Task[]} listaTareas - La lista original de tareas (no se muta).
 * @param {Task} nuevaTarea - La tarea a agregar.
 * @returns {Task[]} Una nueva lista con la tarea agregada.
 */
export function agregarTarea(listaTareas: readonly Task[], nuevaTarea: Task): readonly Task[] {
    return [...listaTareas, nuevaTarea]; // Retorna una nueva lista con la nueva tarea añadida
}

/**
 * Función que crea una tarea mediante input del usuario.
 * @returns {Task} Nueva tarea creada
 */
function crearTareaInteractiva(): Task {
    clearMensaje("Agregar Tarea");
    return crear();
}

/**
 * Función que guarda una tarea y muestra confirmación.
 * @param {Task} tarea - Tarea a guardar
 * @returns {void}
 */
function guardarYConfirmar(tarea: Task, totalTareas: number): void {
    const repository = new TaskRepository();
    repository.agregar(tarea); 
    mensaje(`Total de Tareas: ${totalTareas}`);
}

/**
 * Orquesta la adición de una nueva tarea a la lista.
 * Responsabilidad única: coordinar flujo de agregar tarea.
 * @param {Task[]} listaTareas - La lista de tareas.
 * @returns {Task[]} La nueva lista con la tarea agregada.
 */
export function agregar(listaTareas: readonly Task[]): readonly Task[] {
    const nuevaTarea = crearTareaInteractiva();
    const listaActualizada = agregarTarea(listaTareas, nuevaTarea);
    guardarYConfirmar(nuevaTarea, listaActualizada.length);
    return listaActualizada;
}