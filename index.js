const express = require('express');
const { dbConnection } = require('./database/config');
//Importar DOTENV
require('dotenv').config();
const cors = require('cors')

//Creando el servidor de express
const app = express();

//Base de Datos
dbConnection();
//CORS
app.use(cors());
app.use( express.static('public'));
/*
*Exportamos para que podamos recibir datos en un post
*/
app.use(express.json());
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));

/**
 * Para escuchar lar peticiones
 */

app.listen(process.env.PORT , () =>{
         console.log('Escuchando peticiones');
});


