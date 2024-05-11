/* eslint-disable @typescript-eslint/no-var-requires */
const packageInfo = require('./package.json');
const path = require('path');
const { DefinePlugin } = require('webpack');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const WebpackUserscriptPlugin = require('webpack-userscript').default;
const { nanoid } = require('nanoid');

function getPurePackageName() {
  const { name } = packageInfo;
  if (typeof name !== 'string') return '';
  if (name.startsWith('@')) {
    return name.substring(name.indexOf('/') + 1);
  }

  return name;
}

module.exports = () => {
  const isDev = process.env.NODE_ENV === 'development';

  return {
    mode: isDev ? 'development' : 'production',
    entry: path.resolve(__dirname, 'src/index.ts'),
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: `${getPurePackageName()}.user.js`,
    },
    plugins: [
      new DefinePlugin({
        'process.env.VERSION': JSON.stringify(packageInfo.version),
        'process.env.SCRIPT_ID': JSON.stringify(nanoid()),
        'process.env.SCRIPT_FULL_NAME': JSON.stringify(
          packageInfo.fullDisplayName,
        ),
        'process.env.SCRIPT_NAME': JSON.stringify(packageInfo.displayName),
        'process.env.CROWDIN_DISTRIBUTION_HASH': JSON.stringify(
          'd1b4fd3a44adaf1825a0668031c',
        ),
      }),
      new WebpackUserscriptPlugin({
        headers: {
          name: packageInfo.fullDisplayName || getPurePackageName(),
          match: [
            'https://*.waze.com/*editor*',
            'https://waze.com/*editor*',
            'https://*.wazestg.com/*editor*',
          ],
          grant: [
            'GM_setValue',
            'GM_getValue',
            'GM_deleteValue',
            'GM_xmlhttpRequest',
          ],
          connect: [
            packageInfo.useWazeSpace && 'us.waze.space',
            'distributions.crowdin.net',
          ].filter(Boolean),
          require: [
            packageInfo.useWazeSpace &&
              'https://wazespace.github.io/userscripts-lib/index.js',
          ].filter(Boolean),
        },
        metajs: true,
        proxyScript: {
          baseURL: 'file://' + path.resolve(__dirname, 'dist') + '/',
          filename: '[basename].proxy.user.js',
          enable: () => isDev,
        },
      }),
      new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 1,
      }),
    ],
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            mangle: false,
          },
        }),
      ],
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'babel-loader',
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: ['.js', '.ts', '.tsx'],
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    target: 'web',
    externals: {
      react: 'window.React || unsafeWindow.React',
      'react-dom': 'window.ReactDOM || unsafeWindow.ReactDOM',
    },
  };
};
