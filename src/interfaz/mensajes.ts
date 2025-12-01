import { prompt } from "../core/tools/modulos/promptSync.ts";

function mensaje(texto: string): void {
    console.log(texto);
}

function pausaMensaje(): void {
    prompt("Presiona Enter para continuar...", { maxLength: Infinity, puedeVacio: true });
}
function clearMensaje(texto: string|void): void {
    console.clear();
    if(texto !== void 0) {
        mensaje(texto);
    }
}

export { mensaje, pausaMensaje, clearMensaje };