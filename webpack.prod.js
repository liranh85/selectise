const merge = require('webpack-merge')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const safeParser = require('postcss-safe-parser')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const webpack = require('webpack')
const common = require('./webpack.common.js')

module.exports = merge(common, {
  plugins: [
    new OptimizeCssAssetsPlugin({
      cssProcessorOptions: {
        autoprefixer: { disable: true },
        discardComments: {
          removeAll: true
        },
        mergeLonghand: false,
        parser: safeParser,
        safe: true
      },
    }),
    new UglifyJSPlugin({
      uglifyOptions: {
        output: {
          comments: false
        },
        compress: {
          dead_code: true
        }
      }
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    })
  ],
  mode: 'production'
})
