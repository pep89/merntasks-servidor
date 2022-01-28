const Usuario = require('../models/Usuario')
const bcryptjs = require('bcryptjs')
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.crearUsuario = async (req, res) => {
    //console.log(req.body);

    //Revisar si hay errores
    /* Segun la validacion definida en el router de usuarios (routes/usuarios)
    realizamos dicha validación mediante la funcion validationResult importada
    de express-validator */
    const errores = validationResult(req);
    if(!errores.isEmpty() ) {
        return res.status(400).json({ errores : errores.array() })
    }

    //extraer email y password
    const { email, password } = req.body;

    try{
        //Revisar que el usuario registrado sea unico
        let usuario = await Usuario.findOne({ email });

        if(usuario) {
            return res.status(400).json({msg: 'El usaurio ya existe'});
        }

        //Crea el nuevo usuario
        usuario = new Usuario(req.body);

        //Encriptar el password
        const salt = await bcryptjs.genSalt(10); //El salt permite encriptar con valores diferentes una misma contraseña
        usuario.password = await bcryptjs.hash(password, salt);

        //guardar usaurio
        await usuario.save();

        //crear el JWT
        const payload = {
            usuario: {
                id: usuario.id
            }
        };

        //firmar el JWT
        jwt.sign(payload, process.env.SECRETA, {
            expiresIn: 3600 //La sesion expira en 1 hora
        }, (error, token) => {
            if(error) throw error;
            //Mensaje de confirmacion
            //res.json({ token : token  });
            res.json({ token }) //Cuando key y valor se llaman igual se puede abreviar así
        });

    }catch (error){
        console.log(error);
        res.status(400).send('Hubo un error');
    }
}