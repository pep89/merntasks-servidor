const mongoose = require('mongoose');

const ProyectoSchema = mongoose.Schema({
    nombre: {
        type: String,
        require: true,
        trim: true
    },
    creador: {
        type: mongoose.Schema.Types.ObjectId, //Es de tipo ObjectId como el que tenemos en nuestra tabla de mongoDB
        ref: 'Usuario', //Hacemos referencia al modelo 'Usuario' para relacionarlo con este modelo 'Proyecto' y así indicarle de que modelo sacamos el ObjectId
    },
    fechaCreacion: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('Proyecto', ProyectoSchema);