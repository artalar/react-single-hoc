const path = require('path');
const PeerDepsExternalsPlugin = require('peer-deps-externals-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: path.join(__dirname, 'src/index.js'),
  target: 'node',
  output: {
    filename: 'index.js',
    path: path.join(
      __dirname,
      process.env.BABEL_ENV === 'commonjs' ? 'lib' : 'es',
    ),
    library: 'ups',
    libraryTarget: 'umd',
  },
  module: {
    rules: [
      {
        test: /\.js/,
        exclude: /(node_modules)/,
        use: [
          {
            loader: 'babel-loader',
          },
        ],
      },
    ],
  },
  plugins: [new PeerDepsExternalsPlugin()],
  stats: {
    colors: true,
  },
};
