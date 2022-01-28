const express = require('express');
const router = express.Router();
const proyectoController = require('../controllers/proyectoController');
const auth = require('../middleware/auth');
const { check } = require('express-validator');
 
//Crea un proyecto --> POST --> api/proyectos
router.post('/',
    auth, //Primero ejecuta este middleware, generador del token (el creado para autenticar)
    [
        check('nombre', 'El nombre del proyecto es obligatorio').not().isEmpty()
    ],  
    proyectoController.crearProyecto
);
//Obtener todos los proyectos --> GET --> api/proyectos
router.get('/',
    auth, //Primero ejecuta este middleware, generador del token (el creado para autenticar)
    proyectoController.obtenerProyectos
);
//Actualizar un proyecto via ID --> PUT --> api/proyectos
router.put('/:id',
    auth,
    [
        check('nombre', 'El nombre del proyecto es obligatorio').not().isEmpty()
    ],  
    proyectoController.actualizarProyecto
);
//Eliminar un proyecto vi ID --> DELET --> api/proyectos
router.delete('/:id',
    auth,
    proyectoController.eliminarProyecto
);
module.exports = router;
