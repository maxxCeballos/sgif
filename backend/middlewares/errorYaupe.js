'use strict';

const errorHandler = (err, req, res, next) => {
    if (err.status != undefined) {
        res.status(err.status).json({
            message: err.message
        });
    } else {
        console.log('error ', err)

        res.status(500).json({
            message: 'internal server error'
        });
    }
}



module.exports = [errorHandler];