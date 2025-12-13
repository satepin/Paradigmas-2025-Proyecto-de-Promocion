/**
 * @module interfaz/exports
 * @description Re-exporta los módulos principales de la interfaz.
 */

export { mainMenu, procesarOpcionMenu, type MainMenuResult } from './menu/main.ts';
export { 
    formatearMenuPrincipal, 
    generarTextoMenu
} from './menu/renderer.ts';
export {
    ejecutarVerTareas,
    ejecutarBuscarTareas,
    ejecutarAgregarTarea,
    ejecutarSalir,
    obtenerAccionPorOpcion,
    type MenuActionResult
} from './menu/actions.ts';
export {
    crearResultadoSinCambios,
    crearResultadoConCambios,
    generarLineasMenu,
    mostrarLineasMenu
} from './menu/helpers.ts';