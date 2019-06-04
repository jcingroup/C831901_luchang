const path = require('path');
var webpack = require('webpack');
module.exports = {
    entry: {
        app: path.resolve(__dirname, 'Scripts/src/app.jsx'),
        news: path.resolve(__dirname, 'Scripts/src/news/app.js'),
        httpunity: path.resolve(__dirname, 'Scripts/src/httpunity.js'),
        
    },
    output: {
        path: path.resolve(__dirname, 'Scripts/dist'),
        filename: '[name].js'
    },
    module: {
        rules: [
            {
                test: /\.js|jsx$/,
                exclude: /node_modules/,
                use: [
                    'babel-loader',
                ]
            },
        ]
    },
    resolve: {
        extensions: ['.js', '.css']
    }
};




