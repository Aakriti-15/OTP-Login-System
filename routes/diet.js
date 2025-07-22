const express = require('express');
const router = express.Router();
const dietController = require('../controllers/diet');

//GET diet form
router.get('/diet', dietController.showDietForm);// in the controllers you will see the function where the user will come after reacher /diet of your website to fill the form

//POST diet form
router.post('/diet',dietController.generatePlan);// when user will submit the form this function will be called and it will generate diet plan which has logic written in the controllers


module.exports = router;
// both the logics are inside the controller diet.js
