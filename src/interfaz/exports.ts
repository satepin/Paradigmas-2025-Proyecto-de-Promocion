/**
 * @module interfaz/exports
 * @description Re-exporta los módulos principales de la interfaz.
 */

export { mainMenu, procesarOpcionMenu, type MainMenuResult } from './menu/mainMenu.ts';
export { 
    formatearMenuPrincipal, 
    generarTextoMenu
} from './menu/menuRenderer.ts';
export {
    ejecutarVerTareas,
    ejecutarBuscarTareas,
    ejecutarAgregarTarea,
    ejecutarSalir,
    obtenerAccionPorOpcion,
    type MenuActionResult
} from './menu/menuActions.ts';
export {
    crearResultadoSinCambios,
    crearResultadoConCambios,
    generarLineasMenu,
    mostrarLineasMenu
} from './menu/menuHelpers.ts';
