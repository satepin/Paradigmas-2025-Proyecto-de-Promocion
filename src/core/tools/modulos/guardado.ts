/**
 * @module core/tools/modulos/guardado
 * @description Módulo para persistencia de tareas en archivo JSON.
 * Maneja la lectura y escritura de tareas en un archivo de almacenamiento.
 */

import { readFileSync, writeFileSync, existsSync, renameSync } from 'fs'; 
import { join } from 'path';
import type { Task, TaskDifficulty, TaskStatus} from '../../type.ts';
import { mensaje } from '../../../interfaz/mensajes.ts';
import { eliminarTareaLogicamente } from '../eliminar/eliminar.ts';

/**
 * Ruta del archivo de almacenamiento JSON.
 * @type {string}
 */
const RUTA_ALMACENAMIENTO: string = join(process.cwd(), 'tareas.json');
const RUTA_METADATOS: string = join(process.cwd(), 'guardado.json');

/**
 * Interfaz para los metadatos del archivo de almacenamiento.
 * @property {string} ruta - Ruta del archivo de almacenamiento
 * @property {number} tareasActivas - Número de tareas no eliminadas
 * @property {number} tareasEliminadas - Número de tareas eliminadas
 * @property {number} total - Total de tareas
 * @property {string} ultimaActualizacion - Fecha de última actualización en formato ISO
 */
interface MetadatosAlmacenamiento {
    ruta: string;
    tareasActivas: number;
    tareasEliminadas: number;
    total: number;
    ultimaActualizacion: string;
}

/**
 * Interfaz para los datos del archivo de almacenamiento.
 * @property {StoredTask[]} tareas - Array de tareas serializadas
 * @property {string} ultimaActualizacion - Fecha de última actualización en formato ISO
 */
interface DatosAlmacenamiento {
    tareas: StoredTask[];
    ultimaActualizacion: string;
}   

/**
 * Interfaz para tareas persistidas (fechas como strings).
 * @property {string} id - Identificador único de la tarea
 * @property {string} titulo - Título de la tarea
 * @property {string} descripcion - Descripción de la tarea
 * @property {string} estado - Estado de la tarea
 * @property {string | null} creacion - Fecha de creación en formato ISO o null
 * @property {string | null} uEdicion - Fecha de última edición en formato ISO o null
 * @property {string | null} vencimiento - Fecha de vencimiento en formato ISO o null
 * @property {string} dificultad - Nivel de dificultad
 * @property {string} categoria - Categoría de la tarea
 * @property {boolean} eliminada - Indica si la tarea está eliminada
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
export function inicializarAlmacenamiento(nowIso?: string): void { 
    if (!existsSync(RUTA_ALMACENAMIENTO)) {
        const fechaIso = nowIso ?? new Date().toISOString();
        const datosIniciales: DatosAlmacenamiento = {
            tareas: [],
            ultimaActualizacion: fechaIso
        };
        guardarTareas([], RUTA_ALMACENAMIENTO, fechaIso);
        mensaje(`✓ Archivo de almacenamiento creado en: ${RUTA_ALMACENAMIENTO}`);
    }
}

/**
 * Función pura que convierte una tarea serializada a Task con fechas como Date.
 * @param {StoredTask} tarea - Tarea con fechas en formato string
 * @returns {Task} Tarea con fechas como objetos Date
 */
export function deserializarTarea(tarea: StoredTask): Task {
    return {
        ...tarea,
        creacion: tarea.creacion ? new Date(tarea.creacion) : null,
        uEdicion: tarea.uEdicion ? new Date(tarea.uEdicion) : null,
        vencimiento: tarea.vencimiento ? new Date(tarea.vencimiento) : null,
        estado: tarea.estado as TaskStatus,
        dificultad: tarea.dificultad as TaskDifficulty,
    };
}

/**
 * Función pura que serializa una tarea convirtiendo fechas Date a strings ISO.
 * @param {Task} tarea - Tarea con fechas como objetos Date
 * @returns {StoredTask} Tarea serializada con fechas en formato string
 */
export function serializarTarea(tarea: Task): StoredTask {
    return {
        ...tarea,
        creacion: tarea.creacion ? (tarea.creacion as Date).toISOString() : null,
        uEdicion: tarea.uEdicion ? (tarea.uEdicion as Date).toISOString() : null,
        vencimiento: tarea.vencimiento ? (tarea.vencimiento as Date).toISOString() : null,
    };
}

