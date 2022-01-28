//rutas para autenticar usuarios
const express = require('express');
const router = express.Router();
const  { check } = require('express-validator');
const auth = require('../middleware/auth');
const authController = require('../controllers/authController');

//Autenticar un usuario --> POST --> api/auth
router.post('/',
    /*Agregamos las validaciones (los campos a validar) pertinentes 
    en un array con check, pero la comprobación de la validación se 
    realiza en el controller asignado: */
    /* [
        check('email', 'Agrega un email valido').isEmail(),
        check('password', 'El password debe ser mínimo de 6 caracteres').isLength({min: 6})
    ], */ //No hace falta esta validación porque ya la validamos en React (frontEnd).
    /* Añadimos el controller con el método encargado para realizar 
    la acción post de auth. */
    authController.autenticarUsuario
);

//Obtener el usuario autenticado --> GET --> api/auth
router.get('/',
    auth,
    authController.usuarioAutenticado
)

module.exports = router;