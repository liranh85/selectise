const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const cleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = {
  entry: {
    example: [
      path.resolve('src', 'example', 'index.js')
    ],
    main: [
      'idempotent-babel-polyfill',
      path.resolve('src', 'index.js')
    ]
  },
  output: {
    path: path.resolve('dist'),
    filename: path.join('[name]', 'index.js'),
    library: 'Selectise',
    libraryTarget: 'umd'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract(
          {
            fallback: 'style-loader',
            use: [
              {
                loader: 'css-loader',
                options: {
                  sourceMap: true
                }
              },
              {
                loader: 'postcss-loader',
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
        )
      }
    ]
  },
  plugins: [
    new cleanWebpackPlugin('dist', {}),
    new ExtractTextPlugin('[name]/style.css'),
    new HtmlWebpackPlugin({
      inject: false,
      hash: true,
      template: path.join(__dirname, 'src', 'example', 'index.html'),
      filename: path.join('example', 'index.html')
    })
  ]
}
