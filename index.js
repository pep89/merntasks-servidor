//De momento NODE no soporta del todo bien los imports por lo
//que para importar expres utilizaremos require
const express = require('express');
const conectarDB = require('./config/db');
const cors = require('cors');

//Creamos el servidor
const app = express();

//Conectar a la BBDD
conectarDB();

//habilitar cors
/* Cors sirve para poder hacer peticiones a la api desde
un dominio diferente y como tenemos cliente y servidor separados
este será necesarios */
app.use(cors());

//Habilitar express.json (nos va a permitir leer datos que el usuario coloque)
app.use(express.json( {extended: true }));

//puerto de la app
const port = process.env.port || 4000;

//Importar rutas
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/proyectos', require('./routes/proyectos'));
app.use('/api/tareas', require('./routes/tareas'));


//Definir la página principal
/* app.get('/', (req, res) => {
    res.send('Hola Mundo');
}) */

//arrancar la app
app.listen(port, '0.0.0.0', () => {
    console.log(`El servidor funciona en el puerto ${port}`);
});