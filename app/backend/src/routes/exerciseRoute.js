const express = require('express');
const router = express.Router();
const {getAllExercises, createExercise} = require('../controllers/exerciseCtrl');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');

router.get('/', getAllExercises);
router.post('/', createExercise);

module.exports = router;