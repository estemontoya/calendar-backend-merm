const {Router} = require('express');
const router = Router();
const { createUser,loginUsuario, revalidarToken } = require('../controllers/auth');
const {check} = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const {ValidarJWT} = require('../middlewares/validar-jwt');

router.post('/new',
[
    //Validaciones o  middlewares
    check('name','El nombre es invalido').not().isEmpty(),
    check('email','Email invalido').isEmail(),
    check('password','El password debe ser mayor a 6 caracteres').isLength({min:6},
    validarCampos)
], createUser);

router.post('/', [
    check('email','Email es obligatorio').isEmail(),
    check('password','El password debe ser mayor a 6 caracteres').isLength({min:6})
],loginUsuario);

router.get('/renew', ValidarJWT, revalidarToken);


module.exports = router;