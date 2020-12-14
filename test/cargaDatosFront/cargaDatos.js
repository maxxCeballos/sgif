const inscribirMesa = require('./inscribirMesa');
const readline = require('readline');
const testData = "hola";

async function main() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    console.log("--> Comenzando a Agregar")
    let datosInscribirMesa = await inscribirMesa.cargaInscribirMesa();
    console.log("--> Datos Agregados Correctamente");

    rl.question('Esperando input...', async function () {
        console.log("--> Comenzando Eliminacion")
        let response = await inscribirMesa.eliminarInscribirMesa(datosInscribirMesa);
        if (!response) console.log("Error al eliminar los datos");

        console.log("--> Datos Eliminados Correctamente")
        rl.close();
    });
}

main();