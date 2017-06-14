const axios = require('axios');
const mongoose = require('mongoose');
const Stock = mongoose.model('Stock');

function generateRequest(symbol) {
  // startDate is current date minus 3.154e+10 (number of ms in year)
  const startDate = new Date(Date.now() - 3.154e10).toISOString().slice(0, 10);
  const endDate = new Date(Date.now()).toISOString().slice(0, 10);

  return `https://www.quandl.com/api/v3/datasets/WIKI/${symbol}/data.json?api_key=${process.env.QUANDL_KEY}&order=asc&start_date=${startDate}&end_date=${endDate}`;
}

exports.getStocks = async (req, res) => {
  // Get all currently loaded stock data, render index
  try {
    const stocks = await Stock.find({}); // Get all stocks
    res.render('index', { stocks });
  } catch(e) {
    res.status(500).end();
  }
};

exports.addStock = async (req, res) => {
  // Add Symbol to DB, then return stock data
  const symbol = req.body.symbol;
  try {
    const stockRequest = await axios.get(generateRequest(symbol));
    const stock = await (new Stock(req.body)).save();

    res.json(stockRequest.data.dataset_data.data);
  } catch(e) {
    res.status(404).end();
  }
};

exports.deleteStock = async (req, res) => {
  try {
    const id = req.params.id;
    await Stock.findByIdAndRemove(id).exec();
    res.status(204).end();
  } catch(e) {
    res.status(500).end();
  }
};

exports.getStock = async (req, res) => {
  // Get data for a single symbol
  const symbol = req.params.symbol;

  const request = await axios.get(generateRequest(symbol));
  const stock = request.data.dataset_data;
  res.json(stock.data);
};
