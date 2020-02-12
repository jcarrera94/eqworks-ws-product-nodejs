// import htmlWebpackPlugin from 'html-webpack-plugin';
// import liveReloadPlugin from 'webpack-livereload-plugin';
// const htmlWebpackPlugin = require('html-webpack-plugin');
// const liveReloadPlugin = require('webpack-livereload-plugin');
const path = require('path');

module.exports = {
  entry: path.resolve(__dirname, 'src', 'client', 'index.js'),
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: 'bundle.js'
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },
      {
        use: ['style-loader', 'css-loader'],
        test: /\.css$/
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader', 
            options: {
              sourceMap: true
            }
          },
          {
            loader: 'sass-loader', 
            options: {
              sourceMap: true
            }
          }
        ]
      }
    ]
  }
}
