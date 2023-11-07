const {Router} = require('express');
const {ValidarJWT} = require('../middlewares/validar-jwt');
const { getEventos, crearEvento, actualizarEvento, eliminarEvento } = require('../controllers/events');
const {check} = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { isDate } = require('../helpers/isDate');

const router = Router();

//Validar que el token es valido
router.use(ValidarJWT);
//Obtener Eventos
router.get('/', getEventos);
//router.get('/', ValidarJWT, getEventos);

//Crear un nuevo evento
router.post('/', [
    //check('user', 'El usuario es obligatorio').not().isEmpty(),
    check('title', 'El titulo es obligatorio').not().isEmpty(),
    check('start','La fecha es obligatoria').custom(isDate),
    check('end','La fin es obligatoria').custom(isDate),
    validarCampos
], crearEvento);

//Actualizar un nuevo evento
router.put('/:id',  actualizarEvento);
//Elimianr Evento
router.delete('/:id', eliminarEvento );

module.exports = router;