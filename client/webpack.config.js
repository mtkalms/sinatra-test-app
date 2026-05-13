const path = require('path');

module.exports = (env, argv) => {
  const isDev = argv.mode === 'development';

  return {
    entry: isDev ? ['./src/setPublicPath.js', './src/index.js'] : './src/index.js',
    output: {
      path: path.resolve(__dirname, '../public/js'),
      filename: 'bundle.js',
      publicPath: isDev ? '/' : '/js/',
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: 'babel-loader',
        },
      ],
    },
    resolve: {
      extensions: ['.js', '.jsx'],
    },
    devServer: {
      host: '0.0.0.0',
      port: 8080,
      hot: true,
      disableHostCheck: true,
      // Allow the Sinatra host to load the bundle cross-origin.
      headers: { 'Access-Control-Allow-Origin': '*' },
      // Serve static files from public/ so the dev server can also find them.
      contentBase: path.resolve(__dirname, '../public'),
    },
  };
};
