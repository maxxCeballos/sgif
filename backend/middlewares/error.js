'use strict';

const errorHandler = (err, req, res, next) => {

    console.log('el error ', err)

    res.status(500).json({
        message: 'internal server error'
    });

}



module.exports = [errorHandler];