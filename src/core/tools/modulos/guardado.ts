/**
 * @module core/tools/modulos/guardado
 * @description Módulo para persistencia de tareas en archivo JSON.
 * Maneja la lectura y escritura de tareas en un archivo de almacenamiento.
 */

import { readFileSync, writeFileSync, existsSync, renameSync, mkdirSync } from 'fs'; 
import { join, dirname } from 'path';
import { Task, type StoredTask } from '../../type.ts';

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

export class TaskRepository {
    private rutaAlmacenamiento: string;
    private rutaMetadatos: string;

    constructor(rutaAlmacenamiento: string = RUTA_ALMACENAMIENTO) {
        this.rutaAlmacenamiento = rutaAlmacenamiento;
        this.rutaMetadatos = join(dirname(rutaAlmacenamiento), 'guardado.json');
        console.log(`Rutas configuradas:`);
        console.log(`- Almacenamiento: ${this.rutaAlmacenamiento}`);
        console.log(`- Metadatos: ${this.rutaMetadatos}`);
        this.inicializar();
    }

    public cargar(): readonly Task[] {
        try {
            if (!existsSync(this.rutaAlmacenamiento)) {
                console.warn(`Archivo no encontrado: ${this.rutaAlmacenamiento}`);
                return [];
            }
            
            const contenido = readFileSync(this.rutaAlmacenamiento, 'utf-8');
            const datos = JSON.parse(contenido) as DatosAlmacenamiento;
            
            if (!Array.isArray(datos.tareas)) {
                console.warn('Estructura de datos inválida');
                return [];
            }
            
            console.log(`Cargadas ${datos.tareas.length} tareas`);
            return datos.tareas.map(t => Task.fromJSON(t));
        } catch (error) {
            console.error('Error al cargar tareas:', error);
            return [];
        }
    }

    public guardar(tareas: readonly Task[]): boolean {
        try {
            const directorio = dirname(this.rutaAlmacenamiento);
            
            // Crear directorio si no existe
            if (!existsSync(directorio)) {
                mkdirSync(directorio, { recursive: true });
                console.log(`📁 Directorio creado: ${directorio}`);
            }

            // Serializar tareas
            const tareasSerializadas = tareas.map(t => {
                if (!(t instanceof Task)) {
                    console.warn(`Objeto no es instancia de Task:`, t);
                    // Intentar reconstruir como Task si es posible
                    if (t && typeof t === 'object' && 'id' in t) {
                        return Task.fromJSON(t as any);
                    }
                    throw new Error(`Objeto inválido: ${JSON.stringify(t)}`);
                }
                return t.toJSON();
            });

            // Escribir a archivo temporal
            const datos: DatosAlmacenamiento = {
                tareas: tareasSerializadas,
                ultimaActualizacion: new Date().toISOString()
            };

            const tempRuta = `${this.rutaAlmacenamiento}.tmp`;
            writeFileSync(tempRuta, JSON.stringify(datos, null, 2), 'utf-8');
            console.log(`Archivo temporal escrito: ${tempRuta}`);

            // Renombrar temporal al archivo final
            if (existsSync(this.rutaAlmacenamiento)) {
                const backupRuta = `${this.rutaAlmacenamiento}.bak`;
                renameSync(this.rutaAlmacenamiento, backupRuta);
                console.log(`Backup creado: ${backupRuta}`);
            }
            
            renameSync(tempRuta, this.rutaAlmacenamiento);
            
            // Verificar que se escribió correctamente
            if (!existsSync(this.rutaAlmacenamiento)) {
                throw new Error('El archivo no se creó después de renameSync');
            }
            
            this.actualizarMetadatos(tareas);
            console.log(`Tareas guardadas correctamente: ${tareas.length}`);
            return true;
        } catch (error) {
            console.error('Error al guardar:', error);
            return false;
        }
    }

    public agregar(tarea: Task): readonly Task[] {
        const tareas = this.cargar();
        const nuevas = [...tareas, tarea];
        const exito = this.guardar(nuevas);
        
        if (!exito) {
            console.error('No se pudo guardar la nueva tarea');
        }
        return nuevas;
    }

    public actualizar(tarea: Task): readonly Task[] {
        const tareas = this.cargar();
        const nuevas = tareas.map(t => (t.id === tarea.id ? tarea : t));
        const exito = this.guardar(nuevas);
        
        if (!exito) {
            console.error('No se pudo actualizar la tarea');
        }
        return nuevas;
    }

    public eliminar(id: string): readonly Task[] {
        const tareas = this.cargar();
        const tarea = tareas.find(t => t.id === id);
        if (!tarea) {
            console.warn(`Tarea no encontrada: ${id}`);
            return tareas;
        }
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

    public inicializar(): void {
        if (!existsSync(this.rutaAlmacenamiento)) {
            try {
                const directorio = dirname(this.rutaAlmacenamiento);
                if (!existsSync(directorio)) {
                    mkdirSync(directorio, { recursive: true });
                    console.log(`📁 Directorio creado: ${directorio}`);
                }
                
                const datos: DatosAlmacenamiento = {
                    tareas: [],
                    ultimaActualizacion: new Date().toISOString()
                };
                writeFileSync(this.rutaAlmacenamiento, JSON.stringify(datos, null, 2), 'utf-8');
                console.log(`Archivo de almacenamiento inicializado`);
            } catch (error) {
                console.error('Error al inicializar almacenamiento:', error);
            }
        } else {
            console.log(`Archivo de almacenamiento ya existe`);
        }
    }

    private actualizarMetadatos(tareas: readonly Task[]): void {
        try {
            const activas = tareas.filter(t => !t.eliminada).length;
            const eliminadas = tareas.filter(t => t.eliminada).length;
            const metadatos: MetadatosAlmacenamiento = {
                ruta: this.rutaAlmacenamiento,
                tareasActivas: activas,
                tareasEliminadas: eliminadas,
                total: tareas.length,
                ultimaActualizacion: new Date().toISOString()
            };
            writeFileSync(this.rutaMetadatos, JSON.stringify(metadatos, null, 2), 'utf-8');
        } catch (error) {
            console.error('Error al actualizar metadatos:', error);
        }
    }
}