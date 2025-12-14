import { listado } from '../listado.ts';
import type { Task } from '../../../type.ts';
import { mensaje, pausaMensaje } from "../../../../interfaz/mensajes.ts";
import { prompt } from "../../../../core/tools/modulos/promptSync.ts";
import logicjs from 'logicjs-es6';

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

const perteneceA = (categoria: string) => (tarea: Task): boolean =>
    tarea.categoria === categoria;

const esDistintaDe = (tareaBase: Task) => (tarea: Task): boolean =>
    tarea.id !== tareaBase.id;

// ============== PREDICADOS COMPUESTOS ==============

const esPrioritaria = (fecha: Date) => (tarea: Task): boolean =>
    y(esActiva, venceEnDias(3, fecha))(tarea);

const estaVencida = (fecha: Date) => (tarea: Task): boolean =>
    y(tieneVencimiento, noEstaCompletada, venceAntes(fecha))(tarea);

const estaRelacionada = (tareaBase: Task) => (tarea: Task): boolean =>
    y(esDistintaDe(tareaBase), perteneceA(tareaBase.categoria))(tarea);

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

/**
 * Muestra tareas relacionadas (Misma categoría, distinta ID)
 */
export const verRelacionadas = (tareaBase: Task, tareas: readonly Task[]): void => {
    mensaje(`\nTarea seleccionada: ${tareaBase.titulo} (Categoria: ${tareaBase.categoria})`);
    buscarYMostrar(estaRelacionada(tareaBase))(`Tareas relacionadas con "${tareaBase.titulo}"`)(tareas);
};

// ============== FILTRADORES ==============
export const filtrarTareasPrioritarias = (tareas: readonly Task[], fecha: Date = new Date()) =>
    filtrar(esPrioritaria(fecha))(tareas);

export const filtrarTareasVencidas = (tareas: readonly Task[], fecha: Date = new Date()) =>
    filtrar(estaVencida(fecha))(tareas);

export const filtrarTareasRelacionadas = (tareaBase: Task, tareas: readonly Task[]) =>
    filtrar(estaRelacionada(tareaBase))(tareas);