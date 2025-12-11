/* Estas creando una nueva tarea
1. Ingresa el titulo: -
2. Ingresa la descripcion: -
3. estado (pendiente, en curso, terminada): -
4. dificultad (facil, medio, dificil): -
5. vencimiento (dd/mm/aaaa): -

¡Datos Guardados!
presiona cualquier tecla para continuar...

- Nuestra persona usuaria debe poder ingresar un cada atributo por separado.
- Para el atributo Estado, deben darse opciones de ingreso, ya que los valores son acotados.
- Para el atributo Dificultad, deben darse opciones de ingreso, ya que los valores son acotados.
- Debe informarse que se han guardado los datos.
- La persona debe poder volver al Menu principal o al Menu anterior (a criterio del equipo de desarrollo)
- Fecha de Vencimiento (BONUS)

crear.ts se encarga de la creacion y validacion de una unica unidad de tarea, que sera retornada para su manejo en agregar.ts
*/

import { v4 as uuidv4 } from 'uuid';
import { Task } from '../../type.ts'
import type { TaskStatus, TaskDifficulty } from '../../type.ts';
import { nuevaTareaMensajeGuardado, nuevaTareaMensajeInicio, setCategoria, setDescripcion, setDificultad, setEstado, setTitulo, setVencimiento } from './funcionesCrear.ts';
import { obtenerFechaActual } from '../modulos/fechas.ts';

/**
 * Función pura que crea una tarea a partir de datos ya validados.
 * @param {string} id - El ID de la tarea
 * @param {string} titulo - El título de la tarea
 * @param {string} descripcion - La descripción de la tarea
 * @param {TaskStatus} estado - El estado de la tarea
 * @param {TaskDifficulty} dificultad - La dificultad de la tarea
 * @param {Date} fechaActual - Fecha de creación
 * @param {Date | null} vencimiento - Fecha de vencimiento
 * @param {boolean} eliminada - Indicador de eliminación
 * @param {string} categoria - La categoría de la tarea
 * @returns {Task} La tarea creada
 */
export function crearTareaDesdeValores(
    id: string,
    titulo: string,
    descripcion: string,
    estado: TaskStatus,
    dificultad: TaskDifficulty,
    fechaActual: Date,
    vencimiento: Date | null,
    categoria: string
): Task {
    return Task.fromPlain({
        id,
        titulo,
        descripcion,
        estado,
        dificultad,
        creacion: fechaActual,
        uEdicion: fechaActual,
        vencimiento,
        categoria,
        eliminada: false
    });
}

/**
 * Orquesta la creación de una tarea (con efectos secundarios de I/O).
 * Esta función maneja la lógica de presentación y entrada del usuario.
 * @returns {Task} El objeto de tarea recién creado.
 */

export function crearLogica(): Task {
const titulo: string = setTitulo();
    const descripcion: string = setDescripcion();
    const estado: TaskStatus = setEstado() as TaskStatus;
    const dificultad: TaskDifficulty = setDificultad() as TaskDifficulty;
    const vencimiento: Date | null = setVencimiento();
    const categoria: string = setCategoria();
    const fechaActual: Date = obtenerFechaActual();
    
    // Delegamos a la función pura
    const nuevaTarea = crearTareaDesdeValores(
        uuidv4(),
        titulo,
        descripcion,
        estado,
        dificultad,
        fechaActual,
        vencimiento,
        categoria
    );

    return nuevaTarea;
}

export function crear(): Task {
    nuevaTareaMensajeInicio();

    crearLogica();

    nuevaTareaMensajeGuardado();

    return crearLogica();
}