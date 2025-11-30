/**
 * @module core/tools/modulos/guardado
 * @description Módulo para persistencia de tareas en archivo JSON.
 * Maneja la lectura y escritura de tareas en un archivo de almacenamiento.
 */

import { readFileSync, writeFileSync, existsSync } from 'fs'; 
import { join } from 'path';
import type { Task } from '../../type.ts';

/**
 * Ruta del archivo de almacenamiento JSON.
 * @type {string}
 */
const RUTA_ALMACENAMIENTO: string = join(process.cwd(), 'tareas.json');
const RUTA_GUARDADO: string = join(process.cwd(), 'guardado.json');

/**
 * Interfaz para la estructura del archivo de almacenamiento.
 */
interface MetadatosAlmacenamiento {
    ruta: string;
    tareasActivas: number;
    tareasEliminadas: number;
    total: number;
    ultimaActualizacion: string;
}
interface DatosAlmacenamiento {
    tareas: Task[];
    ultimaActualizacion: string;
}   

/**
 * Inicializa el archivo de almacenamiento si no existe.
 * @returns {void}
 */
export function inicializarAlmacenamiento(): void { 
    if (!existsSync(RUTA_ALMACENAMIENTO)) {// Si el archivo no existe, lo crea con datos iniciales
        const datosIniciales: DatosAlmacenamiento = { // Datos iniciales vacíos
            tareas: [],// Array vacío de tareas
            ultimaActualizacion: new Date().toISOString()// Fecha actual en formato ISO
        };
       writeFileSync(RUTA_ALMACENAMIENTO, JSON.stringify(datosIniciales, null, 2), 'utf-8'); // Escribe el archivo JSON
        // Crear archivo de exportación `guardado.json` con solo metadata
        const metadatosIniciales: MetadatosAlmacenamiento = {
            ruta: RUTA_ALMACENAMIENTO,
            tareasActivas: 0,
            tareasEliminadas: 0,
            total: 0,
            ultimaActualizacion: datosIniciales.ultimaActualizacion
        };
        writeFileSync(RUTA_GUARDADO, JSON.stringify(metadatosIniciales, null, 2), 'utf-8');
        console.log(`✓ Archivo de almacenamiento creado en: ${RUTA_ALMACENAMIENTO}`); // Mensaje de éxito
        }
    }

/**
 * Carga la lista de tareas desde el archivo JSON.
 * @returns {readonly Task[]} Array inmutable de tareas almacenadas.
 */
export function cargarTareas(): readonly Task[] { 
    try {// Intenta leer y pasar el archivo JSON
        inicializarAlmacenamiento();
        const contenido: string = readFileSync(RUTA_ALMACENAMIENTO, 'utf-8'); // Lee el contenido del archivo
        const datos: DatosAlmacenamiento = JSON.parse(contenido);
        
        // Convertir strings de fecha a objetos Date
        return datos.tareas.map((tarea: Task) => ({ 
            ...tarea,
            creacion: tarea.creacion ? new Date(tarea.creacion) : null,
            uEdicion: tarea.uEdicion ? new Date(tarea.uEdicion) : null,
            vencimiento: tarea.vencimiento ? new Date(tarea.vencimiento) : null
        }));
    } catch (error) {
        console.error('Error al cargar tareas:', error);
        return [];
    }
}

/**
 * Guarda la lista de tareas en el archivo JSON.
 * @param {readonly Task[]} tareas - Array de tareas a guardar.
 * @returns {boolean} true si se guardó exitosamente, false en caso contrario.
 */
export function guardarTareas(tareas: readonly Task[]): boolean {
    try {
        const datosGuardar: DatosAlmacenamiento = {
            tareas: tareas as Task[],
            ultimaActualizacion: new Date().toISOString()
        };
        writeFileSync(RUTA_ALMACENAMIENTO, JSON.stringify(datosGuardar, null, 2), 'utf-8');
        return true;
    } catch (error) {
        console.error('Error al guardar tareas:', error);
        return false;
    }
}

