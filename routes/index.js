const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stockController');

router.get('/', stockController.getStocks);
router.get('/api/stock/:symbol', stockController.getStock);

router.post('/api/add', stockController.addStock);
router.delete('/api/stock/:id', stockController.deleteStock);

module.exports = router;