/**
 * Cargar tareas desde el archivo (wrapper con E/S). Mantiene compatibilidad con llamadas externas.
 * @param {string} ruta - Ruta del archivo de almacenamiento (por defecto: tareas.json)
 * @returns {readonly Task[]} Array inmutable de tareas cargadas
 */
export function cargarTareas(ruta: string = RUTA_ALMACENAMIENTO): readonly Task[] {
    try {
        inicializarAlmacenamiento();
        const contenido: string = readFileSync(ruta, 'utf-8');
        const datos: DatosAlmacenamiento = JSON.parse(contenido);
        return datos.tareas.map(deserializarTarea);
    } catch (error) {
        console.error('Error al cargar tareas:', error);
        return [];
    }
}

/**
 * Prepara los datos de tareas para ser guardados en formato JSON.
 * @param {readonly Task[]} tareas - Array de tareas a preparar
 * @param {string} ultimaActualizacion - Fecha de actualización en formato ISO
 * @returns {DatosAlmacenamiento} Datos listos para serializar
 */
export function prepararDatosParaGuardar(tareas: readonly Task[], ultimaActualizacion: string): DatosAlmacenamiento {
    return {
        tareas: (tareas as Task[]).map(serializarTarea),
        ultimaActualizacion
    };
}

/**
 * Guarda las tareas y actualiza el archivo de metadatos (`guardado.json`).
 * Esta función centraliza la E/S: escribe de forma atómica el archivo de tareas y
 * luego actualiza `guardado.json` con metadatos calculados a partir de `tareas`.
 * @param {readonly Task[]} tareas - Array de tareas a guardar
 * @param {string} ruta - Ruta del archivo de almacenamiento
 * @param {string} ultimaActualizacionISO - Fecha de actualización (opcional)
 * @returns {boolean} true si se guardó exitosamente, false en caso contrario
 */
export function guardarTareas(tareas: readonly Task[], ruta: string = RUTA_ALMACENAMIENTO, ultimaActualizacionISO?: string): boolean {
    try {
        const nowIso = ultimaActualizacionISO ?? new Date().toISOString();
        const datosGuardar: DatosAlmacenamiento = prepararDatosParaGuardar(tareas, nowIso);
        
        // Escribir de forma atómica en un archivo temporal y renombrar
        const tempRuta = `${ruta}.tmp`;
        writeFileSync(tempRuta, JSON.stringify(datosGuardar, null, 2), 'utf-8');
        renameSync(tempRuta, ruta);
        
        // Actualizar metadatos
        const metadatos: MetadatosAlmacenamiento = generarMetadatos(tareas, nowIso);
        guardarMetadatos(metadatos);
        
        return true;
    } catch (error) {
        console.error('Error al guardar tareas:', error);
        return false;
    }
}

/**
 * Calcula metadatos (conteos y fechas) a partir de una lista de tareas.
 * @param {readonly Task[]} tareas - Array de tareas
 * @param {string} ultimaActualizacionISO - Fecha de actualización en formato ISO
 * @returns {MetadatosAlmacenamiento} Metadatos calculados
 */
export function generarMetadatos(tareas: readonly Task[], ultimaActualizacionISO: string): MetadatosAlmacenamiento {
    const tareasActivas = tareas.filter(t => !t.eliminada).length;
    const tareasEliminadas = tareas.filter(t => t.eliminada).length;
    return {
        ruta: RUTA_ALMACENAMIENTO,
        tareasActivas,
        tareasEliminadas,
        total: tareas.length,
        ultimaActualizacion: ultimaActualizacionISO
    };
}

/**
 * Escribe los metadatos en `guardado.json`.
 * @param {MetadatosAlmacenamiento} metadatos - Metadatos a escribir
 * @param {string} ruta - Ruta del archivo de metadatos
 * @returns {boolean} true si se escribió exitosamente
 */
export function guardarMetadatos(metadatos: MetadatosAlmacenamiento, ruta: string = RUTA_METADATOS): boolean {
    try {
        const tempRuta = `${ruta}.tmp`;
        writeFileSync(tempRuta, JSON.stringify(metadatos, null, 2), 'utf-8');
        renameSync(tempRuta, ruta);
        return true;
    } catch (error) {
        console.error('Error al guardar metadatos:', error);
        return false;
    }
}

/**
 * Agrega una nueva tarea al almacenamiento.
 * @param {Task} nuevaTarea - La tarea a agregar
 * @returns {readonly Task[]} Lista actualizada de tareas
 */