/**
 * Agrega una nueva tarea al almacenamiento.
 * @param {Task} nuevaTarea - La tarea a agregar.
 * @returns {readonly Task[]} Lista actualizada de tareas.
 */
export function agregarTareaAlAlmacenamiento(nuevaTarea: Task): readonly Task[] {
    const tareasActuales: readonly Task[] = cargarTareas();
    const tareasActualizadas: readonly Task[] = [...tareasActuales, nuevaTarea];
    
    if (guardarTareas(tareasActualizadas)) {
        console.log('✓ Tarea guardada en almacenamiento');
        return tareasActualizadas;
    }
    
    console.error('✗ Error al guardar tarea en almacenamiento');
    return tareasActuales;
}

/**
 * Actualiza una tarea existente en el almacenamiento.
 * @param {Task} tareaActualizada - La tarea con datos actualizados.
 * @returns {readonly Task[]} Lista actualizada de tareas.
 */
export function actualizarTareaEnAlmacenamiento(tareaActualizada: Task): readonly Task[] {
    const tareasActuales: readonly Task[] = cargarTareas();
    const tareasActualizadas: readonly Task[] = tareasActuales.map(tarea =>
        tarea.id === tareaActualizada.id ? tareaActualizada : tarea
    );
    
    if (guardarTareas(tareasActualizadas)) {
        console.log('✓ Tarea actualizada en almacenamiento');
        return tareasActualizadas;
    }
    
    console.error('✗ Error al actualizar tarea en almacenamiento');
    return tareasActuales;
}

/**
 * Elimina una tarea del almacenamiento (eliminación lógica).
 * @param {string} tareaId - ID de la tarea a eliminar.
 * @returns {readonly Task[]} Lista actualizada de tareas.
 */
export function eliminarTareaDelAlmacenamiento(tareaId: string): readonly Task[] {
    const tareasActuales: readonly Task[] = cargarTareas();
    const tareaAEliminar = tareasActuales.find(t => t.id === tareaId);
    
    if (!tareaAEliminar) {
        console.error('✗ Tarea no encontrada');
        return tareasActuales;
    }
    
    const tareaActualizada: Task = {
        ...tareaAEliminar,
        eliminada: true,
        uEdicion: new Date()
    };
    
    return actualizarTareaEnAlmacenamiento(tareaActualizada);
}

/**
 * Obtiene el número total de tareas no eliminadas.
 * @returns {number} Cantidad de tareas activas.
 */
export function obtenerCantidadTareas(): number {
    const tareas: readonly Task[] = cargarTareas();
    return tareas.filter(t => !t.eliminada).length;
}

/**
 * Limpia el archivo de almacenamiento (elimina todas las tareas).
 * @returns {boolean} true si se limpió exitosamente.
 */
export function limpiarAlmacenamiento(): boolean {
    try {
        const datosVacios: DatosAlmacenamiento = {
            tareas: [],
            ultimaActualizacion: new Date().toISOString()
        };
        writeFileSync(RUTA_ALMACENAMIENTO, JSON.stringify(datosVacios, null, 2), 'utf-8');
        console.log('✓ Almacenamiento limpiado');
        return true;
    } catch (error) {
        console.error('Error al limpiar almacenamiento:', error);
        return false;
    }
}

/**
 * Obtiene información sobre el archivo de almacenamiento.
 * @returns {string} Información del almacenamiento.
 */
export function obtenerInfoAlmacenamiento(): string {
    if (!existsSync(RUTA_ALMACENAMIENTO)) {
        return `Archivo de almacenamiento no existe en: ${RUTA_ALMACENAMIENTO}`;
    }
    
    const tareas: readonly Task[] = cargarTareas();
    const tareasActivas = tareas.filter(t => !t.eliminada).length;
    const tareasEliminadas = tareas.filter(t => t.eliminada).length;
    
    return `
📁 Almacenamiento de Tareas
├── Ruta: ${RUTA_ALMACENAMIENTO}
├── Tareas Activas: ${tareasActivas}
├── Tareas Eliminadas: ${tareasEliminadas}
└── Total: ${tareas.length}
    `.trim(); // Retorna la información formateada
}
