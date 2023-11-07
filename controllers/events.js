/**
 * Events Routes
 * /api/events
 */
const { response } = require('express');
const Evento = require('../models/Evento');

const getEventos = async( req, res = response ) => {

    const eventos = await Evento.find()
                                .populate('user','name');

    res.json({
        ok: true,
        eventos
    });
}

const crearEvento = async(req, res = response) =>{
    // console.log(req.body);
    const evento = new Evento(req.body);
    try {
        evento.user = req.uid;
        const eventoGuardado = await evento.save();

        res.status(200).json({
            ok:true,
            evento:eventoGuardado
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            ok:false,
            msg:'No se pudo crear el evento'
        })
    }
}

const actualizarEvento = async( req, res = response ) => {
    
    const eventoId = req.params.id;
    const uid = req.uid;

    try {

        const evento = await Evento.findById( eventoId );
        //Validamos si el evento existe
        if ( !evento ) {
            return res.status(404).json({
                ok: false,
                msg: 'Evento no existe por ese id'
            });
        }

        //Validamos si el usuario que quiere editarlo es la misma que lo creo
        if ( evento.user.toString() !== uid ) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegio de editar este evento'
            });
        }

        const nuevoEvento = {
            ...req.body,
            user: uid
        }

        //Si colocamos new:true tare el evento actualizado, si no ponemos nada, nos traera el viejo
        const eventoActualizado = await Evento.findByIdAndUpdate( eventoId, nuevoEvento, { new: true } );

        res.json({
            ok: true,
            evento: eventoActualizado
        });

        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            eventoId
        });
    }

}

const eliminarEvento = async( req, res = response ) => {

    const eventoId = req.params.id;
    const uid = req.uid;

    try {

        const evento = await Evento.findById( eventoId );

        if ( !evento ) {
            return res.status(404).json({
                ok: false,
                msg: 'Evento no existe por ese id'
            });
        }

        if ( evento.user.toString() !== uid ) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegio de eliminar este evento'
            });
        }


        await Evento.findByIdAndDelete( eventoId );

        res.json({ ok: true });

        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }

}

module.exports = {
    getEventos,
    crearEvento,
    actualizarEvento,
    eliminarEvento
}