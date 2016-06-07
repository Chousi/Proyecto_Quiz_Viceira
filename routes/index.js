var express = require('express');
var router = express.Router();

var multer = require('multer');
var upload = multer({ dest: './uploads/' });

var quizController = require('../controllers/quiz_controller');
var commentController = require('../controllers/comment_controller');
var userController = require('../controllers/user_controller');
var sessionController = require('../controllers/session_controller');

router.get('/author', function (req, res, next) {
	res.render('author');
})

/* GET home page. */
router.get('/', function (req, res, next) {
	res.render('index');
});

// Autoload de parámetros
router.param('quizId', quizController.load); // autoload :quizId
router.param('userId', userController.load); // autoload :userId
router.param('commentId', commentController.load); // autoload :commentId

// Definición de rutas de cuenta
router.get('/users',								userController.index); //listado de usuarios
router.get('/users/:userId(\\d+)',					userController.show); // ver un usuario
router.get('/users/new',							userController.new);  // formulario sign in
router.post('/users',								userController.create); // registrar usuario
router.get('/users/:userId(\\d+)/edit',				sessionController.loginRequired,
												    userController.adminOrMyselfRequired,
												    userController.edit); // editar cuenta
router.put('/users/:userId(\\d+)',					sessionController.loginRequired,
												    userController.adminOrMyselfRequired,
												    userController.update); // actualizar cuenta
router.delete('/users/:userId(\\d+)',				sessionController.loginRequired, 
													userController.adminAndNotMyselfRequired,
													userController.destroy); // borrar cuenta

// Definición de rutas de sesión
router.get('/session',								sessionController.new); // formulario login
router.post('/session',								sessionController.create); // crear sesión
router.delete('/session',							sessionController.destroy); // destruir sesión

// Definición de rutas de /quizzes
router.get('/quizzes.:format?',						quizController.index);
router.get('/quizzes?search=busqueda',				quizController.index);
router.get('/quizzes/:quizId(\\d+).:format?',		quizController.show);
router.get('/quizzes/:quizId(\\d+)/check',			quizController.check);
router.get('/quizzes/new',							sessionController.loginRequired,
												    quizController.new);
router.post('/quizzes',								sessionController.loginRequired,
												    upload.single('image'),
												    quizController.create);
router.get('/quizzes/:quizId(\\d+)/edit',			sessionController.loginRequired, 
													quizController.ownershipRequired,
													quizController.edit);
router.put('/quizzes/:quizId(\\d+)',				sessionController.loginRequired,
													quizController.ownershipRequired,
													upload.single('image'),
													quizController.update);
router.delete('/quizzes/:quizId(\\d+)',				sessionController.loginRequired,
													quizController.ownershipRequired,
													quizController.destroy);

// Definición de rutas de comentarios
router.get('/quizzes/:quizId(\\d+)/comments/new',	sessionController.loginRequired, 
													commentController.new);
router.post('/quizzes/:quizId(\\d+)/comments',		sessionController.loginRequired, 
													commentController.create);
router.put('/quizzes/:quizId(\\d+)/comments/:commentId(\\d+)/accept', 
													sessionController.loginRequired,
													quizController.ownershipRequired,
													commentController.accept);





module.exports = router;
