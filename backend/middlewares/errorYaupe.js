
'use strict';

const errorHandler = (err, req, res, next) => {

    const error = JSON.parse(err);
    console.log('el error ' + err);


    res.status(200).json({
        message: error.message,
        code: error.code
    });

}



module.exports = [errorHandler];