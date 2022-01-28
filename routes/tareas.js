const express = require('express');
const router = express.Router();
const tarea = require('../controllers/tareaController');
const  { check } = require('express-validator');
const auth = require('../middleware/auth');

//crear una tarea --> POST --> api/tareas
router.post('/',
    auth,
    [
        check('nombre', 'El Nombre es obligatorio').not().isEmpty(),
        check('proyecto', 'El Proyecto es obligatorio').not().isEmpty()
    ],  
    tarea.crearTarea
);

//Obtener las tareas por proyecto --> GET --> api/tareas
router.get('/',
    auth,
    tarea.obtenerTareas
);

//Actualizar tarea --> PUT --> api/tareas/id
router.put('/:id',
    auth,
    tarea.actualizarTarea
)

//Eliminar tarea --> DELET --> api/tareas/id
router.delete('/:id',
    auth,
    tarea.eliminarTarea
);

//Eliminar todas tareas --> DELET --> api/tareas/
router.delete('/',
    auth,
    tarea.eliminarTodasTareas
);



module.exports = router;
