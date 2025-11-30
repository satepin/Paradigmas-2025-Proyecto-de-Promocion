import { prompt } from "../core/tools/modulos/promptSync.ts";

function mensaje(texto: string): void {
    console.log(texto);
}

function pausaMensaje(): void {
    prompt("Presiona Enter para continuar...", { maxLength: Infinity, puedeVacio: true });
}
function clearMensaje(texto: string): void {
    console.clear();
    mensaje(texto);
}

export { mensaje, pausaMensaje, clearMensaje };