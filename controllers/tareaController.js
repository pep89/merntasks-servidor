const Tarea = require('../models/Tarea')
const Proyecto = require('../models/Proyecto')
const { validationResult, query } = require('express-validator');

//Crea una nueva tarea
exports.crearTarea = async (req, res) => {

    //Revisar si hay errores
    const errores = validationResult(req);
    if(!errores.isEmpty() ) {
        return res.status(400).json({ errores : errores.array() })
    }

    try {

        //Extraer el proyecto
        const { proyecto } = req.body;

        //comprobar que el proyecto existe
        const proyectoExiste = await Proyecto.findById(proyecto);
        if(!proyectoExiste) {
            return res.status(400).json( { msg: 'Proyecto no encontrado'});
        }

        //Revisar si el proyecto no pertenece al usuario autenticado 
        //req.usuario lo extraemos del midleware auth que ejecutamos antes que esta función en el router.POST de la ruta tareas.
        if(proyectoExiste.creador.toString() !== req.usuario.id){
            return res.status(401).json({ msg: 'No autorizado' });
        }

        //Creamos la tarea
        const tarea = new Tarea(req.body);
        await tarea.save();
        res.json( { tarea });

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

//Obtiene las tareas por proyecto
exports.obtenerTareas = async (req, res) => {
    
    
    try {

        //Extraer el proyecto
        //const { proyecto } = req.body;
        const { proyecto } = req.query; //Utilizamos "req.query" porque la consulta que realizamos desde el cliente (TareaState), en la función "obtenerTareas", cuando hacemos el GET a '/api/tareas' indicamos el proyecto al que pertenece mediante params --> { params: { proyectoId }}
        //console.log(proyecto);
        //comprobar que el proyecto existe
        const proyectoExiste = await Proyecto.findById(proyecto);
        if(!proyectoExiste) {
            return res.status(400).json( { msg: 'Proyecto no encontrado'});
        }

        //Revisar si el proyecto pertenece al usuario autenticado 
        if(proyectoExiste.creador.toString() !== req.usuario.id){
            return res.status(401).json({ msg: 'No autorizado' });
        }

        //Obtener las tareas por proyecto
        /* Utilizamos el metodo find (es como el where de mongo) para buscar el id del proyecto en la tarea. 
        { proyecto (campo proyecto de la tabla Tarea, que es un id) : proyecto (proyectoId pasado por parametros y recogido en la constante proyecto) }
        */
        const tareas = await Tarea.find( { proyecto }); //object literal enhancement --> { proyecto (key) : proyecto (value)}
        res.json( { tareas }); //object literal enhancement --> { tareas (key) : tareas (value)}


    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

//actualizar una tarea
exports.actualizarTarea = async (req, res) => {

    try {

        //Extraer datos del body id del proyecto = proyecto
        const { proyecto, nombre, estado } = req.body;

        //comprobar que la tarea existe
        let tarea = await Tarea.findById(req.params.id); //los params son '/:id' en el router
        if(!tarea) {
            return res.status(400).json( { msg: 'Tarea no encontrada'});
        }

        //extraer proyecto y Revisar si perteneca al usuario autenticado
        const proyectoExiste = await Proyecto.findById(proyecto);
        if(proyectoExiste.creador.toString() !== req.usuario.id){
            return res.status(401).json({ msg: 'No autorizado' });
        }

        //Comprobar que la tarea pertenece al proyecto seleccionado
        if(tarea.proyecto.toString() !== proyecto.toString()) {
            return res.status(402).json( { msg: "La tarea no pertenece al proyecto" });
        }

        //crear objeto con nueva informacion
        const nuevaTarea = {};
        //if(nombre) nuevaTarea.nombre = nombre;
        //if(estado) nuevaTarea.estado = estado;
        nuevaTarea.nombre = nombre;
        nuevaTarea.estado = estado;

        //Guardar la tarea
        tarea = await Tarea.findOneAndUpdate( 
            { _id : req.params.id }, 
            nuevaTarea,
            { new: true}
        );
        res.json( { tarea });

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

//Eliminar una tarea
exports.eliminarTarea = async ( req, res ) => {

    try {

        //Extraer el id del proyecto
        //const { proyecto } = req.body;
        const { proyecto } = req.query;

        //comprobar que la tarea existe
        let tarea = await Tarea.findById(req.params.id); //los params son '/:id' en el router
        if(!tarea) {
            return res.status(400).json( { msg: 'Tarea no encontrada'});
        }

        //extraer proyecto y Revisar si perteneca al usuario autenticado
        const proyectoExiste = await Proyecto.findById(proyecto);
        if(proyectoExiste.creador.toString() !== req.usuario.id){
            return res.status(401).json({ msg: 'No autorizado' });
        }
 
        //Eliminar la tarea
        await Tarea.findByIdAndRemove( 
            { _id : req.params.id  }
        );
        res.json( { msg : "Tarea eliminada correctamente"});

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

//Eliminar una tarea
exports.eliminarTodasTareas = async ( req, res ) => {

    try {

        //Extraer el proyecto
        //const { proyecto } = req.body; //utilizamos "req.body" cuando realizamos la consulta sin params desde el servidor (postman)
        const { proyecto } = req.query; //Utilizamos "req.query" cuando utilizamos params en la parte cliente


        //extraer proyecto y Revisar si perteneca al usuario autenticado
        const proyectoExiste = await Proyecto.findById(proyecto);
        if(proyectoExiste.creador.toString() !== req.usuario.id){
            return res.status(400).json({ msg: 'No autorizado' });
        }

        //Obtener las tareas por proyecto
        const tareas = await Tarea.find( { proyecto }).select('_id'); //object literal enhancement --> { proyecto (key) : proyecto (value)}
        
        //Si no hay tareas creadas para el proyecto seleccionado
        if(tareas.length === 0){
            return res.status(401).json({ msg: 'No hay tareas en este proyecto' });
        }

        const idTareas = [];
        tareas.forEach( tarea => {
            idTareas.push(tarea._id);
        })
        //console.log(idTareas);

        await Tarea.deleteMany({ _id: idTareas });
        res.json( { msg : "Tareas eliminadas correctamente"});

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}