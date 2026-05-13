const path = require('path');

module.exports = (env, argv) => {
  const isDev = argv.mode === 'development';

  return {
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, '../public/js'),
      filename: 'bundle.js',
      // In dev the bundle is served from webpack-dev-server, not from disk.
      publicPath: isDev ? 'http://localhost:8080/' : '/js/',
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
      port: 8080,
      hot: true,
      // Allow the Sinatra host to load the bundle cross-origin.
      headers: { 'Access-Control-Allow-Origin': '*' },
      // Serve static files from public/ so the dev server can also find them.
      contentBase: path.resolve(__dirname, '../public'),
    },
  };
};
