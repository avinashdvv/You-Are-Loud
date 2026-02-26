const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '../..');

module.exports = {
  context: projectRoot,
  entry: {
    background: './src/background/service-worker.ts',
    popup: './src/popup/index.tsx',
    content: './src/content/content-script.ts',
    offscreen: './src/offscreen/offscreen.ts',
  },
  output: {
    path: path.resolve(projectRoot, 'dist'),
    filename: '[name].js',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    modules: [
      'node_modules',
      path.join(monorepoRoot, 'node_modules'),
    ],
    extensions: ['.tsx', '.ts', '.js'],
  },
  resolveLoader: {
    modules: [
      'node_modules',
      path.join(monorepoRoot, 'node_modules'),
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/popup/popup.html',
      filename: 'popup.html',
      chunks: ['popup'],
    }),
    new HtmlWebpackPlugin({
      template: './src/offscreen/offscreen.html',
      filename: 'offscreen.html',
      chunks: ['offscreen'],
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'manifest.json', to: 'manifest.json' },
        { from: 'public/icons', to: 'icons', noErrorOnMissing: true },
      ],
    }),
  ],
};
