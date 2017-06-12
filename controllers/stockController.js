const axios = require('axios');

exports.getStocks = (req, res) => {
  res.render('index');
};

exports.getStocksAPI = async (req, res) => {
  const symbol = req.params.symbol;

  // startDate is current date minus 3.154e+10 (number of ms in year)
  const startDate = new Date(Date.now() - 3.154e+10).toISOString().slice(0, 10);
  const endDate = new Date(Date.now()).toISOString().slice(0, 10);

  const requestString = `https://www.quandl.com/api/v3/datasets/WIKI/${symbol}/data.json?api_key=${process.env.QUANDL_KEY}&order=asc&start_date=${startDate}&end_date=${endDate}`;

  const request = await axios.get(requestString);
  const stocks = request.data.dataset_data;
  res.json(stocks.data);
};
