export function validarTitulo(titulo: string): { valid: boolean; error?: string } {
    if (titulo.trim().length === 0) {
        return { valid: false, error: "El título no puede estar vacío" };
    }
    if (titulo.length > 100) {
        return { valid: false, error: "El título no puede exceder 100 caracteres" };
    }
    return { valid: true };
}

export function validarDescripcion(descripcion: string): { valid: boolean; error?: string } {
    if (descripcion.length > 500) {
        return { valid: false, error: "La descripcion no puede exceder 500 caracteres"};
    }
    return { valid: true };
}

export function validarEstado(estado: number): { valid: boolean; error?: string } {
    if (estado < 1 || estado > 4) {
        return { valid: false, error: "Valor de estado incorrecto."};
    }
    return { valid: true };
}

export function validarDificultad(estado: number): { valid: boolean; error?: string } {
    if (estado < 1 || estado > 3) {
        return { valid: false, error: "Valor de dificultad incorrecto."};
    }
    return { valid: true };
}

export function validarCategoria(estado: number): { valid: boolean; error?: string } {
    if (estado < 1 || estado > 5) {
        return { valid: false, error: "Valor de categoria incorrecto."};
    }
    return { valid: true };
}