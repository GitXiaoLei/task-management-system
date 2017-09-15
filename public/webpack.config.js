const path = require('path');
const webpack = require('webpack');
const WebpackNotifier = require('webpack-notifier');

const config = {
    entry: {
        m_department: './entry/m_department',
    },
    output: {
        path: path.resolve(__dirname, './build'),
        filename: '[name].js'
    },
    resolve: {
        extensions: ['.js', '.vue']
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.css/,
                loader: 'style-loader!css-loader'
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader'
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader'
            }
        ]
    },
    plugins: [
        new WebpackNotifier({ alwaysNotify: true }),
        new webpack.ProgressPlugin({
            $: 'jquery',
            jQuery: 'jquery'
        })
    ]
};

module.exports = config;