const path = require('path');

module.exports = {
    entry: './src/index.tsx',
    mode: 'production',
    devtool: 'inline-source-map',
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.json']
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                use: 'babel-loader',
                test: /\.js/,
                exclude: /node_modules/
            },
            {
                test: /\.(s*)css$/,
                use: [
                  'style-loader',
                  'css-loader',
                  'sass-loader'
                ]
              },
            {
                test: /\.(jpe?g|png|gif|woff|woff2|eot|ttf|svg)(\?[a-z0-9=.]+)?$/,
                use: ['url-loader?limit=100000']
            }
            ]

    },
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'index.js',
    }
};
