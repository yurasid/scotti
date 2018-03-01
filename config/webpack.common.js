const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const WebpackShellPlugin = require('webpack-shell-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const merge = require('webpack-merge');

const constants = require('./constants.js');

const hotReloading = 'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000';

const defConfig = {
    plugins: [
        new ExtractTextPlugin({
            filename: '[name].css',
            disable: process.env.NODE_ENV === 'development'
        }),
        new WebpackShellPlugin({
            onBuildStart: ['echo "Webpack Start"'],
            onBuildEnd: [
                `${path.resolve(__dirname, '../node_modules/.bin/electron-icon-maker')} --input=${path.resolve(__dirname, '../src/concierge/icon.png')} --output=${path.resolve(__dirname, '../dist/concierge')}`,
                `${path.resolve(__dirname, '../node_modules/.bin/babel-node')} ${path.resolve(__dirname, '../scripts/translate.js')}`,
                'echo "Webpack End"'
            ]
        }),
        new webpack.NamedModulesPlugin()
    ],
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        query: {
                            presets: ['es2017', 'react'],
                            plugins: [
                                'transform-class-properties',
                                ['transform-es2015-classes', { loose: true }],
                                'transform-object-rest-spread'
                            ]
                        }
                    },
                    'eslint-loader'
                ]
            },
            {
                test: /\.css$/,
                use: ['css-hot-loader'].concat(ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                modules: true,
                                localIdentName: '[path]___[name]_[local]_[hash:base64:5]'
                            }
                        },
                        'postcss-loader'
                    ]
                }))
            },
            {
                test: /\.svg$/,
                use: [
                    'svg-react-loader'
                ],
                include: [
                    path.resolve(constants.SHARED_SRC, './images/icons'),
                ]
            },
            {
                test: /\.global\.scss$/,
                use: ['css-hot-loader'].concat(ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        { loader: 'css-loader', query: { modules: false, sourceMaps: true } },
                        { loader: 'sass-loader', query: { sourceMaps: true } }
                    ]
                }))
            },
            {
                test: /(^((?!(global)).)*)\.scss$/,
                use: ['css-hot-loader'].concat(ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader',
                            query: {
                                modules: true,
                                sourceMaps: true,
                                importLoaders: 2,
                                localIdentName: '[path]___[name]_[local]_[hash:base64:5]'
                            }
                        },
                        { loader: 'sass-loader', query: { sourceMaps: true } }
                    ]
                })),
            }
        ]
    },
    // This is so you can import files without their extensions
    resolve: {
        modules: [
            'node_modules',
            constants.SRC
        ],
        extensions: ['.js', '.jsx'],
    },
};

module.exports = {
    conciergeCommon: merge(defConfig, {
        name: 'concierge',
        entry: [/* hotReloading,  */'babel-polyfill', path.join(constants.SRC, '/concierge/app.js')],
        output: {
            path: path.resolve(constants.DIST, './concierge'),
        },
        plugins: [
            new CleanWebpackPlugin(
                [constants.CONCIERGE_DIST, constants.MESSAGES_DIR],
                { root: path.resolve(__dirname, '..') }
            ),
            new CopyWebpackPlugin([
                {
                    from: path.join(constants.CONCIERGE_SRC, 'electron/*'),
                    to: path.join(constants.CONCIERGE_DIST, '[name].[ext]')
                }
            ]),
            new HtmlWebpackPlugin({
                title: 'CONCIERGE',
                filename: 'index.html',
                alwaysWriteToDisk: true,
                template: path.join(constants.CONCIERGE_SRC, 'index.ejs')
            }),
        ]
    }),
    terminalCommon: merge(defConfig, {
        name: 'terminal',
        entry: [/* hotReloading,  */'babel-polyfill', path.join(constants.SRC, '/terminal/app.js')],
        output: {
            path: path.resolve(constants.DIST, './terminal')
        },
        plugins: [
            new CleanWebpackPlugin(
                [constants.TERMINAL_DIST, constants.MESSAGES_DIR],
                { root: path.resolve(__dirname, '..') }
            ),
            new CopyWebpackPlugin([
                {
                    from: path.join(constants.TERMINAL_SRC, 'electron/*'),
                    to: path.join(constants.TERMINAL_DIST, '[name].[ext]')
                }
            ]),
            new HtmlWebpackPlugin({
                title: 'TERMINAL',
                filename: 'index.html',
                alwaysWriteToDisk: true,
                template: path.join(constants.TERMINAL_SRC, 'index.ejs')
            }),
        ]
    })
};