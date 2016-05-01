var path = require('path');

// Cargar Modelo ORM
var Sequelize = require('sequelize');

// Usar BBDD SQLite:
 //  DATABASE_URL = sqlite:///
 //  DATABASE_STORAGE = quiz.sqlite
// Usar BBDD Postgres:
 // DATABASE_URL = postgres://upostgres://apsxqkqsttkkjm:vG38vD5q_uL4N-P8j3I9B-5TXF@ec2-54-243-195-46.compute-1.amazonaws.com:5432/dee2j847veip7l

var url, storage;

if (!process.env.DATABASE_URL) {
     url = "sqlite:///";
     storage = "quiz.sqlite";
} else {
     url = process.env.DATABASE_URL;
     storage = process.env.DATABASE_STORAGE || "";
}

var sequelize = new Sequelize(url,
                              { storage: storage,
                                omitNull: true
                              });


// Importar la definición de la tabla Quiz de quiz.js
var Quiz = sequelize.import(path.join(__dirname, 'quiz'));

// sequelize.sync() crea e inicializa tabla de preguntas en DB
sequelize
.sync()
.then(function() { // sync() crea la tabla Quiz
   return
     Quiz
     .count()
     .then(function (c) {
     	if (c === 0) { // la tabla se inicializa si está vacía
     		return
     		 Quiz
     		 .create({ question: 'Capital de Italia', answer: 'Roma' })
     		 .then(function(){
     		 	console.log('Base de datos inicializada con datos');
     		 });
     	}
     });
}).catch(function(error) {
	console.log("Error Sincronizando las tablas de la BBDD:", error);
	process.exit(1);
});

exports.Quiz = Quiz; // exportar definición de la tabla Quiz