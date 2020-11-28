'use strict';

const { code } = require('./symbols')

class BadRequest extends Error {
    constructor(message = 'Bad Request', ...args) {
        super(message, ...args);

        this[code] = 400;
    }
}

class NotFound extends Error {
    constructor(message = 'Not Found', ...args) {
        super(message, ...args);

        this[code] = 404;
    }
}

module.exports = { BadRequest, NotFound };