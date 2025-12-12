import { readFile, writeFile, rename, access } from 'fs/promises';
import { constants } from 'fs';
import { join } from 'path';
import type { Task, TaskDifficulty, TaskStatus} from '../../type.ts';
import { mensaje } from '../../../interfaz/mensajes.ts';
import { eliminarTareaLogicamente } from '../eliminar/eliminar.ts';

const RUTA_ALMACENAMIENTO: string = join(process.cwd(), 'tareas.json');
const RUTA_METADATOS: string = join(process.cwd(), 'guardado.json');

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

// ============================================
// FUNCIONES PURAS 
// ============================================

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

export function serializarTarea(tarea: Task): StoredTask {
    return {
        ...tarea,
        creacion: tarea.creacion ? (tarea.creacion as Date).toISOString() : null,
        uEdicion: tarea.uEdicion ? (tarea.uEdicion as Date).toISOString() : null,
        vencimiento: tarea.vencimiento ? (tarea.vencimiento as Date).toISOString() : null,
    };
}

export function prepararDatosParaGuardar(tareas: readonly Task[], ultimaActualizacion: string): DatosAlmacenamiento {
    return {
        tareas: (tareas as Task[]).map(serializarTarea),
        ultimaActualizacion
    };
}

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

export function _agregarTarea(tareas: Task[], nuevaTarea: Task): Task[] {
    return [...tareas, nuevaTarea];
}

export function _actualizarTarea(tareas: Task[], tareaActualizada: Task): Task[] {
    return tareas.map(t => (t.id === tareaActualizada.id ? tareaActualizada : t));
}

export function contarTareasActivas(tareas: Task[]): number {
    return tareas.filter(t => !t.eliminada).length;
}


/**
 * Verifica si un archivo existe 
 */
async function existeArchivo(ruta: string): Promise<boolean> {
    try {
        await access(ruta, constants.F_OK);
        return true;
    } catch {
        return false;
    }
}

/**
 * Inicializa el almacenamiento 
 */
export async function inicializarAlmacenamiento(nowIso?: string): Promise<void> {
    const existe = await existeArchivo(RUTA_ALMACENAMIENTO);
    
    if (!existe) {
        const fechaIso = nowIso ?? new Date().toISOString();
        await guardarTareas([], RUTA_ALMACENAMIENTO, fechaIso);
        mensaje(`✓ Archivo de almacenamiento creado en: ${RUTA_ALMACENAMIENTO}`);
    }
}

/**
 * Carga tareas desde el archivo 
 */
export async function cargarTareas(ruta: string = RUTA_ALMACENAMIENTO): Promise<readonly Task[]> {
    try {
        await inicializarAlmacenamiento();
        const contenido: string = await readFile(ruta, 'utf-8');
        const datos: DatosAlmacenamiento = JSON.parse(contenido);
        return datos.tareas.map(deserializarTarea);
    } catch (error) {
        console.error('Error al cargar tareas:', error);
        return [];
    }
}

/**
 * Guarda metadatos 
 */
export async function guardarMetadatos(metadatos: MetadatosAlmacenamiento, ruta: string = RUTA_METADATOS): Promise<boolean> {
    try {
        const tempRuta = `${ruta}.tmp`;
        await writeFile(tempRuta, JSON.stringify(metadatos, null, 2), 'utf-8');
        await rename(tempRuta, ruta);
        return true;
    } catch (error) {
        console.error('Error al guardar metadatos:', error);
        return false;
    }
}

/**
 * Guarda tareas 
 */
