const mongoose = require('../backend/node_modules/mongoose');
const express = require('../backend/node_modules/express');
const cors = require('../backend/node_modules/cors/lib');
const routesHandler = require('../backend/routes/index');
const errorHandler = require('../backend/middlewares/error');

let connection;
let server;
let flagServer;

async function conectar(flagServerParam) {
    flagServer = flagServerParam;
    if (flagServer) {
        await crearServer();
    }

    const uri = "mongodb+srv://user-fatima-2020:12qwaszx@cluster0.tyrtj.mongodb.net/fatima?retryWrites=true&w=majority";
    mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true });
    connection = mongoose.connection;

    await connection.once('open', () => {
        console.log("MongoDB database connection established succesfully");
    })
}

async function crearServer() {
    const app = express();
    const port = 5000;

    app.use(cors());
    app.use(express.json());

    app.use(routesHandler);

    app.use(errorHandler);

    server = await app.listen(port, () => {
        console.log(`Server running on port: ${port}`);
    });
}

function desconectar() {
    connection.close();
    if (flagServer) {
        server.close();
    }
}

module.exports = {
    conectar,
    desconectar
}