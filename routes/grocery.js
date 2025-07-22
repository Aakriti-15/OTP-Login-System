const express = require ('express');
const router = express.Router();
const groceryController = require('../controllers/grocery');
const auth = require('../middleware/authMiddleware');

router.get('/grocery',auth, groceryController.getForm);
router.post('/grocery',auth, groceryController.saveList);

module.exports = router;