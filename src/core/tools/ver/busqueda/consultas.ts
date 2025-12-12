import { listado } from '../listado.ts';
import type { Task } from '../../../type.ts';
import { mensaje, pausaMensaje } from "../../../../interfaz/mensajes.ts";

// ===========================
// UTILIDADES DE FECHA
// ===========================

/**
 * Suma días a una fecha sin mutar el original
 */
const sumarDias = (dias: number, fecha: Date): Date => {
    const resultado = new Date(fecha);
    resultado.setDate(fecha.getDate() + dias);
    return resultado;
};

// ===========================
// UTILIDADES FUNCIONALES
// ===========================

/**
 * Composición de predicados: AND lógico
 */
const y = <T>(...predicados: ((x: T) => boolean)[]): (x: T) => boolean =>
    (x: T) => predicados.every(p => p(x));

/**
 * Composición de predicados: OR lógico
 */
const o = <T>(...predicados: ((x: T) => boolean)[]): (x: T) => boolean =>
    (x: T) => predicados.some(p => p(x));

// ============== PREDICADOS BÁSICOS ==============

const esActiva = (tarea: Task): boolean => 
    o(
        (t: Task) => t.estado === 'pendiente',
        (t: Task) => t.estado === 'en curso'
    )(tarea);

const tieneVencimiento = (tarea: Task): boolean => 
    tarea.vencimiento !== null;

const noEstaCompletada = (tarea: Task): boolean => 
    tarea.estado !== 'completada';

const venceAntes = (fecha: Date) => (tarea: Task): boolean =>
    y(
        tieneVencimiento, 
        // Usamos .getTime() para una comparación numérica segura
        (t: Task) => t.vencimiento!.getTime() < fecha.getTime() 
    )(tarea);

const venceEnDias = (dias: number, fecha: Date) => (tarea: Task): boolean =>
    y(
        tieneVencimiento, 
        (t: Task) => t.vencimiento!.getTime() <= sumarDias(dias, fecha).getTime()
    )(tarea);

// ============== PREDICADOS COMPUESTOS ==============

const esPrioritaria = (fecha: Date) => (tarea: Task): boolean =>
    y(esActiva, venceEnDias(3, fecha))(tarea);

const estaVencida = (fecha: Date) => (tarea: Task): boolean =>
    y(tieneVencimiento, noEstaCompletada, venceAntes(fecha))(tarea);

// ============== TRANSFORMADORES ==============

/**
 * Filtra tareas con un predicado 
 */
const filtrar = (predicado: (t: Task) => boolean) => (tareas: readonly Task[]): readonly Task[] =>
    tareas.filter(predicado);

/**
 * Retorna tupla [vacío, tareas] para manejo funcional 
 */
const dividirPorVacio = (tareas: readonly Task[]): [boolean, readonly Task[]] =>
    [tareas.length === 0, tareas];

// ============== EFECTOS SECUNDARIOS (IO) ==============

/**
 * Muestra tareas o mensaje vacío 
 */
const mostrar = (condicion: string) => (tareasFiltradas: readonly Task[]): void => {
    const [estaVacia] = dividirPorVacio(tareasFiltradas);
    
    if (estaVacia) {
        mensaje(`No hay ${condicion.toLowerCase()}.`);
        pausaMensaje();
    } else {
        mensaje(`\n===${condicion} (${tareasFiltradas.length}) ===\n`);
        listado(tareasFiltradas);
    }
};

/**
 * Composición: filtro + visualización
 */
const buscarYMostrar = 
    (predicado: (t: Task) => boolean) => 
    (condicion: string) => 
    (tareas: readonly Task[]): void => 
        mostrar(condicion)(filtrar(predicado)(tareas));

// ============================
// EXPORTACIONES PRINCIPALES
// ============================

/**
 * Muestra tareas prioritarias (Activas y vencen en los próximos 3 días o ya vencieron)
 */
export const verPrioridad = (tareas: readonly Task[]): void =>
    buscarYMostrar(esPrioritaria(new Date()))('Tareas Prioritarias')(tareas);

/**
 * Muestra tareas vencidas (Con fecha límite pasada y no completadas)
 */
export const verVencidas = (tareas: readonly Task[]): void =>
    buscarYMostrar(estaVencida(new Date()))('Tareas Vencidas')(tareas);

// ============== FILTRADORES ==============
export const filtrarTareasPrioritarias = (tareas: readonly Task[], fecha: Date = new Date()) =>
    filtrar(esPrioritaria(fecha))(tareas);

export const filtrarTareasVencidas = (tareas: readonly Task[], fecha: Date = new Date()) =>
    filtrar(estaVencida(fecha))(tareas);