const path = require('path');

module.exports = {
    entry: {
        login: path.resolve(__dirname, 'Scripts/src/login.js'),
        newslist: path.resolve(__dirname, 'Scripts/src/newslist.js'),
        newsedit: path.resolve(__dirname, 'Scripts/src/newsedit.js'),
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
    }
};




