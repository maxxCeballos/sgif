'use strict';

const ERROR_FORMATO = 1;
const ERROR_FORMATO_MSG = "Mira hermano, te las mandaste, que queres q te diga";

const errorHandler = (err, req, res, next) => {
    // console.log('el error ', err)
    switch (err.codigo) {
        case ERROR_FORMATO:
            //DEVOLVER ERROR DE FORMATO
            res.status(500).json({
                message: ERROR_FORMATO_MSG,
                expanded: err
            });
            break;    
        default:
            break;
    }    

    res.status(500).json({
        message: 'internal server error',
        expanded: err
    });

}



module.exports = [errorHandler];