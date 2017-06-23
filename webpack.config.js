const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const javascript = {
  test: /\.(js)$/,
  use: [
    {
      loader: 'babel-loader',
      options: { presets: ['es2015'] }
    }
  ]
};

const styles = {
  test: /\.(scss)$/,
  use: ExtractTextPlugin.extract([
    'css-loader?sourceMap',
    'sass-loader?sourceMap'
  ])
};

const uglify = new webpack.optimize.UglifyJsPlugin({
  compress: { warnings: false }
});

const config = {
  entry: {
    Client: './public/js/client.js'
  },
  devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, 'public', 'dist'),
    filename: '[name].bundle.js'
  },
  module: {
    rules: [javascript, styles]
  },
  plugins: [uglify, new ExtractTextPlugin('style.css')]
};

module.exports = config;
