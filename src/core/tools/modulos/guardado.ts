/**
 * @module core/tools/modulos/guardado
 * @description Módulo para persistencia de tareas en archivo JSON.
 * Maneja la lectura y escritura de tareas en un archivo de almacenamiento.
 */

import { readFileSync, writeFileSync, existsSync, renameSync } from 'fs'; 
import { join } from 'path';
import type { TaskDifficulty, TaskStatus} from '../../type.ts';
import { mensaje } from '../../../interfaz/mensajes.ts';
import { eliminarTareaLogicamente } from '../eliminar/eliminar.ts';
import { Task } from '../../type.ts';

/**
 * Ruta del archivo de almacenamiento JSON.
 * @type {string}
 */
const RUTA_ALMACENAMIENTO: string = join(process.cwd(), 'tareas.json');
const RUTA_GUARDADO: string = join(process.cwd(), 'guardado.json');

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
export interface StoredTask {
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

export class TaskRepository {
    private rutaAlmacenamiento: string;
    private rutaMetadatos: string;

    constructor(rutaAlmacenamiento: string = join(process.cwd(), 'tareas.json')) {
        this.rutaAlmacenamiento = rutaAlmacenamiento;
        this.rutaMetadatos = join(process.cwd(), 'guardado.json');
    }

    public cargar(): readonly Task[] {
        try {
            this.inicializar();
            const contenido = readFileSync(this.rutaAlmacenamiento, 'utf-8');
            const datos = JSON.parse(contenido) as DatosAlmacenamiento;
            return datos.tareas.map(Task.fromJSON);
        } catch (error) {
            console.error('Error al cargar tareas:', error);
            return [];
        }
    }

    public guardar(tareas: readonly Task[]): boolean {
        try {
            const datos: DatosAlmacenamiento = {
                tareas: tareas.map(t => t.toJSON()),
                ultimaActualizacion: new Date().toISOString()
            };
            const tempRuta = `${this.rutaAlmacenamiento}.tmp`;
            writeFileSync(tempRuta, JSON.stringify(datos, null, 2), 'utf-8');
            renameSync(tempRuta, this.rutaAlmacenamiento);
            this.actualizarMetadatos(tareas);
            return true;
        } catch (error) {
            console.error('Error al guardar:', error);
            return false;
        }
    }

    public agregar(tarea: Task): readonly Task[] {
        const tareas = this.cargar();
        const nuevas = [...tareas, tarea];
        this.guardar(nuevas);
        return nuevas;
    }

    public actualizar(tarea: Task): readonly Task[] {
        const tareas = this.cargar();
        const nuevas = tareas.map(t => (t.id === tarea.id ? tarea : t));
        this.guardar(nuevas);
        return nuevas;
    }

    public eliminar(id: string): readonly Task[] {
        const tareas = this.cargar();
        const tarea = tareas.find(t => t.id === id);
        if (!tarea) return tareas;
        const eliminada = tarea.marcarEliminada();
        return this.actualizar(eliminada);
    }

    public obtenerInfo(): string {
        const tareas = this.cargar();
        const activas = tareas.filter(t => !t.eliminada).length;
        const eliminadas = tareas.filter(t => t.eliminada).length;
        return `
📁 Almacenamiento de Tareas
├── Ruta: ${this.rutaAlmacenamiento}
├── Tareas Activas: ${activas}
├── Tareas Eliminadas: ${eliminadas}
└── Total: ${tareas.length}
        `.trim();
    }

    private inicializar(): void {
        if (!existsSync(this.rutaAlmacenamiento)) {
            const datos: DatosAlmacenamiento = {
                tareas: [],
                ultimaActualizacion: new Date().toISOString()
            };
            writeFileSync(this.rutaAlmacenamiento, JSON.stringify(datos, null, 2), 'utf-8');
        }
    }

    private actualizarMetadatos(tareas: readonly Task[]): void {
        const activas = tareas.filter(t => !t.eliminada).length;
        const eliminadas = tareas.filter(t => t.eliminada).length;
        const metadatos = {
            ruta: this.rutaAlmacenamiento,
            tareasActivas: activas,
            tareasEliminadas: eliminadas,
            total: tareas.length,
            ultimaActualizacion: new Date().toISOString()
        };
        writeFileSync(this.rutaMetadatos, JSON.stringify(metadatos, null, 2), 'utf-8');
    }
}
