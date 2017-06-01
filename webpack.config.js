module.exports = [
  {
    entry : ['babel-polyfill', './react/index.js'],
    output: {
      path: __dirname + '/public/javascripts',
      filename: 'script.js'
    },
    devtool: 'source-map',
    module: {
      loaders: [
        {
          test: /\.js$/,
          loader: 'babel-loader',
          exclude: '/node_modules/',
          query: {
            cacheDirectory: true,
            presets: ['env', 'react']
          }
        }
      ]
    }
  }, {
    entry : ['babel-polyfill', './react/addUser/index.js'],
    output: {
      path: __dirname + '/public/javascripts',
      filename: 'addUserScript.js'
    },
    devtool: 'source-map',
    module: {
      loaders: [
        {
          test: /\.js$/,
          loader: 'babel-loader',
          exclude: '/node_modules/',
          query: {
            cacheDirectory: true,
            presets: ['env', 'react']
          }
        }
      ]
    }
  }, {
    entry : ['babel-polyfill', './react/admin/index.js'],
    output: {
      path: __dirname + '/public/javascripts',
      filename: 'adminScript.js'
    },
    devtool: 'source-map',
    module: {
      loaders: [
        {
          test: /\.js$/,
          loader: 'babel-loader',
          exclude: '/node_modules/',
          query: {
            cacheDirectory: true,
            presets: ['env', 'react']
          }
        }
      ]
    }
  }
]
