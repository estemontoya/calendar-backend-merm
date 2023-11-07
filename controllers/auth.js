const { response } = require('express');
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const {generarJWT} = require('../helpers/jwt');


const createUser = async(req, res = response) =>{
    //request = lo que se solicita
    //response = es lo que el api responde
    try {
        /**
         * Validar si un usuario existe
         * hacerlo despues
         */
        const {email, password} = req.body;
        let usuario = await Usuario.findOne({email});
        //console.log(usuario);
        if(usuario){
            res.status(501).json({
                ok:false,
                msg:'El usuario ya exisite'
            });
        }

        usuario = new Usuario(req.body);
        //Encriptar la contraseña 
        const salt = bcrypt.genSaltSync(10);
        usuario.password= bcrypt.hashSync(password, salt);

        await usuario.save();

        res.status(201).json({
            ok:true,
            uid:usuario.id,
            name:usuario.name
        });
    } catch (error) {
        console.log(error);

        res.status(500).json({
            ok:false,
            msg:'Error al dar de alta usaurio'
        });
    }
    
}

const loginUsuario = async(req, res = response) =>{
    const {name, email, password} = req.body;

    try {

        let usuario = await Usuario.findOne({email});
        //console.log(usuario);
        if(!usuario){
            return res.status(501).json({
                ok:false,
                msg:'El usuario no exisite con esos datos'
            });
        }

        //Validar passwords
        const validarPassword = bcrypt.compareSync(password, usuario.password);
        if(!validarPassword){
            return res.status(501).json({
                ok:false,
                msg:'El usuario no exisite con esos datos'
            });
        }

        //Generar nuestro JWT
        const token = await generarJWT(usuario.id, usuario.name);

        res.status(200).json({
            ok:true,
            uid:usuario.id,
            email:usuario.email,
            token:token
        });

        
    } catch (error) {
            res.status(500).json({
            ok:false,
            msg:'Hablar con el administrador'
        });
    }
}

const revalidarToken = async(req, res = response) =>{
    console.log(req);
    //Generar nuestro JWT
    const token = await generarJWT(req.uid, req.name);
    res.json({
        ok:true,
        token
    });
}

module.exports = {
    createUser,
    loginUsuario,
    revalidarToken
}