/**
 * @module interfaz/exports
 * @description Re-exporta los módulos principales de la interfaz.
 */

export { mainMenu, procesarOpcionMenu, type MainMenuResult } from './mainMenu.ts';
export { 
    formatearMenuPrincipal, 
    generarTextoMenu
} from './menuRenderer.ts';
export {
    ejecutarVerTareas,
    ejecutarBuscarTareas,
    ejecutarAgregarTarea,
    ejecutarSalir,
    obtenerAccionPorOpcion,
    type MenuActionResult
} from './menuActions.ts';
export {
    crearResultadoSinCambios,
    crearResultadoConCambios,
    generarLineasMenu,
    mostrarLineasMenu
} from './menuHelpers.ts';