export function agregarTarea(nuevaTarea: Task): readonly Task[] {
    const tareasActuales: readonly Task[] = cargarTareas();
    const tareasActualizadas: readonly Task[] = _agregarTarea(tareasActuales as Task[], nuevaTarea);
    
    if (guardarTareas(tareasActualizadas)) {
        mensaje('✓ Tarea guardada en almacenamiento');
        return tareasActualizadas;
    }
    
    console.error('✗ Error al guardar tarea en almacenamiento');
    return tareasActuales;
}

/**
 * Actualiza una tarea existente en el almacenamiento.
 * @param {Task} tareaActualizada - La tarea con datos actualizados
 * @returns {readonly Task[]} Lista actualizada de tareas
 */
export function actualizarTarea(tareaActualizada: Task): readonly Task[] {
    const tareasActuales: readonly Task[] = cargarTareas();
    const tareasActualizadas: readonly Task[] = _actualizarTarea(tareasActuales as Task[], tareaActualizada);
    
    if (guardarTareas(tareasActualizadas)) {
        mensaje('✓ Tarea actualizada en almacenamiento');
        return tareasActualizadas;
    }
    
    console.error('✗ Error al actualizar tarea en almacenamiento');
    return tareasActuales;
}

/**
 * Elimina una tarea del almacenamiento (eliminación lógica).
 * @param {string} tareaId - ID de la tarea a eliminar
 * @returns {readonly Task[]} Lista actualizada de tareas
 */
export function eliminarTarea(tareaId: string): readonly Task[] {
    const tareasActuales: readonly Task[] = cargarTareas();
    const tareaAEliminar = tareasActuales.find(t => t.id === tareaId);
    
    if (!tareaAEliminar) {
        console.error('✗ Tarea no encontrada');
        return tareasActuales;
    }
    
    const fechaEdicion = new Date();
    const tareasActualizadas: readonly Task[] = eliminarTareaLogicamente(tareasActuales, tareaId, fechaEdicion);
    
    if (guardarTareas(tareasActualizadas)) {
        mensaje('✓ Tarea eliminada en almacenamiento');
        return tareasActualizadas;
    }
    
    console.error('✗ Error al eliminar tarea en almacenamiento');
    return tareasActuales;
}

/**
 * Obtiene el número total de tareas no eliminadas.
 * @returns {number} Cantidad de tareas activas
 */
export function obtenerCantidadTareas(): number {
    const tareas: readonly Task[] = cargarTareas();
    return tareas.filter(t => !t.eliminada).length;
}

/**
 * Limpia el archivo de almacenamiento (elimina todas las tareas).
 * @param {string} nowIso - Fecha ISO opcional para la limpieza
 * @returns {boolean} true si se limpió exitosamente
 */
export function limpiarAlmacenamiento(nowIso?: string): boolean {
    try {
        const fechaIso = nowIso ?? new Date().toISOString();
        guardarTareas([], RUTA_ALMACENAMIENTO, fechaIso);
        mensaje('✓ Almacenamiento limpiado');
        return true;
    } catch (error) {
        console.error('Error al limpiar almacenamiento:', error);
        return false;
    }
}

/**
 * Obtiene información sobre el archivo de almacenamiento.
 * @returns {string} Información del almacenamiento
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
    `.trim();
}

/**
 * Función pura que agrega una tarea a un array.
 * @param {Task[]} tareas - Array de tareas
 * @param {Task} nuevaTarea - Tarea a agregar
 * @returns {Task[]} Nuevo array con la tarea agregada
 */
export function _agregarTarea(tareas: Task[], nuevaTarea: Task): Task[] {
    return [...tareas, nuevaTarea];
}

/**
 * Función pura que actualiza una tarea en un array.
 * @param {Task[]} tareas - Array de tareas
 * @param {Task} tareaActualizada - Tarea con datos actualizados
 * @returns {Task[]} Nuevo array con la tarea actualizada
 */
export function _actualizarTarea(tareas: Task[], tareaActualizada: Task): Task[] {
    return tareas.map(t => (t.id === tareaActualizada.id ? tareaActualizada : t));
}

/**
 * Función pura que cuenta las tareas activas (no eliminadas).
 * @param {Task[]} tareas - Array de tareas
 * @returns {number} Cantidad de tareas activas
 */
export function contarTareasActivas(tareas: Task[]): number {
    return tareas.filter(t => !t.eliminada).length;
}