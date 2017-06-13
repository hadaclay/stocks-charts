const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const stockSchema = new mongoose.Schema({
  symbol: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Stock', stockSchema);
