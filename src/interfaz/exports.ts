/**
 * @module interfaz/exports
 * @description Re-exporta los módulos principales de la interfaz.
 */

export { mainMenu, procesarOpcionMenu, type MainMenuResult } from './menu/flowPrincipal/main.ts';
export { 
    formatearMenuPrincipal, 
    generarTextoMenu
} from './menu/funciones/renderer.ts';
export {
    ejecutarVerTareas,
    ejecutarBuscarTareas,
    ejecutarAgregarTarea,
    ejecutarSalir,
    obtenerAccionPorOpcion,
    type MenuActionResult
} from './menu/funciones/actions.ts';
export {
    crearResultadoSinCambios,
    crearResultadoConCambios,
    generarLineasMenu,
    mostrarLineasMenu
} from './menu/funciones/helpers.ts';