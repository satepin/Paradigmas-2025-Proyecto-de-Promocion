/**
 * @module core/tools/modulos/guardado
 * @description Módulo para persistencia de tareas en archivo JSON.
 * Maneja la lectura y escritura de tareas en un archivo de almacenamiento.
 */

import { readFileSync, writeFileSync, existsSync, renameSync } from 'fs'; 
import { join } from 'path';
import type { Task, TaskDifficulty, TaskStatus} from '../../type.ts';
import { mensaje } from '../../../interfaz/mensajes.ts';
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
    tareas: StoredTask[];
    ultimaActualizacion: string;
}   

/**
 * Interfaz para tareas persistidas (fechas como strings).
 */
interface StoredTask {
    id: string;
    titulo: string;
    descripcion: string;
    estado: string;
    creacion: string | null;
    uEdicion: string | null;
    vencimiento: string | null;
    dificultad: string;
    categoria: string;
    eliminada: boolean;
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
        escribirMetadatos(metadatosIniciales);
        mensaje(`✓ Archivo de almacenamiento creado en: ${RUTA_ALMACENAMIENTO}`); // Mensaje de éxito
        }
    }

/**
 * Carga la lista de tareas desde el archivo JSON.
 * @returns {readonly Task[]} Array inmutable de tareas almacenadas.
 */
export function parseTaskDates(tarea: StoredTask): Task {
    return {
        ...tarea,
        creacion: tarea.creacion ? new Date(tarea.creacion) : null,
        uEdicion: tarea.uEdicion ? new Date(tarea.uEdicion) : null,
        vencimiento: tarea.vencimiento ? new Date(tarea.vencimiento) : null,
        estado: tarea.estado as TaskStatus,
        dificultad: tarea.dificultad as TaskDifficulty,
    };
}

export function serializarTaskDates(tarea: Task): StoredTask {
    return {
        ...tarea,
        creacion: tarea.creacion ? (tarea.creacion as Date).toISOString() : null,
        uEdicion: tarea.uEdicion ? (tarea.uEdicion as Date).toISOString() : null,
        vencimiento: tarea.vencimiento ? (tarea.vencimiento as Date).toISOString() : null,
    };
}

/**
 * Cargar tareas desde el archivo (wrapper con E/S). Mantiene compatibilidad con llamadas externas.
 */
export function cargarTareas(ruta: string = RUTA_ALMACENAMIENTO): readonly Task[] {
    try {
        inicializarAlmacenamiento();
        const contenido: string = readFileSync(ruta, 'utf-8');
        const datos: DatosAlmacenamiento = JSON.parse(contenido);
        return datos.tareas.map(parseTaskDates);
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
export function prepararDatosParaGuardar(tareas: readonly Task[], ultimaActualizacion: string): DatosAlmacenamiento {
    return {
        tareas: (tareas as Task[]).map(serializarTaskDates),
        ultimaActualizacion
    };
}

/**
 * Guarda las tareas y actualiza el archivo de metadatos (`guardado.json`).
 * Esta función centraliza la E/S: escribe de forma atómica el archivo de tareas y
 * luego actualiza `guardado.json` con metadatos calculados a partir de `tareas`.
 */
export function guardarTareas(tareas: readonly Task[], ruta: string = RUTA_ALMACENAMIENTO): boolean {
    try {
        const datosGuardar: DatosAlmacenamiento = prepararDatosParaGuardar(tareas, new Date().toISOString());
        // Escribir de forma atómica en un archivo temporal y renombrar
        const tempRuta = `${ruta}.tmp`;
        writeFileSync(tempRuta, JSON.stringify(datosGuardar, null, 2), 'utf-8');
        renameSync(tempRuta, ruta);
        // Actualizar metadatos
        const metadatos: MetadatosAlmacenamiento = calcularMetadatos(tareas);
        escribirMetadatos(metadatos);
        return true;
    } catch (error) {
        console.error('Error al guardar tareas:', error);
        return false;
    }
}

/**
 * Calcula metadatos (conteos y fechas) a partir de una lista de tareas.
 */
export function calcularMetadatos(tareas: readonly Task[]): MetadatosAlmacenamiento {
    const tareasActivas = tareas.filter(t => !t.eliminada).length;
    const tareasEliminadas = tareas.filter(t => t.eliminada).length;
    return {
        ruta: RUTA_ALMACENAMIENTO,
        tareasActivas,
        tareasEliminadas,
        total: tareas.length,
        ultimaActualizacion: new Date().toISOString()
    };
}

/**
 * Escribe los metadatos en `guardado.json`.
 */
export function escribirMetadatos(metadatos: MetadatosAlmacenamiento, ruta: string = RUTA_GUARDADO): boolean {
    try {
        const tempRuta = `${ruta}.tmp`;
        writeFileSync(tempRuta, JSON.stringify(metadatos, null, 2), 'utf-8');
        renameSync(tempRuta, ruta);
        return true;
    } catch (error) {
        console.error('Error al escribir metadatos:', error);
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
        mensaje('✓ Tarea guardada en almacenamiento');
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
        mensaje('✓ Tarea actualizada en almacenamiento');
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
        mensaje('✓ Almacenamiento limpiado');
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

export function agregarTareaPure(tareas: Task[], nuevaTarea: Task): Task[] {
    return [...tareas, nuevaTarea];
}

export function actualizarTareaPure(tareas: Task[], tareaActualizada: Task): Task[] {
    return tareas.map(t => (t.id === tareaActualizada.id ? tareaActualizada : t));
}

export function eliminarTareaPure(tareas: Task[], tareaId: string, uEdicion: Date): Task[] {
    return tareas.map(t => (t.id === tareaId ? { ...t, eliminada: true, uEdicion } : t));
}

export function contarTareasActivasPure(tareas: Task[]): number {
    return tareas.filter(t => !t.eliminada).length;
}

