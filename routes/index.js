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

// Definición de rutas de /quizzes
router.get('/quizzes',						quizController.index);
router.get('/quizzes/:quizId(\\d+)',		quizController.show);
router.get('/quizzes/:quizId(\\d+)/check',	quizController.check);

module.exports = router;
