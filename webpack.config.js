const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const javascript = {
  test: /\.(js)$/,
  use: [
    {
      loader: 'babel-loader',
      exclude: '/node_modules/',
      options: {
        presets: ['es2015'],
        plugins: ['transform-async-to-generator', 'transform-runtime']
      }
    }
  ]
};

const styles = {
  test: /\.(scss)$/,
  use: ExtractTextPlugin.extract([
    'css-loader',
    'sass-loader'
  ])
};

const uglify = new webpack.optimize.UglifyJsPlugin({
  compress: { warnings: false }
});

const config = {
  entry: {
    Client: './public/javascript/client.js'
  },
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
