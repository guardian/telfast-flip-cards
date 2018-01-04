var path = require('path')
var webpack = require('webpack')
var pkg = require('./package.json')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var CopyWebpackPlugin = require('copy-webpack-plugin')

//detect target env
let production = process.env.NODE_ENV === 'production'

/**
 * Plugin config
 */

// extract css to file
let extractCss = new ExtractTextPlugin({
  filename: '[name].css?[contenthash:8]',
  disable: !production,
})

// write banner to file headers
let bannerPlugin = new webpack.BannerPlugin({
  banner: `
  name: ${pkg.name}
  description: ${pkg.description}
  author: ${pkg.author}
  version: ${pkg.version}
  build: ${new Date().toISOString()}
  `,
})

// compile and export html file
let htmlPlugin = new HtmlWebpackPlugin({
  template: 'dev/index.jade',
  minify: false,
  hash: false,
})

// copy static files
let copyPlugin = new CopyWebpackPlugin([
  {
    from: 'dev/static',
    to: 'static',
    ignore: ['**/.DS_Store', '**/.gitkeep'],
  },
])

/**
 * Build config
 */

module.exports = {
  // main app entry point
  entry: {
    app: './dev/assets/js/app.js',
  },
  resolve: {
    // alias paths for easy includes
    alias: {
      assets: path.resolve(__dirname, 'dev/assets'),
      vue$: 'vue/dist/vue.esm.js',
    },
    extensions: ['*', '.js', '.vue', '.json'],
  },
  externals: {
    // well load all refs to jquery from cdn
    jquery: 'jQuery',
  },
  output: {
    // output settings
    path: path.resolve(__dirname, 'public'),
    filename: '[name].js?[hash:8]',
  },
  module: {
    rules: [
      {
        // load html
        test: /\.html/,
        loader: 'html-loader',
        options: {
          minimize: false,
        },
      },
      {
        // load pug/jade files
        test: /\.(jade|pug)/,
        loader: ['html-loader', 'pug-html-loader'],
      },
      {
        // load less/css files
        test: /\.(less|css)/,
        use: extractCss.extract({
          use: [
            {
              loader: 'css-loader',
              options: {
                sourceMap: true,
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: true,
                config: {
                  path: 'postcss.config.js',
                },
              },
            },
            {
              loader: 'less-loader',
              options: {
                sourceMap: true,
              },
            },
          ],
          // load styles via js if not in production
          // this allows hot replacement to work for css
          fallback: 'style-loader',
        }),
      },
      {
        // pre lint js files
        enforce: 'pre',
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {},
          // other vue-loader options go here
        },
      },
      {
        // load js files
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        // load image files
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: 'assets/img/[name].[ext]?[hash:8]',
        },
      },
    ],
  },
  // load plugins
  plugins: [
    extractCss,
    bannerPlugin,
    htmlPlugin,
    copyPlugin,
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      },
    }),
  ],
  // dev server config
  devServer: {
    historyApiFallback: true,
    noInfo: true,
    overlay: true,
    stats: 'minimal',
  },
  // sourcemap options
  devtool: '#eval-source-map',
}

/**
 * Production config
 */

if (production) {
  // disable sourcemap for production
  module.exports.devtool = false
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: false,
      compress: {
        warnings: false,
      },
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
    }),
  ])
}
