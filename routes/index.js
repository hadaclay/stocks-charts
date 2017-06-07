const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stockController');

router.get('/', stockController.getStocks);

router.get('/api/stocks/:symbol', stockController.getStocksAPI);

module.exports = router;
