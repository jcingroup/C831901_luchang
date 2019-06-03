const path = require('path');

module.exports = {
    entry: {
        app: path.resolve(__dirname, 'Scripts/src/app.js'),
        newslist: path.resolve(__dirname, 'Scripts/src/newslist.js'),
        newsadd: path.resolve(__dirname, 'Scripts/src/newsadd.js'),
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




