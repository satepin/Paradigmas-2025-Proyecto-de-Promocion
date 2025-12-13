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
*- Fecha de Vencimiento
*
*agregar.ts recibe una tarea creada y verificada en crear.ts y la agrega a una lista de tareas
**/

import { crear } from './crear.ts';
import { TaskRepository } from '../modulos/guardado.ts';
import type { Task } from '../../type.ts';
import { mensaje, clearMensaje } from '../../../interfaz/mensajes.ts';

/**
 * Agrega una nueva tarea a la lista (función pura).
 * @param {Task[]} listaTareas - La lista original de tareas (no se muta).
 * @param {Task} nuevaTarea - La tarea a agregar.
 * @returns {Task[]} Una nueva lista con la tarea agregada.
 */
export function agregarTarea(listaTareas: readonly Task[], nuevaTarea: Task): readonly Task[] {
    return [...listaTareas, nuevaTarea];
}

/**
 * Función que prepara el resultado de guardar una tarea.
 * @param {Task} tarea - Tarea guardada
 * @param {number} totalTareas - Total de tareas después de agregar
 * @returns {object} Objeto con resultado de la operación
 */
function crearResultadoGuardado(tarea: Task, totalTareas: number): { tarea: Task; totalTareas: number } {
    return { tarea, totalTareas };
}

/**
 * Efectúa el guardado en repositorio (efecto secundario aislado).
 * @param {Task} tarea - Tarea a guardar
 * @param {number} totalTareas - Total de tareas
 * @returns {void}
 */
function ejecutarGuardado(tarea: Task, totalTareas: number): void {
    const repository = new TaskRepository();
    repository.agregar(tarea);
    mensaje(`Total de Tareas: ${totalTareas}`);
}

/**
 * Función que crea una tarea mediante input del usuario (efecto secundario aislado).
 * @returns {Task} Nueva tarea creada
 */
function crearTareaInteractiva(): Task {
    clearMensaje("Agregar Tarea");
    return crear();
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
    const resultado = crearResultadoGuardado(nuevaTarea, listaActualizada.length);
    ejecutarGuardado(resultado.tarea, resultado.totalTareas);
    return listaActualizada;
}