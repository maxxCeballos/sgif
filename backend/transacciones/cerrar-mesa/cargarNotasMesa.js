'use strict';

const cargarNotasMesa = async (acta, notas) => {
    //TODO: Verificar acta
    if (!verificarActa(acta)) {
        throw "El acta no es valida";
    }

    //TODO: obtener mesa con acta
    

    //TODO: verificar q mesa sea Completada y fecha (ver carteles de error en transaccion)

    //TODO: obtener resultados con alumno y su calificacion

    //TODO: ACTUALIZAR DOC en vez de hacer por alumno, hago todo junto

    //TODO: establecer nota y condicion en resultado

    //TODO: establecer datos en calificacion solo si aprobo a "Aprobado"

    //TODO: cerrar mesa de examen (estado = "Cerrada")
}

module.exports = cargarNotasMesa;