export async function guardarTareas(
    tareas: readonly Task[], 
    ruta: string = RUTA_ALMACENAMIENTO, 
    ultimaActualizacionISO?: string
): Promise<boolean> {
    try {
        const nowIso = ultimaActualizacionISO ?? new Date().toISOString();
        const datosGuardar: DatosAlmacenamiento = prepararDatosParaGuardar(tareas, nowIso);
        
        //
        const tempRuta = `${ruta}.tmp`;
        await writeFile(tempRuta, JSON.stringify(datosGuardar, null, 2), 'utf-8');
        await rename(tempRuta, ruta);
        
        // Actualizar metadatos
        const metadatos: MetadatosAlmacenamiento = generarMetadatos(tareas, nowIso);
        await guardarMetadatos(metadatos);
        
        return true;
    } catch (error) {
        console.error('Error al guardar tareas:', error);
        return false;
    }
}

/**
 * Agrega tarea 
 */
export async function agregarTarea(nuevaTarea: Task): Promise<readonly Task[]> {
    const tareasActuales: readonly Task[] = await cargarTareas();
    const tareasActualizadas: readonly Task[] = _agregarTarea(tareasActuales as Task[], nuevaTarea);
    
    const guardado = await guardarTareas(tareasActualizadas);
    if (guardado) {
        mensaje('✓ Tarea guardada en almacenamiento');
        return tareasActualizadas;
    }
    
    console.error('✗ Error al guardar tarea en almacenamiento');
    return tareasActuales;
}

/**
 * Actualiza tarea 
 */
export async function actualizarTarea(tareaActualizada: Task): Promise<readonly Task[]> {
    const tareasActuales: readonly Task[] = await cargarTareas();
    const tareasActualizadas: readonly Task[] = _actualizarTarea(tareasActuales as Task[], tareaActualizada);
    
    const guardado = await guardarTareas(tareasActualizadas);
    if (guardado) {
        mensaje('✓ Tarea actualizada en almacenamiento');
        return tareasActualizadas;
    }
    
    console.error('✗ Error al actualizar tarea en almacenamiento');
    return tareasActuales;
}

/**
 * Elimina tarea
 */
export async function eliminarTarea(tareaId: string): Promise<readonly Task[]> {
    const tareasActuales: readonly Task[] = await cargarTareas();
    const tareaAEliminar = tareasActuales.find(t => t.id === tareaId);
    
    if (!tareaAEliminar) {
        console.error('✗ Tarea no encontrada');
        return tareasActuales;
    }
    
    const fechaEdicion = new Date();
    const tareasActualizadas: readonly Task[] = eliminarTareaLogicamente(tareasActuales, tareaId, fechaEdicion);
    
    const guardado = await guardarTareas(tareasActualizadas);
    if (guardado) {
        mensaje('✓ Tarea eliminada en almacenamiento');
        return tareasActualizadas;
    }
    
    console.error('✗ Error al eliminar tarea en almacenamiento');
    return tareasActuales;
}

/**
 * Obtiene cantidad de tareas 
 */
export async function obtenerCantidadTareas(): Promise<number> {
    const tareas: readonly Task[] = await cargarTareas();
    return tareas.filter(t => !t.eliminada).length;
}

/**
 * Limpia almacenamiento d
 */
export async function limpiarAlmacenamiento(nowIso?: string): Promise<boolean> {
    try {
        const fechaIso = nowIso ?? new Date().toISOString();
        await guardarTareas([], RUTA_ALMACENAMIENTO, fechaIso);
        mensaje('✓ Almacenamiento limpiado');
        return true;
    } catch (error) {
        console.error('Error al limpiar almacenamiento:', error);
        return false;
    }
}

/**
 * Obtiene info del almacenamiento 
 */
export async function obtenerInfoAlmacenamiento(): Promise<string> {
    const existe = await existeArchivo(RUTA_ALMACENAMIENTO);
    
    if (!existe) {
        return `Archivo de almacenamiento no existe en: ${RUTA_ALMACENAMIENTO}`;
    }
    
    const tareas: readonly Task[] = await cargarTareas();
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

// Aliases
export const agregarTareaAlAlmacenamiento = agregarTarea;
export const actualizarTareaEnAlmacenamiento = actualizarTarea;
export const eliminarTareaDelAlmacenamiento = eliminarTarea;