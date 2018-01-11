const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const constants = require('./constants.js');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    plugins: [
        new ExtractTextPlugin({
            filename: `[name].css`,
            disable: process.env.NODE_ENV === 'development'
        }),
        new CleanWebpackPlugin(
            ['dist'],
            { root: path.resolve(__dirname, '..') }
        ),
        new HtmlWebpackPlugin({
            title: 'CONCIERGE',
            filename: 'index.html',
            chunks: ['concierge'],
            alwaysWriteToDisk: true,
            template: path.join(constants.CONCIERGE_SRC, 'index.ejs')
        }),


        new webpack.NamedModulesPlugin()
    ],
    output: {
        path: constants.DIST,
        publicPath: '/'
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: [
                    'babel-loader'
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