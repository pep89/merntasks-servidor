const mongoose = require('mongoose');
require('dotenv').config({path: 'variables.env'});

const conectarDB = async () => {
    try{
        await mongoose.connect(process.env.DB_MONGO, {     
            useNewUrlParser: true,
            useUnifiedTopology: true,
            //useFindAndModify: false //esta linea no hace falta a partir de la version 6 de mongoose
        });
        console.log('DB Conectada');
    }catch (error){
        console.log(error);
        process.exit(1); //Detener la App en caso de error de conexion
    }
}

module.exports = conectarDB;