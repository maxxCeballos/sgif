'use strict';

const errorHandler = (err, req, res, next) => {

    console.log('Error: ', err)

    res.status(500).json({
        message: err
    });

}

module.exports = [errorHandler];