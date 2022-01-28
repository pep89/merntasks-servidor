const mongoose = require('mongoose');

const TareaSchema = mongoose.Schema({
    nombre: {
        type: String,
        require: true,
        trim: true
    },
    estado: {
        type: Boolean,
        default: false
    },
    fechaCreacion: {
        type: Date,
        default: Date.now()
    },
    proyecto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Proyecto' //La referencia tiene que ser igual al nombre del modelo al que hace referencia
    }
});

module.exports = mongoose.model('Tarea', TareaSchema)