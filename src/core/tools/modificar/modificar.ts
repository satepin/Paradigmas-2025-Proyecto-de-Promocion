/**
 * @module tools/ver/modificar
 * @description Módulo para la edición interactiva de tareas.
 * Proporciona funciones puras y la envoltura I/O que usa promptSync.
 */

import { prompt, set } from '../modulos/promptSync.ts';
import { datePrompt } from '../modulos/fechas.ts';
import { TaskRepository } from '../modulos/guardado.ts'
import type { Task, TaskStatus, TaskDifficulty } from '../../type.ts';
import { mensaje } from '../../../interfaz/mensajes.ts';
import { taskFlags, validarDescripcion, validarEstado, validarDificultad, validarCategoria } from '../validaciones.ts';

/**
 * Aplica cambios a una tarea.
 */
export function aplicarCambiosA(tarea: Task, cambios: Partial<Task>): Task {
    return { ...tarea, ...cambios } as Task;
}

/**
 * Interfaz interactiva (I/O) para editar una tarea.
 * Devuelve la tarea actualizada si se guardaron cambios; null si se canceló.
 */
export function editarTareaInteractiva(tarea: Task): Task | null {
    mensaje("Editar tarea:");
    let editable: Task = { ...tarea } as Task;
    let continuar = true;
    while (continuar) {
        mensaje('\nCampos editables:');
        mensaje('1 - Descripción');
        mensaje('2 - Estado');
        mensaje('3 - Dificultad');
        mensaje('4 - Vencimiento');
        mensaje('0 - Finalizar edición');
        const campo = prompt(`Selecciona el número del campo a editar: `, { maxLength: 1, puedeVacio: false });
        switch (campo) {
            case '1': { // DESCRIPCIÓN
                // 1. I/O: Obtener input (Impuro)
                const input = prompt(`Descripcion [${editable.descripcion}]: `);

                // 2. Lógica de UI: Si el usuario da Enter vacío, mantenemos el viejo y salimos.
                if (input === null || input.trim() === '') {
                    console.log("Se mantiene el título actual.");
                    break;
                }

                // 3. Validación Pura (Usando función externa)
                const validacion = validarDescripcion(input, taskFlags.descripcion);

                if (!validacion.valid) {
                    // Manejo de error (Impuro: imprimir en pantalla)
                    console.error(`Error: ${validacion.error}`);
                } else {
                    // 4. Actualización de estado (Creando nuevo objeto, inmutabilidad)
                    editable = Object.assign(
                        Object.create(Object.getPrototypeOf(editable)), editable, { descripcion: input.trim() });
                    console.log("Título actualizado correctamente.");
                }
                break;
            }
            case '2': { // ESTADO
                // 1. I/O: Mostrar opciones y pedir entrada
                mensaje(`\nEstado actual: ${editable.estado}`);
                mensaje('Opciones de estado:');
                for (const [clave, valor] of taskFlags.estado.entries()) {
                    mensaje(`- ${valor}: ${clave}`);
                }

                const inputStr = prompt("Seleccione el número del nuevo estado: ");
                const inputNum = parseInt(inputStr || "0");

                // 2. Validación Pura
                const validacion = validarEstado(inputNum, taskFlags.estado);

                if (!validacion.valid) {
                    console.error(validacion.error);
                    break;
                }

                // 3. Reverse Lookup
                // Tenemos el número (2), necesitamos el string ("en curso")
                // Buscamos en el mapa la entrada cuyo valor coincida con el input
                const nuevaClave = [...taskFlags.estado.entries()]
                    .find(([clave, valor]) => valor === inputNum)?.[0];

                if (!nuevaClave) {
                    // Esto no debería pasar si la validación pasó, pero TypeScript es denso
                    console.error("Error crítico al resolver el estado.");
                    break;
                }

                // 4. Actualización de Estado
                // Técnica segura para no perder los métodos de la clase Task
                editable = Object.assign(
                    Object.create(Object.getPrototypeOf(editable)),
                    editable,
                    { estado: nuevaClave }
                );

                console.log(`Estado actualizado a: ${nuevaClave}`);
                break;
            }
            case '3': { // DIFICULTAD
                // 1. I/O: Mostrar opciones y pedir entrada
                mensaje(`\nDificultad actual: ${editable.dificultad}`);
                mensaje('Opciones de estado:');
                for (const [clave, valor] of taskFlags.dificultad.entries()) {
                    mensaje(`- ${valor}: ${clave}`);
                }

                const inputStr = prompt("Seleccione el número de la nueva dificultad: ");
                const inputNum = parseInt(inputStr || "0");

                // 2. Validación Pura
                const validacion = validarDificultad(inputNum, taskFlags.dificultad);

                if (!validacion.valid) {
                    console.error(validacion.error);
                    break;
                }

                // 3. Reverse Lookup
                // Tenemos el número (2), necesitamos el string ("en curso")
                // Buscamos en el mapa la entrada cuyo valor coincida con el input
                const nuevaClave = [...taskFlags.dificultad.entries()]
                    .find(([clave, valor]) => valor === inputNum)?.[0];

                if (!nuevaClave) {
                    // Esto no debería pasar si la validación pasó, pero TypeScript es denso
                    console.error("Error crítico al resolver el estado.");
                    break;
                }

                // 4. Actualización de Estado
                // Técnica segura para no perder los métodos de la clase Task
                editable = Object.assign(
                    Object.create(Object.getPrototypeOf(editable)),
                    editable,
                    { dificultad: nuevaClave }
                );

                console.log(`Dificultad actualizada a: ${nuevaClave}`);
                break;
            }

            case '4': {
                const fv = datePrompt('Vencimiento (yyyy/mm/dd) - dejar vacío para conservar: ', true);
                const nuevaVenc = fv === null ? editable.vencimiento : fv;
                editable = { ...editable, vencimiento: nuevaVenc } as Task;
                break;
            }
            case '0': {
                continuar = false;
                break;
            }
            default: {
                mensaje('Opción inválida. Intenta nuevamente.');
            }
        }
        if (continuar) {
            const seguir = prompt('¿Desea continuar con la iteración? (s/n): ', { maxLength: 1, puedeVacio: true });
            if (seguir.toLowerCase() === 'n') continuar = false;
        }
    }

    const confirmar = prompt('Guardar cambios? (s/n): ', { maxLength: 1, puedeVacio: true });
    if (confirmar.toLowerCase() === 'n') {
        mensaje('\nCambios descartados.');
        return null;
    }

    const tareaActualizada = aplicarCambiosA(editable, { uEdicion: new Date() as unknown as Date });
    // Persistir cambios
    const repository = new TaskRepository();
    repository.actualizar(tareaActualizada);
    mensaje('\n¡Tarea actualizada!');
    return tareaActualizada;
}

/**
 * Ejecuta la edición de tarea seleccionada de una lista (I/O).
 * Devuelve la lista actualizada si hubo cambios.
 */
export function modificarTareaEnLista(tareas: readonly Task[], indice: number): readonly Task[] {
    if (indice < 1 || indice > tareas.length) return tareas;
    const tareaVisible = tareas[indice];
    if (!tareaVisible) return tareas;

    // Recuperar la instancia actual desde el repositorio usando la id
    const repository = new TaskRepository();
    const todas = repository.cargar();
    const tareaReal = todas.find(t => t.id === tareaVisible.id);
    if (!tareaReal) {
        mensaje('No fue posible encontrar la tarea en el almacenamiento.');
        return tareas;
    }

    const actualizada = editarTareaInteractiva(tareaReal);
    if (!actualizada) return tareas;

    // Persistir cambios y devolver la lista actualizada desde el repo
    repository.actualizar(actualizada);
    return repository.cargar();
}