var models = require('../models');
var Sequelize = require('sequelize');


/* Autenticar un usuario si usuario está en la tabla users
 * 
 * Devuelve Promesa: busca usuario con login dado y comprueba su password
 * - autenticación ok, devuelve objeto User con then(..)
 * - autent. falla, promesa satisfecha pero devuelve null
*/
var authenticate = function(login, password) {
	return models.User.findOne({where: {username: login}})
		.then(function(user) {
			if (user && user.verifyPassword(password)) {
				return user;
			} else {
				return null;
			}
		});
};


// Middleware: Se requiere hacer login.
//
// Si el usuario ya hizo login anteriormente entonces existira 
// el objeto user en req.session, por lo que continuo con los demas 
// middlewares o rutas.
// Si no existe req.session.user, entonces es que aun no he hecho 
// login, por lo que me redireccionan a una pantalla de login. 
// Guardo en redir cual es mi url para volver automaticamente a 
// esa url despues de hacer login; pero si redir ya existe entonces
// conservo su valor

exports.loginRequired = function (req, res, next) {
	if (req.session.user) {
		next();
	} else {
		res.redirect('/session?redir=' + (req.param('redir') || req.url));
	}
};



// GET /session --Formulario de login
exports.new = function(req, res, next) {
	res.render('session/new', { redir: req.query.redir || '/'});
};

// POST /session --Crear sesion si usuario ok
exports.create = function(req,res,next) {
	var redir 	 = req.body.redir || '/';
	var login 	 = req.body.login;
	var password = req.body.password;

	authenticate(login, password)
		.then(function(user) {
			if (user) {
				// Crear req.session.user y guardar campos id y username
				// La sesión se define por la existencia de: req.session.user
				req.session.user = {id:user.id, username:user.username};

				res.redirect("/"); // redirección a la raíz
			} else {
				req.flash('error', 'La autenticación ha fallado. Reinténtelo otra vez');
				res.redirect("/session"); // redirect a login
			}
		})
		.catch(function(error) {
			req.flash('error', 'Se ha producido un error: ' + error);
			next(error);
		});
};

// DELETE /session --Destruir sesión
exports.destroy = function(req, res, next) {
	delete req.session.user;
	res.redirect('/session'); // redirect a login
};

