var express = require('express');
var router = express.Router();
var quizController = require('../controllers/quiz_controller');

router.get('/author', function (req, res, next) {
	res.render('author');
})

/* GET home page. */
router.get('/', function (req, res, next) {
	res.render('index');
});

// Autiload de rutas que usen :quizId
router.param('quizId', quizController.load); // autoload :quizId

// Definición de rutas de /quizzes
router.get('/quizzes',						quizController.index);
router.get('/quizzes/:quizId(\\d+)',		quizController.show);
router.get('/quizzes/:quizId(\\d+)/check',	quizController.check);
router.get('/quizzes?search=busqueda',		quizController.index);

module.exports = router;
