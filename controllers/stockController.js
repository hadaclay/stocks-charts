const axios = require('axios');

exports.getStocks = (req, res) => {
  res.render('index');
};

exports.getStocksAPI = async (req, res) => {
  const symbol = req.params.symbol;
  const requestString = `https://www.quandl.com/api/v3/datasets/WIKI/${symbol}/data.json?api_key=${process.env.QUANDL_KEY}`;

  const request = await axios.get(requestString);
  const stocks = request.data;
  res.json(stocks);
};
