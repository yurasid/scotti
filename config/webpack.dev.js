const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

const constants = require('./constants.js');

const devExtendConfig = {
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development')
        })
    ],
    target: 'electron',
    module: {
        rules: [
            {
                test: /\.svg$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            outputPath: 'assets/'
                        }
                    }
                ],
                exclude: [
                    path.resolve(constants.SHARED_SRC, './images/icons'),
                ]
            },
            {
                test: /\.(png|jpe?g|gif|ttf|woff|woff2|eot|otf)$/i,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            outputPath: '/assets/'
                        }
                    }
                ]
            },
            {
                test: /\.mp3$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            outputPath: '/assets/'
                        }
                    }
                ]
            }
        ]
    },
    output: {
        filename: '[name].js'
    },
    devtool: 'inline-source-map',
    // This is required for React Router. For production, or any other server,
    // you'll need to configure it to work with React Router
    // See here for more details: https://github.com/ReactTraining/react-router/blob/v1.0.3/docs/guides/basics/Histories.md#histories
    devServer: {
        headers: { 'Access-Control-Allow-Origin': '*' },
        historyApiFallback: true,
        contentBase: '../dist',
        hot: true,
        compress: true,
        port: 9000,
        host: '0.0.0.0',
        index: 'concierge.html'
    }
};

module.exports = [merge(common.conciergeCommon, devExtendConfig), merge(common.terminalCommon, devExtendConfig)];