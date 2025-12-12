/**
 * @module interfaz/exports
 * @description Re-exporta los módulos principales de la interfaz.
 */

export { mainMenu, procesarOpcionMenu, type MainMenuResult } from './menu/main.ts';
export { 
    formatearMenuPrincipal, 
    generarTextoMenu
} from './menu/renderizado.ts';
export {
    ejecutarVerTareas,
    ejecutarBuscarTareas,
    ejecutarAgregarTarea,
    ejecutarSalir,
    obtenerAccionPorOpcion,
    type MenuActionResult
} from './menu/acciones.ts';
export {
    crearResultadoSinCambios,
    crearResultadoConCambios,
    generarLineasMenu,
    mostrarLineasMenu
} from './menu/funciones.ts';
