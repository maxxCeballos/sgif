'use strict';

const { code } = require("./symbols")

const errorHandler = (err, req, res, next) => {
    // eslint-disable-line    
    const message = err[code] ? "Error: " + err.message : "Error: " + err;
    console.log("Error: \n\tCodigo: ", err[code], "\n\tMensaje:", err.message);

    res.status(err[code] || 500).json({
        message,
        stack: process.env.NODE_ENV !== 'production' ? err.stack : undefined
    });
};

module.exports = [errorHandler];