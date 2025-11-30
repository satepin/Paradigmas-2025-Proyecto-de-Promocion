import { menuPrompt } from '../modulos/promptSync.ts';
import { listado } from './listado.ts';
import type { Task, TaskStatus } from '../../type.ts';
import { datePrompt } from '../modulos/fechas.ts';
import { and, or, lvar, eq } from '../modulos/logic.ts';
/**filtra las tareas por prioridad alta y muestra la lista usando la función listado
 * se consideran prioritarias las tareas pendientes y en curso que expiran en 3 días o menos
 * @param tareas
**/
export function verPrioridad(tareas: readonly Task[]): void {
    const hoy = new Date();
    const tresDiasDespues = new Date();
    tresDiasDespues.setDate(hoy.getDate() + 3);
    const tareasPrioritarias = tareas.filter(tarea => 
        (tarea.estado === 'pendiente' || tarea.estado === 'en curso') &&
        tarea.vencimiento !== null &&
        tarea.vencimiento <= tresDiasDespues
    );
    mostrarFiltradas(tareasPrioritarias, 'Tareas Prioritarias');
}

/**filtra las tareas relacionadas a la tarea parametro y muestra una lista de estas
 * se consideran tareas relacionadas aquellas que comparten categoria con la tarea selecta
 * @param tareas 
 */
export function verRelacionadas(tareas: readonly Task[]): void {
    for (const tarea of tareas) {
        console.log(`\nTarea seleccionada: ${tarea.titulo} (Categoria: ${tarea.categoria})`);
        const tareasRelacionadas = tareas.filter(t => 
            t.id !== tarea.id && estaRelacionada(t, tarea.categoria)
        );
        mostrarFiltradas(tareasRelacionadas, `Tareas relacionadas con "${tarea.titulo}"`);
    }
}

function estaRelacionada(tarea: Task, categoria: string): boolean {
    return eq(lvar(tarea.categoria), categoria);
}
/*filtra las tareas vencidas (fecha de vencimiento anterior a la fecha actual, no completadas)
* y muestra la lista usando la función listado
*/
export function verVencidas(tareas: readonly Task[]): void {
    const hoy = new Date();
    const tareasVencidas = tareas.filter(tarea => 
        tarea.vencimiento !== null && tarea.vencimiento < hoy && tarea.estado !== 'completada'
    );
    mostrarFiltradas(tareasVencidas, 'Tareas Vencidas');
}

/*recibe y muestra la lista filtrada
*/
function mostrarFiltradas(tareasFiltradas: readonly Task[], condicion: string): void {
    if (tareasFiltradas.length === 0) {
        console.log(`No hay  ${condicion.toLowerCase()}.`);
    }
    else {
        console.log(`\n===${condicion} (${tareasFiltradas.length}) ===\n`);
        listado(tareasFiltradas);
    }
}