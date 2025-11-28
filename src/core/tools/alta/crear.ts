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

import { prompt, set, datePrompt} from '../input/promptSync.js';
import { taskFlags } from '../../task.js';
import type { Task, TaskStatus, TaskDifficulty } from '../../type.js';

/**
 * Función pura que crea una tarea a partir de datos ya validados.
 * @param {string} titulo - El título de la tarea
 * @param {string} descripcion - La descripción de la tarea
 * @param {TaskStatus} estado - El estado de la tarea
 * @param {TaskDifficulty} dificultad - La dificultad de la tarea
 * @param {Date} fechaActual - Fecha de creación
 * @param {Date | null} vencimiento - Fecha de vencimiento
 * @returns {Task} La tarea creada
 */
export function crearTareaDesdeValores(
    titulo: string,
    descripcion: string,
    estado: TaskStatus,
    dificultad: TaskDifficulty,
    fechaActual: Date,
    vencimiento: Date | null
): Task {
    return {
        titulo,
        descripcion,
        estado,
        creacion: fechaActual,
        uEdicion: fechaActual,
        vencimiento,
        dificultad
    };
}

/**
 * Función de utilidad que obtiene la fecha actual (efectos secundarios aislados).
 * @returns {Date} La fecha actual.
 */
function obtenerFechaActual(): Date {
    return new Date();
}

/**
 * Orquesta la creación de una tarea (con efectos secundarios de I/O).
 * Esta función maneja la lógica de presentación y entrada del usuario.
 * @returns {Task} El objeto de tarea recién creado.
 */
export function crear(): Task {
    console.clear();
    console.log("Estas creando una nueva tarea");

    // 1. Título
    const titulo: string = prompt("1. Ingresa el titulo: ", taskFlags.titulo);

    // 2. Descripción
    const descripcion: string = prompt("2. Ingresa la descripcion: ", taskFlags.descripcion);

    // 3. Estado - Convertir ReadonlyMap a Array de entries
    const estadoEntries = Array.from(taskFlags.estado.entries());
    console.log("\n3. Selecciona un estado:");
    estadoEntries.forEach(([key, value]) => console.log(`   ${value}. ${key}`));
    const estadoInput = prompt("   Opción: ");
    const estado = estadoEntries.find(([_, value]) => value.toString() === estadoInput)?.[0] || 'pendiente' as const;

    // 4. Dificultad - Convertir ReadonlyMap a Array de entries
    const dificultadEntries = Array.from(taskFlags.dificultad.entries());
    console.log("\n4. Selecciona una dificultad:");
    dificultadEntries.forEach(([key, value]) => console.log(`   ${value}. ${key}`));
    const dificultadInput = prompt("   Opción: ");
    const dificultad = dificultadEntries.find(([_, value]) => value.toString() === dificultadInput)?.[0] || 'facil' as const;
    
    // 5. Vencimiento (BONUS)
    const vencimiento: Date | null = datePrompt("5. Ingresa la fecha de vencimiento (aaaa/mm/dd) o deja en blanco: ");

    // Fechas de creación y edición (efecto secundario aislado)
    const fechaActual: Date = obtenerFechaActual();
    
    // Delegamos a la función pura
    const nuevaTarea = crearTareaDesdeValores(
        titulo,
        descripcion,
        estado,
        dificultad,
        fechaActual,
        vencimiento
    );

    console.log("\n¡Datos Guardados!");

    return nuevaTarea;
}