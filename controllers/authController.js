const Usuario = require('../models/Usuario')
const bcryptjs = require('bcryptjs')
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');


exports.autenticarUsuario = async (req, res) => {

    //Revisar si hay errores
    const errores = validationResult(req);
    if(!errores.isEmpty() ) {
        return res.status(400).json({ errores : errores.array() })
    }

    //extraer el email y password
    const { email, password } = req.body;
    
    try {
        let usuario = await Usuario.findOne( { email });
        if(!usuario) {
            return res.status(400).json({ msg: "El usuario no existe"});
        }

        //Revisar el password
        const passCorrecto = await bcryptjs.compare(password, usuario.password);
        if(!passCorrecto){
            return res.status(400).json({ msg: "password incorrecto"});
        }

        //Si todo es correcto creamos y firmamos el Jason Web Token

        //crear el JWT
        const payload = {
            usuario: {
                id: usuario.id
            }
        };

        //Firmar el JWT
        jwt.sign(payload, process.env.SECRETA, {
            expiresIn: 3600 //La sesion expira en 1 hora
        }, (error, token) => {
            if(error) throw error;
            //Si no hay error Mensaje de confirmacion
            res.json({ token })
        });


    } catch (error) {
        console.log(error);
    }
}

//Obtiene el usuario autenticado

exports.usuarioAutenticado = async (req, res) => {
    try {
        //En mongoose para hacer una consulta y especificar los campos que no queremos extraer, se hace con '.select('-[campo])
        //Cuando se autentica un usuario, no queremos que se guarde el password (aunque esté hasheado), por seguridad
        const usuario = await Usuario.findById(req.usuario.id).select('-password'); 
        res.json({usuario});
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: 'Hubo un error'});
    }
}