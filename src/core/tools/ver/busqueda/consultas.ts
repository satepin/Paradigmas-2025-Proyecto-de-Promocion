import { listado } from '../listado.ts';
import type { Task } from '../../../type.ts';
import { mensaje, pausaMensaje } from "../../../../interfaz/mensajes.ts";
// ===========================
/**
 * Suma días a una fecha sin mutar
 */
const sumarDias = (dias: number, fecha: Date): Date => {
    const resultado = new Date(fecha);
    resultado.setDate(fecha.getDate() + dias);
    return resultado;
};

/**
 * Composición de predicados: AND lógico
 */
const y = <T,>(...predicados: ((x: T) => boolean)[]): (x: T) => boolean =>
    (x: T) => predicados.every(p => p(x));

/**
 * Composición de predicados: OR lógico
 */
const o = <T,>(...predicados: ((x: T) => boolean)[]): (x: T) => boolean =>
    (x: T) => predicados.some(p => p(x));

/**
 * Negación de un predicado
 */
const no = <T,>(predicado: (x: T) => boolean): (x: T) => boolean =>
    (x: T) => !predicado(x);

// ============== PREDICADOS ATÓMICOS (PUROS) ==============
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
    y(tieneVencimiento, (t: Task) => t.vencimiento! < fecha)(tarea);

const venceEnDias = (dias: number, fecha: Date) => (tarea: Task): boolean =>
    y(tieneVencimiento, (t: Task) => t.vencimiento! <= sumarDias(dias, fecha))(tarea);

const perteneceA = (categoria: string) => (tarea: Task): boolean =>
    tarea.categoria === categoria;

const esDistintaDe = (tareaBase: Task) => (tarea: Task): boolean =>
    tarea.id !== tareaBase.id;

// ============== PREDICADOS COMPUESTOS==============
const esPrioritaria = (fecha: Date) => (tarea: Task): boolean =>
    y(esActiva, venceEnDias(3, fecha))(tarea);

const estaVencida = (fecha: Date) => (tarea: Task): boolean =>
    y(tieneVencimiento, noEstaCompletada, venceAntes(fecha))(tarea);

const estaRelacionada = (tareaBase: Task) => (tarea: Task): boolean =>
    y(esDistintaDe(tareaBase), perteneceA(tareaBase.categoria))(tarea);

// ============== TRANSFORMADORES ==============
/**
 * Filtra tareas con un predicado (PURO)
 */
const filtrar = (predicado: (t: Task) => boolean) => (tareas: readonly Task[]): readonly Task[] =>
    tareas.filter(predicado);

/**
 * Retorna tupla [vacío, tareas] para manejo funcional (PURO)
 */
const dividirPorVacio = (tareas: readonly Task[]): [boolean, readonly Task[]] =>
    [tareas.length === 0, tareas];

// ============== EFECTOS SECUNDARIOS (IMPUROS) ==============
/**
 * Muestra tareas o mensaje vacío (CON EFECTOS)
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

// ============== ORQUESTADORES (COMPOSICIÓN) ==============
/**
 * Composición: filtro + visualización
 */
const buscarYMostrar = 
    (predicado: (t: Task) => boolean) => 
    (condicion: string) => 
    (tareas: readonly Task[]): void => 
        mostrar(condicion)(filtrar(predicado)(tareas));

/**
 * Muestra tareas prioritarias
 */
export const verPrioridad = (tareas: readonly Task[]): void =>
    buscarYMostrar(esPrioritaria(new Date()))('Tareas Prioritarias')(tareas);

/**
 * Muestra tareas vencidas
 */
export const verVencidas = (tareas: readonly Task[]): void =>
    buscarYMostrar(estaVencida(new Date()))('Tareas Vencidas')(tareas);

/**
 * Muestra tareas relacionadas
 */
export const verRelacionadas = (tareaBase: Task, tareas: readonly Task[]): void => {
    mensaje(`\nTarea seleccionada: ${tareaBase.titulo} (Categoria: ${tareaBase.categoria})`);
    buscarYMostrar(estaRelacionada(tareaBase))(`Tareas relacionadas con "${tareaBase.titulo}"`)(tareas);
};

// ============== EXPORTADOS PARA PRUEBAS (PUROS) ==============
export const filtrarTareasPrioritarias = (tareas: readonly Task[], fecha: Date = new Date()) =>
    filtrar(esPrioritaria(fecha))(tareas);

export const filtrarTareasVencidas = (tareas: readonly Task[], fecha: Date = new Date()) =>
    filtrar(estaVencida(fecha))(tareas);

export const filtrarTareasRelacionadas = (tareaBase: Task, tareas: readonly Task[]) =>
    filtrar(estaRelacionada(tareaBase))(tareas);