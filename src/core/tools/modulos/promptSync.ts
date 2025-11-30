/**
 * @module tools/input/promptSync
 * @description Proporciona funciones de utilidad para solicitar y validar la entrada del usuario.
 */

import promptSync from 'prompt-sync';
import type { ValidationFlag } from '../../type.ts';
import { mensaje } from '../../../interfaz/mensajes.ts';

const ask = promptSync({ sigint: true });

/**
 * Solicita una entrada de texto al usuario y la valida según las banderas proporcionadas.
 * @param {string} question - La pregunta a mostrar al usuario.
 * @param {ValidationFlag} [flags={ maxLength: Infinity, puedeVacio: false }] - Banderas para validar la entrada.
 * @returns {string} La entrada validada del usuario.
 */
export function prompt(question: string, flags: ValidationFlag = { maxLength: Infinity, puedeVacio: false }): string {
    while (true) {
        let value: string = ask(question);
        if (flags.puedeVacio == false && value.trim().length === 0) {
            mensaje('La entrada no puede estar vacía.');
        }
        if (value.length > flags.maxLength) {
            mensaje(`Se ha recortado el texto a ${flags.maxLength} caracteres.`);
            value = value.slice(0, flags.maxLength);
        }
        return value;
    }
}

/**
 * Presenta un conjunto de opciones y solicita al usuario que elija una.
 * @template T
 * @param {Map<T, number>} flags - Un mapa de opciones a números.
 * @returns {T} La opción elegida por el usuario.
 */
export function set<T>(flags: Map<T, number>): T {
    // mostrar todas las opciones disponibles del mapa
    Array.from(flags.entries()).forEach(([opcion, numero]) => {
        mensaje(`${numero} - ${opcion}`);
    });
    
    while (true) {
        const entrada: string = ask('Elige una opción: ');
        const opcionEncontrada = Array.from(flags.entries()).find(
            ([_, numero]) => String(entrada) === String(numero)
        );
        
        if (opcionEncontrada) {
            return opcionEncontrada[0];
        }
        mensaje('Opción inválida, intenta nuevamente.');
    }
}

/**
 * Solicita una entrada numérica al usuario para la navegación del menú.
 * @param {string} question - La pregunta a mostrar.
 * @param {number} min - El valor mínimo aceptable.
 * @param {number} max - El valor máximo aceptable.
 * @returns {number} El número validado.
 */
export function menuPrompt(question: string, min: number, max: number): number {
    while (true) {
        const raw: string = ask(question);
        const num: number = Number(raw);
        if (!Number.isFinite(num)) {
            mensaje('Ingresa un número válido.');
            continue;
        }
        const n: number = Math.trunc(num);
        if (n < min || n > max) {
            mensaje(`Ingresa un número entre ${min} y ${max}.`);
            continue;
        }
        return n;
    }
}