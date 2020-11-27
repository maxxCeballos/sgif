const mongoose = require('../../backend/node_modules/mongoose');

let connection;

async function conectar() {
    const uri = "mongodb+srv://user-fatima-2020:12qwaszx@cluster0.tyrtj.mongodb.net/fatima?retryWrites=true&w=majority";
    mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true });
    connection = mongoose.connection;

    await connection.once('open', () => {
        console.log("MongoDB database connection established succesfully");
    })
}

function desconectar() {
    connection.close();
}

module.exports = {
    conectar,
    desconectar
}