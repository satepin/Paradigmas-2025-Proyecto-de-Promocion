import promptSync from 'prompt-sync';
import { mensaje } from '../../../interfaz/mensajes.ts';

const ask = promptSync({ sigint: true });
/**
 * Función de utilidad que obtiene la fecha actual (efectos secundarios aislados).
 * @returns {Date} La fecha actual.
 */
export function obtenerFechaActual(): Date {
    return new Date();
}
/**
 * Función pura que valida si una fecha es correcta.
 * @param {number} yyyy - Año
 * @param {number} mm - Mes (1-12)
 * @param {number} dd - Día
 * @returns {boolean} true si la fecha es válida
 */
function esFechaValida(yyyy: number, mm: number, dd: number): boolean {
    const d = new Date(yyyy, mm - 1, dd);
    return d.getFullYear() === yyyy && d.getMonth() === mm - 1 && d.getDate() === dd;
}

/**
 * Función pura que intenta parsear una fecha desde un string.
 * @param {string} input - El string de entrada
 * @returns {{ valida: true, fecha: Date } | { valida: false, error: string }} Resultado del parseo
 */
function parsearFecha(input: string): { valida: true; fecha: Date } | { valida: false; error: string } {
    const re = /^(\d{4})[/-](\d{2})[/-](\d{2})$/;
    const m = input.match(re);
    
    if (!m) {
        return { valida: false, error: 'Formato inválido. Usa aaaa/mm/dd.' };
    }
    
    const yyyy = Number(m[1]);
    const mm = Number(m[2]);
    const dd = Number(m[3]);
    
    if (!esFechaValida(yyyy, mm, dd)) {
        return { valida: false, error: 'Fecha inválida.' };
    }
    
    return { valida: true, fecha: new Date(yyyy, mm - 1, dd) };
}

/**
 * Solicita una fecha al usuario en formato aaaa/mm/dd.
 * @param {string} [question='Fecha (yyyy/mm/dd): '] - La pregunta a mostrar.
 * @param {boolean} [allowEmpty=true] - Si se permite una entrada vacía.
 * @returns {Date | null} La fecha validada o nulo si está vacía.
 */
export function datePrompt(question: string = 'Fecha (yyyy/mm/dd): ', allowEmpty: boolean = true): Date | null {
    const pedirFecha = (): Date | null => {
        const s: string = ask(question);
        
        if (allowEmpty && s.trim() === '') return null;
        
        const resultado = parsearFecha(s);
        
        if (resultado.valida) {
            return resultado.fecha;
        }
        
        mensaje(resultado.error);
        return pedirFecha(); // Recursión en lugar de while
    };
    
    return pedirFecha();
}