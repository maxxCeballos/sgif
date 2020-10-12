const router = require("./alumno")

router.get('/insc-alumno/validar-alumno/:dni', asynchandler(async (req, res) => {
    //if (existe){
    // if (reinscripto) { error } else{
    // ok puede reinscribir}
    //}else{
    // responde
    //}
}))

router.post('/insc-alumno/alumno', asyncHandler(async (req, res) => { }))

router.get('/insc-alumno/responsable/:dni', asynchandler(async (req, res) => { }))

router.post('/insc-alumno/responsable', asyncHandler(async (req, res) => {
    //crearlo con controller
    //actualizar alumno
}))

router.put('/insc-alumno/alumno/:dni',asynchandler(async (req, res) => {
    req.params.atributo //se cambia el año o el estado reinscripto
    req.params.valorAtributo;

    

}))
