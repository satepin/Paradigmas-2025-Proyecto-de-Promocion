import { prompt } from "../core/tools/modulos/promptSync.ts";

/**
 * Muestra un mensaje en la consola.
 * Responsabilidad: Única fuente de output en consola.
 * @param {string} texto - El texto a mostrar
 * @returns {void}
 */
function mensaje(texto: string): void {
    console.log(texto);
}

/**
 * Pausa la ejecución hasta que el usuario presione Enter.
 * Responsabilidad: Capturar confirmación del usuario.
 * @returns {void}
 */
function pausaMensaje(): void {
    prompt("Presiona Enter para continuar...", { maxLength: Infinity, puedeVacio: true });
}

/**
 * Limpia la consola y opcionalmente muestra un mensaje.
 * Responsabilidad: Limpiar pantalla y mostrar encabezado.
 * @param {string|void} texto - Texto opcional a mostrar después de limpiar
 * @returns {void}
 */
function clearMensaje(texto: string|void): void {
    console.clear();
    if(texto !== void 0) {
        mensaje(texto);
    }
}

export { mensaje, pausaMensaje, clearMensaje };