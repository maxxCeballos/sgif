'use strict';

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const routesHandler = require('./routes/index');
const errorYaupeHandler = require('./middlewares/errorYaupe');
const errorHandler = require('./middlewares/error');


require('dotenv').config();

//Init Server
const app = express();
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());

//Init DB
const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true });

const connection = mongoose.connection;

connection.once('open', () => {
    console.log("MongoDB database connection established succesfully");
});


app.use(routesHandler);

// app.use(errorYaupeHandler);
app.use(errorYaupeHandler);

//Start Server
app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
})