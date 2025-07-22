const express = require ('express');
const router = express.Router();
const consultController = require('../controllers/consult');
const auth = require('../middleware/authMiddleware');

router.get('/consult', auth, consultController.getForm);
router.post('/consult', auth, consultController.submitRequest);

module.exports = router;