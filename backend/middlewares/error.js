'use strict';

const { code } = require("./symbols")

const errorHandler = (err, req, res, next) => {

    const message = err[code] ? "Error: " + err.message : "Error: " + err;

    res.status(err[code] || 500).json({
        ok: false,
        message,
        stack: process.env.NODE_ENV !== 'production' ? err.stack : undefined
    });
};

module.exports = [errorHandler];